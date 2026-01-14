#!/usr/bin/env bash
set -euo pipefail

# Simple local run helper for development tailored to this project.
# Inspired by your example: supports `foreground`, numeric port, and DATABASE_URL.
# Usage:
#   ./run.sh [foreground] [port] [database_url]
# Examples:
#   ./run.sh                -> foreground=0, PORT=3000, DATABASE_URL=file:dev.db
#   ./run.sh foreground 8080 sqlite:./dev.db

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

# parse arguments: support `foreground` keyword and numeric port
FOREGROUND=0
if [ "${1-}" = "foreground" ]; then
  FOREGROUND=1
  shift
fi

# now $1 (if present) should be a port number or empty
if [[ "${1-}" =~ ^[0-9]+$ ]]; then
  PORT=$1
  shift
else
  PORT=${1:-3000}
  if [[ "$PORT" =~ ^[0-9]+$ ]]; then :; else PORT=3000; fi
  # if first arg was used as port above it will be shifted; keep behavior consistent
  if [[ "${2-}" != "" && "$1" != "$2" ]]; then :; fi
fi

DATABASE_URL=${1:-file:dev.db}

export PORT
export DATABASE_URL
export NODE_ENV=development

# Output with clickable terminal link (OSC 8 escape sequence)
SERVER_HOST="127.0.0.1"
SERVER_URL="http://${SERVER_HOST}:${PORT}"
echo ""
echo "════════════════════════════════════════════════════════════"
echo "🚀 DEV SERVER RUNNING"
echo "════════════════════════════════════════════════════════════"
echo ""
echo "✨ Server starting at:"
echo ""
printf "   \033]8;;${SERVER_URL}\033\\🔗 ${SERVER_URL}\033]8;;\033\\\n"
echo ""
echo "📁 Database: ${DATABASE_URL}"
echo "🌐 Host: ${SERVER_HOST}"
echo "🔌 Port: ${PORT}"
echo ""
echo "════════════════════════════════════════════════════════════"
echo ""

# Start npm run dev in background (unless foreground requested)
if [ "$FOREGROUND" -eq 1 ]; then
  echo "Running in foreground..."
  exec npx --yes tsx server/index.ts
else
  npm run dev &
  DEV_PID=$!

  # ensure we kill child on script exit
  cleanup() {
    if kill -0 "$DEV_PID" 2>/dev/null; then
      echo "\nShutting down dev server (pid $DEV_PID)"
      kill "$DEV_PID" 2>/dev/null || true
      wait "$DEV_PID" 2>/dev/null || true
    fi
  }
  trap cleanup EXIT INT TERM

  # Wait for server to start (check if port is listening)
  echo "⏳ Waiting for server to start on ${SERVER_HOST}:${PORT}..."
  for i in {1..60}; do
    if nc -z "$SERVER_HOST" ${PORT} 2>/dev/null; then
      echo "✅ Server ready! Opening browser..."
      sleep 1
      if command -v open &> /dev/null; then
        open "${SERVER_URL}"
      elif command -v xdg-open &> /dev/null; then
        xdg-open "${SERVER_URL}" &>/dev/null || true
      fi
      break
    fi

    # if process exited early, fail fast
    if ! kill -0 "$DEV_PID" 2>/dev/null; then
      echo "❌ Dev server process exited unexpectedly. See logs above." >&2
      wait "$DEV_PID" || true
      exit 1
    fi

    sleep 0.5
  done

  # Wait for the background dev process to finish (forward logs remain visible)
  wait "$DEV_PID"
fi

