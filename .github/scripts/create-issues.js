/**
 * Requirement 2 — Create GitHub Issues for Claude Review Findings
 *
 * Reads Claude's JSON findings from claude-findings.json,
 * checks for existing duplicate issues, and creates a new
 * GitHub Issue for each unique finding with:
 *   - Title with severity prefix
 *   - Full description with reasoning and fix
 *   - Severity/priority label
 *   - Category label
 *   - PR reference link
 *   - Duplicate prevention
 */

const https = require("https");
const fs    = require("fs");

const FINDINGS_FILE  = "claude-findings.json";
const GITHUB_TOKEN   = process.env.GITHUB_TOKEN;
const REPO           = process.env.GITHUB_REPOSITORY;   // "owner/repo"
const PR_NUMBER      = process.env.PR_NUMBER;
const PR_URL         = process.env.PR_URL;

// ── Helpers ──────────────────────────────────────────────────────────────────

function githubRequest(method, path, body) {
  return new Promise((resolve, reject) => {
    if (!GITHUB_TOKEN || !REPO) {
      console.log("Missing GitHub env vars — skipping issue creation.");
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
        try {
          resolve({ status: res.statusCode, data: JSON.parse(data) });
        } catch {
          resolve({ status: res.statusCode, data: [] });
        }
      });
    });

    req.on("error", reject);
    if (payload) req.write(payload);
    req.end();
  });
}

// ── Severity → label + emoji ──────────────────────────────────────────────

function severityEmoji(severity) {
  const map = {
    critical: "🔴",
    high:     "🟠",
    medium:   "🟡",
    low:      "🟢",
  };
  return map[severity] ?? "⚪";
}

function severityLabel(severity) {
  const map = {
    critical: "priority: critical",
    high:     "priority: high",
    medium:   "priority: medium",
    low:      "priority: low",
  };
  return map[severity] ?? "priority: low";
}

function categoryLabel(category) {
  const map = {
    "security":       "security",
    "access-control": "security",
    "validation":     "bug",
    "logic-bug":      "bug",
    "code-quality":   "code quality",
    "type-safety":    "code quality",
    "edge-case":      "bug",
  };
  return map[category] ?? "enhancement";
}

// ── Build issue title ─────────────────────────────────────────────────────

function buildTitle(finding) {
  const emoji    = severityEmoji(finding.severity);
  const severity = (finding.severity ?? "low").toUpperCase();
  const file     = finding.file ? finding.file.split("/").pop() : "unknown";
  const issue    = finding.issue ?? "Code issue";
  return `${emoji} [${severity}] ${issue} — ${file}`;
}

// ── Build issue body ──────────────────────────────────────────────────────

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
    `\`\`\``,
    finding.fix ?? "No fix provided.",
    `\`\`\``,
    ``,
    `### 🔗 Reference`,
    `Found during automated Claude Code Review on ${prRef}`,
    ``,
    `---`,
    `*This issue was automatically created by Claude Code CI. To fix, comment \`@claude fix\` on the PR.*`,
  ].join("\n");
}

// ── Fetch existing open issues to prevent duplicates ─────────────────────

async function fetchExistingIssues() {
  const result = await githubRequest("GET", "/issues?state=open&per_page=100&labels=claude-review");
  if (result.status !== 200) return [];
  return Array.isArray(result.data) ? result.data : [];
}

// ── Ensure required labels exist ─────────────────────────────────────────

async function ensureLabel(name, color, description) {
  await githubRequest("POST", "/labels", { name, color, description });
  // If label already exists GitHub returns 422 — we ignore that
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

// ── Main ──────────────────────────────────────────────────────────────────

async function run() {
  // Read findings
  if (!fs.existsSync(FINDINGS_FILE)) {
    console.log("No findings file found — skipping issue creation.");
    return;
  }

  let findings;
  try {
    findings = JSON.parse(fs.readFileSync(FINDINGS_FILE, "utf8"));
  } catch {
    console.log("Could not parse findings file — skipping.");
    return;
  }

  if (!findings || !findings.length) {
    console.log("No findings — no issues to create.");
    return;
  }

  console.log(`Found ${findings.length} findings. Checking for duplicates...`);

  // Ensure labels exist
  await ensureLabels();

  // Fetch existing issues
  const existingIssues = await fetchExistingIssues();
  const existingTitles = new Set(existingIssues.map(i => i.title));
  console.log(`Existing open claude-review issues: ${existingTitles.size}`);

  let created = 0;
  let skipped = 0;

  for (const finding of findings) {
    const title = buildTitle(finding);

    // Duplicate check
    if (existingTitles.has(title)) {
      console.log(`  SKIP (duplicate): ${title}`);
      skipped++;
      continue;
    }

    const body   = buildBody(finding);
    const labels = [
      "claude-review",
      categoryLabel(finding.category),
      severityLabel(finding.severity),
    ].filter((v, i, a) => a.indexOf(v) === i); // deduplicate labels

    const result = await githubRequest("POST", "/issues", { title, body, labels });

    if (result.status === 201) {
      console.log(`  CREATED: ${title}`);
      console.log(`  URL: ${result.data.html_url}`);
      existingTitles.add(title); // prevent duplicates within same run
      created++;
    } else {
      console.log(`  FAILED (${result.status}): ${title}`);
    }

    // Small delay to avoid rate limiting
    await new Promise(r => setTimeout(r, 300));
  }

  console.log(`\nDone — Created: ${created} | Skipped (duplicates): ${skipped}`);
}

run().catch(console.error);
