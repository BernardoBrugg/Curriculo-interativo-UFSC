#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

fail() {
  echo "project guidance check failed: $*" >&2
  exit 1
}

require_file() {
  local path="$1"
  test -f "$ROOT_DIR/$path" || fail "missing $path"
}

require_ignored() {
  local path="$1"
  git -C "$ROOT_DIR" check-ignore -q "$path" || fail "$path must be ignored by git"
}

cd "$ROOT_DIR"

require_file AGENTS.md
require_file README.md
require_file package.json
require_file tsconfig.json
require_file .gitignore
require_file .github/workflows/ci.yml
require_file .githooks/pre-push
require_file scripts/ci-local.sh
require_file scripts/install-git-hooks.sh
require_file .env.example
require_file vercel.json

require_ignored .env
require_ignored .env.local
require_ignored .next/build-manifest.json
require_ignored node_modules/example/index.js

node <<'NODE_CHECK'
const fs = require("fs");
const path = require("path");

const root = process.cwd();
const checkDirs = ["src", "scripts", "tests"];
const missingReadme = [];

function checkDirectory(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const hasReadme = entries.some(e => e.isFile() && e.name.toLowerCase() === "readme.md");
  if (!hasReadme) {
    missingReadme.push(path.relative(root, dir));
  }
  for (const entry of entries) {
    if (entry.isDirectory()) {
      if (entry.name !== "node_modules" && entry.name !== ".next" && entry.name !== ".git") {
        checkDirectory(path.join(dir, entry.name));
      }
    }
  }
}

for (const dir of checkDirs) {
  checkDirectory(path.join(root, dir));
}

if (missingReadme.length > 0) {
  console.error("Directories missing README.md:", missingReadme);
  process.exit(1);
}

function findSourceFiles(dir, list = []) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name !== "node_modules" && entry.name !== ".next" && entry.name !== ".git") {
        findSourceFiles(full, list);
      }
    } else if (entry.isFile() && /\.(ts|tsx|js|sh)$/.test(entry.name)) {
      list.push(full);
    }
  }
  return list;
}

const sourceFiles = [
  ...findSourceFiles(path.join(root, "src")),
  ...findSourceFiles(path.join(root, "scripts")),
  ...findSourceFiles(path.join(root, "tests")),
  ...findSourceFiles(path.join(root, ".githooks"))
];

let commentErrors = 0;
for (const file of sourceFiles) {
  const content = fs.readFileSync(file, "utf8");
  const lines = content.split("\n");
  let inBlockComment = false;
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const stripped = line.replace(/https?:\/\/\S+/g, "").trim();
    if (file.endsWith(".sh")) {
      if (i === 0 && line.startsWith("#!")) continue;
      if (stripped.startsWith("#")) {
        console.error(`In-code comment forbidden in ${path.relative(root, file)}:${i + 1}: ${line}`);
        commentErrors++;
      }
    } else {
      if (inBlockComment) {
        console.error(`In-code comment forbidden in ${path.relative(root, file)}:${i + 1}: ${line}`);
        commentErrors++;
        if (stripped.includes("*/")) {
          inBlockComment = false;
        }
        continue;
      }
      if (stripped.includes("/*")) {
        console.error(`In-code comment forbidden in ${path.relative(root, file)}:${i + 1}: ${line}`);
        commentErrors++;
        if (!stripped.includes("*/")) {
          inBlockComment = true;
        }
        continue;
      }
      if (stripped.includes("//")) {
        console.error(`In-code comment forbidden in ${path.relative(root, file)}:${i + 1}: ${line}`);
        commentErrors++;
      }
    }
  }
}

if (commentErrors > 0) {
  console.error(`Total forbidden comments found: ${commentErrors}`);
  process.exit(1);
}
NODE_CHECK

echo "project guidance checks passed"
