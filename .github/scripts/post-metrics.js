/**
 * Requirement 3 — Track Claude Usage Metrics and Cost
 *
 * Reads token usage from environment variables set by the workflow,
 * calculates estimated cost based on the model used,
 * prints a summary to workflow logs,
 * and posts a metrics comment on the Pull Request.
 */

const https = require("https");

// ── Environment variables from workflow ──────────────────────────────────────
const GITHUB_TOKEN  = process.env.GITHUB_TOKEN;
const REPO          = process.env.GITHUB_REPOSITORY;
const PR_NUMBER     = process.env.PR_NUMBER;
const MODEL         = process.env.CLAUDE_MODEL        || "claude-haiku-4-5-20251001";
const INPUT_TOKENS  = parseInt(process.env.INPUT_TOKENS  || "0", 10);
const OUTPUT_TOKENS = parseInt(process.env.OUTPUT_TOKENS || "0", 10);
const TIMESTAMP     = process.env.REVIEW_TIMESTAMP    || new Date().toISOString();
const FINDINGS_COUNT = parseInt(process.env.FINDINGS_COUNT || "0", 10);

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
  return [
    `## 📊 Claude Review Metrics — PR #${PR_NUMBER}`,
    ``,
    `| Metric | Value |`,
    `|--------|-------|`,
    `| 🤖 Model | \`${modelShort}\` |`,
    `| 📥 Input Tokens | ${formatNumber(metrics.inputTokens)} |`,
    `| 📤 Output Tokens | ${formatNumber(metrics.outputTokens)} |`,
    `| 🔢 Total Tokens | ${formatNumber(metrics.totalTokens)} |`,
    `| 💰 Input Cost | \`$${metrics.inputCost}\` |`,
    `| 💰 Output Cost | \`$${metrics.outputCost}\` |`,
    `| 💵 Total Estimated Cost | **\`$${metrics.totalCost}\`** |`,
    `| 🔍 Findings Count | ${metrics.findingsCount} issues found |`,
    `| ⏱️ Reviewed At | ${formatTimestamp(TIMESTAMP)} |`,
    `| 🔗 Pull Request | #${PR_NUMBER} |`,
    ``,
    `> 💡 *Pricing based on ${modelShort} rates: $${getPrice(MODEL).input}/1M input tokens, $${getPrice(MODEL).output}/1M output tokens*`,
    ``,
    `---`,
    `*Metrics automatically tracked by Claude Code CI — Requirement 3*`,
  ].join("\n");
}

// ── Main ──────────────────────────────────────────────────────────────────────
async function run() {
  const totalTokens = INPUT_TOKENS + OUTPUT_TOKENS;
  const { inputCost, outputCost, totalCost } = calculateCost(INPUT_TOKENS, OUTPUT_TOKENS, MODEL);

  const metrics = {
    model:         MODEL,
    inputTokens:   INPUT_TOKENS,
    outputTokens:  OUTPUT_TOKENS,
    totalTokens,
    inputCost,
    outputCost,
    totalCost,
    findingsCount: FINDINGS_COUNT,
    timestamp:     TIMESTAMP,
    prNumber:      PR_NUMBER,
  };

  // ── Print to workflow logs ──────────────────────────────────────────────
  console.log("");
  console.log("╔══════════════════════════════════════════════════╗");
  console.log("║       Claude Review Metrics (Requirement 3)      ║");
  console.log("╠══════════════════════════════════════════════════╣");
  console.log(`║  Model         : ${MODEL.padEnd(32)}║`);
  console.log(`║  PR Number     : #${String(PR_NUMBER).padEnd(31)}║`);
  console.log(`║  Input Tokens  : ${formatNumber(INPUT_TOKENS).padEnd(32)}║`);
  console.log(`║  Output Tokens : ${formatNumber(OUTPUT_TOKENS).padEnd(32)}║`);
  console.log(`║  Total Tokens  : ${formatNumber(totalTokens).padEnd(32)}║`);
  console.log(`║  Input Cost    : $${inputCost.padEnd(31)}║`);
  console.log(`║  Output Cost   : $${outputCost.padEnd(31)}║`);
  console.log(`║  Total Cost    : $${totalCost.padEnd(31)}║`);
  console.log(`║  Findings      : ${String(FINDINGS_COUNT).padEnd(32)}║`);
  console.log(`║  Timestamp     : ${TIMESTAMP.substring(0, 32).padEnd(32)}║`);
  console.log("╚══════════════════════════════════════════════════╝");
  console.log("");

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
