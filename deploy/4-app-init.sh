#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────────────────────────
# STEP 4 — Clone repo, install deps, build, and start with PM2
# Run as the deploy user (NOT root):
#   bash 4-app-init.sh
# ─────────────────────────────────────────────────────────────────────────────
set -euo pipefail

GITHUB_REPO="${GITHUB_REPO:-https://github.com/MhmdSalem/codex-website.git}"
APP_DIR="${APP_DIR:-$HOME/codex-website}"
BRANCH="${BRANCH:-main}"

log()  { printf "\n\033[1;36m▶ %s\033[0m\n" "$*"; }
ok()   { printf "\033[1;32m✓ %s\033[0m\n" "$*"; }

if [[ "$(id -u)" -eq 0 ]]; then
  echo "Run this script as the deploy user, NOT root."
  exit 1
fi

# ── Clone or pull ────────────────────────────────────────────────────────────
if [[ ! -d "$APP_DIR/.git" ]]; then
  log "Cloning $GITHUB_REPO ..."
  git clone --branch "$BRANCH" "$GITHUB_REPO" "$APP_DIR"
else
  log "Pulling latest from $BRANCH ..."
  git -C "$APP_DIR" fetch origin
  git -C "$APP_DIR" checkout "$BRANCH"
  git -C "$APP_DIR" pull --ff-only
fi
cd "$APP_DIR"

# ── .env.local setup hint ────────────────────────────────────────────────────
if [[ ! -f .env.local ]]; then
  cp .env.example .env.local
  echo
  echo "════════════════════════════════════════════════════════════════════════"
  echo "  ⚠ .env.local was just created from the template."
  echo "  ⚠ Edit it now with the real values:"
  echo "      nano $APP_DIR/.env.local"
  echo "  Then re-run this script."
  echo "════════════════════════════════════════════════════════════════════════"
  exit 0
fi

# ── Install + build ──────────────────────────────────────────────────────────
log "Installing dependencies..."
npm ci

log "Building Next.js for production..."
NODE_OPTIONS="--max-old-space-size=2048" npm run build

# ── Seed (idempotent) ────────────────────────────────────────────────────────
log "Running database seed..."
npm run seed || true

# ── PM2 ──────────────────────────────────────────────────────────────────────
log "Starting / reloading PM2 process..."
if pm2 describe codex-web >/dev/null 2>&1; then
  pm2 reload deploy/ecosystem.config.cjs --env production
else
  pm2 start deploy/ecosystem.config.cjs --env production
  pm2 save
  # Configure PM2 to start on boot (only first time)
  if [[ ! -f /etc/systemd/system/pm2-$USER.service ]]; then
    sudo env PATH=$PATH:/usr/bin pm2 startup systemd -u "$USER" --hp "$HOME" || true
    pm2 save
  fi
fi

ok "App is up: pm2 status"
echo
echo "Next steps:"
echo "  - As root, copy deploy/nginx.conf to /etc/nginx/sites-available/codex.conf"
echo "  - Enable it and run certbot for SSL (see deploy/README.md)"
