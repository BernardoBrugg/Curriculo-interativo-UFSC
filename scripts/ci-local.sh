#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

fail() {
  echo "local CI gate failed: $*" >&2
  exit 1
}

require_command() {
  command -v "$1" >/dev/null || fail "missing required command: $1"
}

run_shell_syntax_checks() {
  (
    cd "$ROOT_DIR"
    bash -n scripts/*.sh tests/*.sh .githooks/*
  )
}

run_repository_checks() {
  (
    cd "$ROOT_DIR"
    tests/push-gate-check.sh
    tests/project-guidance-check.sh
  )
}

run_application_checks() {
  (
    cd "$ROOT_DIR"
    npm run lint
    npm run typecheck
    npm test
    npm run build
    npm run seed:curricula
  )
}

main() {
  require_command npm
  require_command node
  require_command git

  run_shell_syntax_checks
  run_repository_checks
  run_application_checks

  echo "local CI gate passed"
}

main "$@"
