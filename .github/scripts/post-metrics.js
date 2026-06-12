/**
 * Requirement 3 — Track Claude Usage Metrics and Cost
 *
 * Reads token usage from environment variables set by the workflow.
 * If real token counts are 0 (not exposed by claude-code-action@beta),
 * estimates tokens from PR diff size and findings count.
 * Calculates estimated cost, prints to workflow logs,
 * and posts a metrics comment on the Pull Request.
 */

const https = require("https");

// ── Environment variables from workflow ──────────────────────────────────────
const GITHUB_TOKEN   = process.env.GITHUB_TOKEN;
const REPO           = process.env.GITHUB_REPOSITORY;
const PR_NUMBER      = process.env.PR_NUMBER;
const MODEL          = process.env.CLAUDE_MODEL         || "claude-haiku-4-5-20251001";
const RAW_INPUT      = parseInt(process.env.INPUT_TOKENS  || "0", 10);
const RAW_OUTPUT     = parseInt(process.env.OUTPUT_TOKENS || "0", 10);
const TIMESTAMP      = process.env.REVIEW_TIMESTAMP     || new Date().toISOString();
const FINDINGS_COUNT = parseInt(process.env.FINDINGS_COUNT || "0", 10);

// Option A — Estimation inputs (from workflow diff measurement)
let DIFF_CHARS     = parseInt(process.env.DIFF_CHARS    || "0", 10);
const PROMPT_CHARS   = parseInt(process.env.PROMPT_CHARS  || "2500", 10);
let FILES_CHANGED  = parseInt(process.env.FILES_CHANGED || "0", 10);
let RESOLVED_FINDINGS = parseInt(process.env.FINDINGS_COUNT || "0", 10);

// ── Fetch PR data from GitHub API when diff is unavailable ───────────────────
// Used when triggered by issue_comment — git diff returns 0
async function fetchPRDataFromAPI() {
  if (!GITHUB_TOKEN || !REPO || !PR_NUMBER) return;

  const [owner, repo] = REPO.split("/");

  // Fetch PR files changed
  const filesResult = await githubRequest("GET", `/pulls/${PR_NUMBER}/files?per_page=100`);
  if (filesResult.status === 200 && Array.isArray(filesResult.data)) {
    FILES_CHANGED = filesResult.data.length;
    DIFF_CHARS = filesResult.data.reduce((sum, f) => {
      return sum + (f.additions || 0) * 50 + (f.deletions || 0) * 50;
    }, 0);
    console.log(`Fetched from GitHub API: ${FILES_CHANGED} files, ~${DIFF_CHARS} diff chars`);
  }

  // Fetch findings count from latest Claude PR comment
  const commentsResult = await githubRequest("GET", `/issues/${PR_NUMBER}/comments?per_page=100`);
  if (commentsResult.status === 200 && Array.isArray(commentsResult.data)) {
    for (const comment of commentsResult.data.reverse()) {
      const body = comment.body || "";

      // Count findings by matching "severity" occurrences in JSON
      // More reliable than parsing the full JSON array
      const severityMatches = body.match(/"severity"\s*:/g);
      if (severityMatches && severityMatches.length > 0) {
        // Also verify it looks like Claude findings (has "file" and "issue" fields)
        if (body.includes('"file"') && body.includes('"issue"')) {
          RESOLVED_FINDINGS = severityMatches.length;
          console.log(`Fetched findings count from PR comment: ${RESOLVED_FINDINGS}`);
          break;
        }
      }
    }
  }
}

// ── Token estimation (Option A) ───────────────────────────────────────────────
function estimateTokens(diffChars, promptChars, findingsCount) {
  const inputTokens  = Math.round((diffChars + promptChars) / 4);
  const outputTokens = Math.round(findingsCount * 150);
  return { inputTokens, outputTokens, isEstimated: true };
}

// Determine whether to use real or estimated tokens
function resolveTokens() {
  if (RAW_INPUT > 0 || RAW_OUTPUT > 0) {
    return { inputTokens: RAW_INPUT, outputTokens: RAW_OUTPUT, isEstimated: false };
  }
  return estimateTokens(DIFF_CHARS, PROMPT_CHARS, RESOLVED_FINDINGS);
}

// ── Pricing table (USD per 1M tokens) ────────────────────────────────────────
const PRICING = {
  "claude-haiku-4-5-20251001":  { input: 0.80,  output: 4.00  },
  "claude-sonnet-4-6":          { input: 3.00,  output: 15.00 },
  "claude-opus-4-6":            { input: 15.00, output: 75.00 },
};

function getPrice(model) {
  for (const [key, price] of Object.entries(PRICING)) {
    if (model.includes(key) || key.includes(model)) return price;
  }
  return PRICING["claude-haiku-4-5-20251001"]; // default
}

function calculateCost(inputTokens, outputTokens, model) {
  const price = getPrice(model);
  const inputCost  = (inputTokens  / 1_000_000) * price.input;
  const outputCost = (outputTokens / 1_000_000) * price.output;
  return {
    inputCost:  inputCost.toFixed(6),
    outputCost: outputCost.toFixed(6),
    totalCost:  (inputCost + outputCost).toFixed(6),
  };
}

function formatNumber(n) {
  return n.toLocaleString("en-US");
}

function formatTimestamp(ts) {
  try {
    return new Date(ts).toUTCString();
  } catch {
    return ts;
  }
}

// ── GitHub API helper ─────────────────────────────────────────────────────────
function githubRequest(method, path, body) {
  return new Promise((resolve, reject) => {
    if (!GITHUB_TOKEN || !REPO) {
      resolve({ status: 0, data: {} });
      return;
    }
    const payload = body ? JSON.stringify(body) : null;
    const [owner, repo] = REPO.split("/");
    const options = {
      hostname: "api.github.com",
      path: `/repos/${owner}/${repo}${path}`,
      method,
      headers: {
        "Authorization": `Bearer ${GITHUB_TOKEN}`,
        "User-Agent":    "claude-post-metrics",
        "Accept":        "application/vnd.github+json",
        "Content-Type":  "application/json",
        ...(payload ? { "Content-Length": Buffer.byteLength(payload) } : {}),
      },
    };
    const req = https.request(options, (res) => {
      let data = "";
      res.on("data", chunk => data += chunk);
      res.on("end", () => {
        try { resolve({ status: res.statusCode, data: JSON.parse(data) }); }
        catch { resolve({ status: res.statusCode, data: {} }); }
      });
    });
    req.on("error", reject);
    if (payload) req.write(payload);
    req.end();
  });
}

// ── Build PR comment body ─────────────────────────────────────────────────────
function buildComment(metrics) {
  const modelShort = MODEL.replace("-20251001", "").replace("claude-", "Claude ");
  const tag = metrics.isEstimated ? " *(est.)*" : "";
  const note = metrics.isEstimated
    ? `> ⚠️ *Token counts are estimated (diff: ${formatNumber(DIFF_CHARS)} chars, ${FILES_CHANGED} files, ${FINDINGS_COUNT} findings). Actual counts not exposed by claude-code-action@beta yet.*\n\n`
    : "";

  return [
    `## 📊 Claude Review Metrics — PR #${PR_NUMBER}`,
    ``,
    `| Metric | Value |`,
    `|--------|-------|`,
    `| 🤖 Model | \`${modelShort}\` |`,
    `| 📁 Files Reviewed | ${FILES_CHANGED} files |`,
    `| 📥 Input Tokens | ${formatNumber(metrics.inputTokens)}${tag} |`,
    `| 📤 Output Tokens | ${formatNumber(metrics.outputTokens)}${tag} |`,
    `| 🔢 Total Tokens | ${formatNumber(metrics.totalTokens)}${tag} |`,
    `| 💰 Input Cost | \`$${metrics.inputCost}\`${tag} |`,
    `| 💰 Output Cost | \`$${metrics.outputCost}\`${tag} |`,
    `| 💵 Total Cost | **\`$${metrics.totalCost}\`**${tag} |`,
    `| 🔍 Findings | ${metrics.findingsCount} issues found |`,
    `| ⏱️ Reviewed At | ${formatTimestamp(TIMESTAMP)} |`,
    `| 🔗 Pull Request | #${PR_NUMBER} |`,
    ``,
    note,
    `> 💡 *Pricing: ${modelShort} — $${getPrice(MODEL).input}/1M input tokens, $${getPrice(MODEL).output}/1M output tokens*`,
    ``,
    `---`,
    `*Metrics automatically tracked by Claude Code CI — Requirement 3*`,
  ].join("\n");
}

// ── Main ──────────────────────────────────────────────────────────────────────
async function run() {
  // If diff data is missing (triggered by issue_comment), fetch from GitHub API
  if (DIFF_CHARS === 0 && FILES_CHANGED === 0) {
    console.log("Diff data missing — fetching PR data from GitHub API...");
    await fetchPRDataFromAPI();
  }

  const { inputTokens, outputTokens, isEstimated } = resolveTokens();
  const totalTokens = inputTokens + outputTokens;
  const { inputCost, outputCost, totalCost } = calculateCost(inputTokens, outputTokens, MODEL);

  const metrics = {
    model:         MODEL,
    inputTokens,
    outputTokens,
    totalTokens,
    inputCost,
    outputCost,
    totalCost,
    isEstimated,
    findingsCount: RESOLVED_FINDINGS,
    filesChanged:  FILES_CHANGED,
    timestamp:     TIMESTAMP,
    prNumber:      PR_NUMBER,
  };

  const estimatedTag = isEstimated ? " (estimated)" : " (actual)";

  // ── Print to workflow logs ──────────────────────────────────────────────
  console.log("");
  console.log("╔══════════════════════════════════════════════════════╗");
  console.log("║       Claude Review Metrics (Requirement 3)          ║");
  console.log("╠══════════════════════════════════════════════════════╣");
  console.log(`║  Model         : ${MODEL.substring(0,34).padEnd(34)}║`);
  console.log(`║  PR Number     : #${String(PR_NUMBER).padEnd(33)}║`);
  console.log(`║  Files Reviewed: ${String(FILES_CHANGED).padEnd(34)}║`);
  console.log(`║  Diff Size     : ${formatNumber(DIFF_CHARS).padEnd(28)} chars  ║`);
  console.log(`║  Input Tokens  : ${formatNumber(inputTokens).padEnd(28)}${estimatedTag.padEnd(6)}║`);
  console.log(`║  Output Tokens : ${formatNumber(outputTokens).padEnd(28)}${estimatedTag.padEnd(6)}║`);
  console.log(`║  Total Tokens  : ${formatNumber(totalTokens).padEnd(28)}${estimatedTag.padEnd(6)}║`);
  console.log(`║  Input Cost    : $${inputCost.padEnd(33)}║`);
  console.log(`║  Output Cost   : $${outputCost.padEnd(33)}║`);
  console.log(`║  Total Cost    : $${totalCost.padEnd(33)}║`);
  console.log(`║  Findings      : ${String(FINDINGS_COUNT).padEnd(34)}║`);
  console.log(`║  Timestamp     : ${TIMESTAMP.substring(0, 34).padEnd(34)}║`);
  console.log("╚══════════════════════════════════════════════════════╝");
  console.log("");

  if (isEstimated) {
    console.log("ℹ️  Token counts are ESTIMATED (claude-code-action@beta does not expose real counts)");
    console.log(`   Formula: input = (${formatNumber(DIFF_CHARS)} diff chars + ${PROMPT_CHARS} prompt chars) ÷ 4`);
    console.log(`            output = ${FINDINGS_COUNT} findings × 150 tokens/finding`);
    console.log("");
  }

  // ── Post PR comment ─────────────────────────────────────────────────────
  if (!GITHUB_TOKEN || !REPO || !PR_NUMBER || PR_NUMBER === "0") {
    console.log("Skipping PR comment — missing GitHub env vars.");
    return;
  }

  const commentBody = buildComment(metrics);
  const result = await githubRequest("POST", `/issues/${PR_NUMBER}/comments`, { body: commentBody });

  if (result.status === 201) {
    console.log(`✅ Metrics comment posted: ${result.data.html_url}`);
  } else {
    console.log(`❌ Failed to post comment (${result.status})`);
  }
}

run().catch(console.error);
