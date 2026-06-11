/**
 * Requirement 2 — Create GitHub Issues for Claude Review Findings
 *
 * Reads Claude's JSON findings from the latest PR comment,
 * checks for existing duplicate issues, and creates a new
 * GitHub Issue for each unique finding.
 */

const https = require("https");

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const REPO        = process.env.GITHUB_REPOSITORY;  // "owner/repo"
const PR_NUMBER   = process.env.PR_NUMBER;
const PR_URL      = process.env.PR_URL;

// ── GitHub API helper ────────────────────────────────────────────────────────

function githubRequest(method, path, body) {
  return new Promise((resolve, reject) => {
    if (!GITHUB_TOKEN || !REPO) {
      console.log("Missing GitHub env vars — skipping.");
      resolve({ status: 0, data: [] });
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
        "User-Agent":    "claude-create-issues",
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
        catch { resolve({ status: res.statusCode, data: [] }); }
      });
    });

    req.on("error", reject);
    if (payload) req.write(payload);
    req.end();
  });
}

// ── Fetch PR comments and extract JSON findings ──────────────────────────────

async function extractFindingsFromPRComments() {
  console.log(`Fetching PR comments for PR #${PR_NUMBER}...`);

  const result = await githubRequest("GET", `/issues/${PR_NUMBER}/comments?per_page=100`);
  if (result.status !== 200 || !Array.isArray(result.data)) {
    console.log("Could not fetch PR comments.");
    return [];
  }

  const comments = result.data;
  console.log(`Found ${comments.length} comments on PR.`);

  // Look through comments from newest to oldest for Claude's JSON findings
  for (const comment of comments.reverse()) {
    const body = comment.body || "";

    // Try to find a JSON array in the comment
    const jsonMatches = body.match(/\[[\s\S]*?\]/g);
    if (!jsonMatches) continue;

    for (const match of jsonMatches) {
      try {
        const parsed = JSON.parse(match);
        // Validate it looks like Claude findings (has file, severity, issue fields)
        if (
          Array.isArray(parsed) &&
          parsed.length > 0 &&
          parsed[0].file &&
          parsed[0].severity &&
          parsed[0].issue
        ) {
          console.log(`✅ Found ${parsed.length} findings in PR comment by ${comment.user?.login}`);
          return parsed;
        }
      } catch {
        // Not valid JSON — try next match
      }
    }
  }

  console.log("No valid JSON findings found in PR comments.");
  return [];
}

// ── Severity helpers ─────────────────────────────────────────────────────────

function severityEmoji(severity) {
  return { critical: "🔴", high: "🟠", medium: "🟡", low: "🟢" }[severity] ?? "⚪";
}

function severityLabel(severity) {
  return {
    critical: "priority: critical",
    high:     "priority: high",
    medium:   "priority: medium",
    low:      "priority: low",
  }[severity] ?? "priority: low";
}

function categoryLabel(category) {
  return {
    "security":       "security",
    "access-control": "security",
    "validation":     "bug",
    "logic-bug":      "bug",
    "code-quality":   "code quality",
    "type-safety":    "code quality",
    "edge-case":      "bug",
  }[category] ?? "enhancement";
}

// ── Build issue title and body ───────────────────────────────────────────────

function buildTitle(finding) {
  const emoji    = severityEmoji(finding.severity);
  const severity = (finding.severity ?? "low").toUpperCase();
  const file     = finding.file ? finding.file.split("/").pop() : "unknown";
  const issue    = finding.issue ?? "Code issue";
  return `${emoji} [${severity}] ${issue} — ${file}`;
}

function buildBody(finding) {
  const prRef = PR_URL
    ? `[Pull Request #${PR_NUMBER}](${PR_URL})`
    : `Pull Request #${PR_NUMBER}`;

  return [
    `## ${severityEmoji(finding.severity)} ${finding.issue ?? "Code Issue"}`,
    ``,
    `### 📁 Location`,
    `- **File:** \`${finding.file ?? "unknown"}\``,
    `- **Line:** ${finding.line ?? "N/A"}`,
    `- **Category:** \`${finding.category ?? "general"}\``,
    `- **Severity:** \`${finding.severity ?? "low"}\``,
    ``,
    `### 🔍 Description`,
    finding.issue ?? "No description provided.",
    ``,
    `### 💡 Reasoning`,
    finding.reasoning ?? "No reasoning provided.",
    ``,
    `### 🔧 Suggested Fix`,
    "```",
    finding.fix ?? "No fix provided.",
    "```",
    ``,
    `### 🔗 Reference`,
    `Found during automated Claude Code Review on ${prRef}`,
    ``,
    `---`,
    `*This issue was automatically created by Claude Code CI. To fix, comment \`@claude fix\` on the PR.*`,
  ].join("\n");
}

// ── Ensure labels exist ──────────────────────────────────────────────────────

async function ensureLabel(name, color, description) {
  await githubRequest("POST", "/labels", { name, color, description });
}

async function ensureLabels() {
  await ensureLabel("claude-review",      "0075ca", "Created by Claude Code CI");
  await ensureLabel("security",           "d73a4a", "Security vulnerability");
  await ensureLabel("bug",                "ee0701", "Something is broken");
  await ensureLabel("code quality",       "e4e669", "Code quality improvement");
  await ensureLabel("enhancement",        "a2eeef", "New feature or improvement");
  await ensureLabel("priority: critical", "b60205", "Critical priority");
  await ensureLabel("priority: high",     "d93f0b", "High priority");
  await ensureLabel("priority: medium",   "e4e669", "Medium priority");
  await ensureLabel("priority: low",      "0e8a16", "Low priority");
}

// ── Fetch existing issues for duplicate prevention ───────────────────────────

async function fetchExistingIssueTitles() {
  const result = await githubRequest("GET", "/issues?state=open&per_page=100&labels=claude-review");
  if (result.status !== 200 || !Array.isArray(result.data)) return new Set();
  return new Set(result.data.map(i => i.title));
}

// ── Main ─────────────────────────────────────────────────────────────────────

async function run() {
  console.log("=== Create GitHub Issues from Claude Findings ===");

  const findings = await extractFindingsFromPRComments();

  if (!findings.length) {
    console.log("No findings to create issues for.");
    return;
  }

  console.log(`Processing ${findings.length} findings...`);

  await ensureLabels();

  const existingTitles = await fetchExistingIssueTitles();
  console.log(`Existing claude-review issues: ${existingTitles.size}`);

  let created = 0;
  let skipped = 0;

  for (const finding of findings) {
    const title = buildTitle(finding);

    if (existingTitles.has(title)) {
      console.log(`  SKIP (duplicate): ${title}`);
      skipped++;
      continue;
    }

    const labels = [
      "claude-review",
      categoryLabel(finding.category),
      severityLabel(finding.severity),
    ].filter((v, i, a) => a.indexOf(v) === i);

    const result = await githubRequest("POST", "/issues", {
      title,
      body: buildBody(finding),
      labels,
    });

    if (result.status === 201) {
      console.log(`  ✅ CREATED: ${title}`);
      console.log(`     URL: ${result.data.html_url}`);
      existingTitles.add(title);
      created++;
    } else {
      console.log(`  ❌ FAILED (${result.status}): ${title}`);
      console.log(`     Response: ${JSON.stringify(result.data).substring(0, 200)}`);
    }

    await new Promise(r => setTimeout(r, 300));
  }

  console.log(`\n=== Done — Created: ${created} | Skipped: ${skipped} ===`);
}

run().catch(console.error);
