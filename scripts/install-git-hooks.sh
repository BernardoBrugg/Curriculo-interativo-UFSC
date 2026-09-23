#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

if [ ! -d "$ROOT_DIR/.git" ] || ! command -v git >/dev/null 2>&1; then
  exit 0
fi

git -C "$ROOT_DIR" config core.hooksPath "$ROOT_DIR/.githooks"
echo "Git hooks habilitados a partir de $ROOT_DIR/.githooks"
