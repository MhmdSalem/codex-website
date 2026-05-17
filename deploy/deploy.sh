#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────────────────────────
# Update an already-deployed instance to the latest commit on `main`.
# Run as the deploy user inside the project root.
# ─────────────────────────────────────────────────────────────────────────────
set -euo pipefail

APP_DIR="${APP_DIR:-$HOME/codex-website}"
BRANCH="${BRANCH:-main}"

cd "$APP_DIR"

echo "▶ pulling $BRANCH..."
git fetch origin
git checkout "$BRANCH"
git pull --ff-only

echo "▶ installing deps (frozen lockfile)..."
npm ci --no-audit --no-fund

echo "▶ building..."
NODE_OPTIONS="--max-old-space-size=2048" npm run build

echo "▶ reloading PM2..."
pm2 reload deploy/ecosystem.config.cjs --env production --update-env

echo "▶ done. Status:"
pm2 status codex-web
