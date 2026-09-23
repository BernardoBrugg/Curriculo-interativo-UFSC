#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

fail() {
  echo "push gate check failed: $*" >&2
  exit 1
}

require_file() {
  local path="$1"
  test -f "$ROOT_DIR/$path" || fail "missing $path"
  test -x "$ROOT_DIR/$path" || fail "$path must be executable"
}

require_text() {
  local path="$1"
  local text="$2"
  grep -Fq "$text" "$ROOT_DIR/$path" || fail "$path must contain: $text"
}

cd "$ROOT_DIR"

require_file scripts/ci-local.sh
require_file scripts/install-git-hooks.sh
require_file .githooks/pre-push
require_file tests/push-gate-check.sh
require_file tests/project-guidance-check.sh

test -f .github/workflows/ci.yml || fail "missing .github/workflows/ci.yml"

require_text .githooks/pre-push 'git rev-parse --show-toplevel'
require_text .githooks/pre-push 'scripts/ci-local.sh'
require_text scripts/install-git-hooks.sh 'config core.hooksPath'
require_text scripts/ci-local.sh 'npm run lint'
require_text scripts/ci-local.sh 'npm run typecheck'
require_text scripts/ci-local.sh 'npm test'
require_text scripts/ci-local.sh 'npm run build'
require_text scripts/ci-local.sh 'npm run seed:curricula'
require_text .github/workflows/ci.yml 'contents: read'
require_text .github/workflows/ci.yml 'cancel-in-progress: true'
require_text .github/workflows/ci.yml 'npm test'
require_text .github/workflows/ci.yml 'npm run typecheck'

echo "push gate checks passed"
