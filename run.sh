#!/usr/bin/env bash
set -euo pipefail

# run.sh — simple runner for this project
# Usage: ./run.sh {dev|build|start|check|reinstall}

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

usage() {
  echo "Usage: $0 {dev|build|start|check|reinstall}"
  exit 1
}

case ${1-} in
  dev)
    export NODE_ENV=development
    if ! command -v tsx >/dev/null; then
      echo "tsx not found — installing dev deps..."
      npm install --no-audit --no-fund
    fi
    exec tsx server/index.ts
    ;;

  build)
    npm run build
    ;;

  start)
    export NODE_ENV=production
    if [ ! -f dist/index.cjs ]; then
      echo "Build not found — running build first."
      npm run build
    fi
    exec node dist/index.cjs
    ;;

  check)
    npm run check
    ;;

  reinstall)
    echo "Removing node_modules and lockfile, then installing..."
    rm -rf node_modules package-lock.json
    npm install
    ;;

  *)
    usage
    ;;
esac
