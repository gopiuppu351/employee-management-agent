/**
 * Q5 — No Repeat Findings
 *
 * This script reads Claude's latest findings from claude-findings.json,
 * fetches already-posted PR comments from GitHub, and filters out any
 * findings that were already reported in a previous run on the same PR.
 *
 * Output: writes deduplicated-findings.json with only NEW findings.
 */

const fs = require("fs");
const https = require("https");

const FINDINGS_FILE = "claude-findings.json";
const OUTPUT_FILE   = "deduplicated-findings.json";

const GITHUB_TOKEN  = process.env.GITHUB_TOKEN;
const REPO          = process.env.GITHUB_REPOSITORY;        // e.g. "gopiuppu351/employee-management-agent"
const PR_NUMBER     = process.env.PR_NUMBER;

// If no findings file exists, write empty array and exit
if (!fs.existsSync(FINDINGS_FILE)) {
  console.log("No findings file found. Writing empty output.");
  fs.writeFileSync(OUTPUT_FILE, "[]");
  process.exit(0);
}

const newFindings = JSON.parse(fs.readFileSync(FINDINGS_FILE, "utf8"));

if (!newFindings.length) {
  console.log("No findings to deduplicate.");
  fs.writeFileSync(OUTPUT_FILE, "[]");
  process.exit(0);
}

// Fetch existing PR comments from GitHub API
function fetchExistingComments() {
  return new Promise((resolve, reject) => {
    if (!GITHUB_TOKEN || !REPO || !PR_NUMBER) {
      console.log("Missing GitHub env vars — skipping deduplication, keeping all findings.");
      resolve([]);
      return;
    }

    const [owner, repo] = REPO.split("/");
    const options = {
      hostname: "api.github.com",
      path: `/repos/${owner}/${repo}/issues/${PR_NUMBER}/comments?per_page=100`,
      method: "GET",
      headers: {
        "Authorization": `Bearer ${GITHUB_TOKEN}`,
        "User-Agent": "claude-dedup-script",
        "Accept": "application/vnd.github+json"
      }
    };

    const req = https.request(options, (res) => {
      let data = "";
      res.on("data", chunk => data += chunk);
      res.on("end", () => {
        try {
          resolve(JSON.parse(data));
        } catch {
          resolve([]);
        }
      });
    });

    req.on("error", () => resolve([]));
    req.end();
  });
}

// Build a fingerprint for a finding — file + line + issue keyword
function fingerprint(finding) {
  const issueKey = finding.issue
    ? finding.issue.toLowerCase().replace(/\s+/g, " ").trim().substring(0, 60)
    : "";
  return `${finding.file}:${finding.line}:${issueKey}`;
}

async function run() {
  const existingComments = await fetchExistingComments();

  // Extract fingerprints from already-posted Claude comments
  const postedFingerprints = new Set();
  for (const comment of existingComments) {
    if (comment.body && comment.body.includes('"file"')) {
      // Try to parse any JSON embedded in previous Claude comments
      const jsonMatch = comment.body.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        try {
          const parsed = JSON.parse(jsonMatch[0]);
          for (const f of parsed) {
            postedFingerprints.add(fingerprint(f));
          }
        } catch {
          // Not valid JSON — skip
        }
      }
      // Also check for plain file:line patterns in comment text
      const lineMatches = comment.body.matchAll(/"file":\s*"([^"]+)".*?"line":\s*(\d+)/gs);
      for (const match of lineMatches) {
        postedFingerprints.add(`${match[1]}:${match[2]}:`);
      }
    }
  }

  console.log(`Previously posted fingerprints: ${postedFingerprints.size}`);

  // Filter out findings already posted
  const deduplicated = newFindings.filter(f => {
    const fp = fingerprint(f);
    const isDuplicate = postedFingerprints.has(fp);
    if (isDuplicate) {
      console.log(`  Skipping duplicate: ${fp}`);
    }
    return !isDuplicate;
  });

  console.log(`New findings: ${newFindings.length} → After dedup: ${deduplicated.length}`);
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(deduplicated, null, 2));
  console.log(`Written to ${OUTPUT_FILE}`);
}

run();
