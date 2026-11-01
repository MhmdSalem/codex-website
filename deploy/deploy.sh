#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────────────────────────
# Bring the server up to the latest commit on `main` and restart the site.
#
# Run it by hand on the server, from any folder:
#
#   APP_DIR=~/htdocs/codex-tech.ai bash deploy/deploy.sh
#
# What it does, in order:
#   1. loads nvm if the server uses it (CloudPanel does), checks Node >= 22.12
#   2. clones the repo into APP_DIR on first run, otherwise hard-resets it to
#      origin/main — .env.local and node_modules are untracked and survive
#   3. installs dependencies and builds
#   4. stops the previous site's PM2 process if it ran from this same folder
#   5. starts or reloads the site under PM2 and saves the process list
# ─────────────────────────────────────────────────────────────────────────────
set -euo pipefail

APP_DIR="${APP_DIR:-$HOME/codex-website}"
BRANCH="${BRANCH:-main}"
REPO_URL="${REPO_URL:-https://github.com/MhmdSalem/codex-website.git}"
APP_NAME="codex-tech"
LEGACY_APP_NAME="codex-web"

say() { printf '\n▶ %s\n' "$*"; }

# ── 1. Node ──────────────────────────────────────────────────────────────────
# Non-interactive SSH sessions do not read .bashrc, so nvm is not on PATH yet.
export NVM_DIR="${NVM_DIR:-$HOME/.nvm}"
if [[ -s "$NVM_DIR/nvm.sh" ]]; then
  # shellcheck disable=SC1091
  . "$NVM_DIR/nvm.sh"
fi

if ! command -v node >/dev/null 2>&1; then
  echo "✖ Node.js is not installed for $(whoami). Install Node 22 (CloudPanel: site settings → Node.js version)." >&2
  exit 1
fi

node -e '
  const [major, minor] = process.versions.node.split(".").map(Number);
  if (major < 22 || (major === 22 && minor < 12)) {
    console.error("✖ Node " + process.versions.node + " is too old; the site needs 22.12 or newer.");
    process.exit(1);
  }
'
say "Node $(node --version), npm $(npm --version)"

# ── 2. Code ──────────────────────────────────────────────────────────────────
if [[ ! -d "$APP_DIR/.git" ]]; then
  say "First deploy: cloning $REPO_URL into $APP_DIR"
  mkdir -p "$APP_DIR"
  if [[ -n "$(ls -A "$APP_DIR" 2>/dev/null)" ]]; then
    # CloudPanel puts a placeholder page in a new site's folder.
    git -C "$APP_DIR" init -q
    git -C "$APP_DIR" remote add origin "$REPO_URL"
  else
    git clone --branch "$BRANCH" "$REPO_URL" "$APP_DIR"
  fi
fi

cd "$APP_DIR"
git remote set-url origin "$REPO_URL"
say "Updating to origin/$BRANCH"
git fetch --prune origin "$BRANCH"
# A hard reset, not a pull: main was rewritten once and may be again, and the
# server never carries changes of its own to tracked files.
git checkout -B "$BRANCH" "origin/$BRANCH" -f
git reset --hard "origin/$BRANCH"
git log -1 --format='  %h %s (%an, %ar)'

if [[ ! -f .env.local ]]; then
  echo "  ⚠ No .env.local in $APP_DIR — the site will build with defaults (no CMS, no form delivery)."
fi

# ── 3. Build ─────────────────────────────────────────────────────────────────
say "Installing dependencies"
npm ci --no-audit --no-fund

say "Building"
NODE_OPTIONS="--max-old-space-size=2048" npm run build

# ── 4. Retire the previous site ──────────────────────────────────────────────
# The old site ran as "codex-web" on the same port. Only removed when it was
# running from this very folder, so an unrelated app on the server is never touched.
if ! command -v pm2 >/dev/null 2>&1; then
  say "Installing PM2"
  npm install -g pm2
fi

legacy_cwd="$(pm2 jlist 2>/dev/null | node -e '
  let data = "";
  process.stdin.on("data", (chunk) => (data += chunk));
  process.stdin.on("end", () => {
    try {
      const app = JSON.parse(data).find((p) => p.name === process.argv[1]);
      process.stdout.write(app ? app.pm2_env.pm_cwd || "" : "");
    } catch {}
  });
' "$LEGACY_APP_NAME" || true)"

if [[ -n "$legacy_cwd" ]] && [[ "$(cd "$legacy_cwd" 2>/dev/null && pwd -P)" == "$(pwd -P)" ]]; then
  say "Stopping the previous site ($LEGACY_APP_NAME) that ran from this folder"
  pm2 delete "$LEGACY_APP_NAME"
fi

# ── 5. Run ───────────────────────────────────────────────────────────────────
say "Starting $APP_NAME"
pm2 startOrReload ecosystem.config.cjs --update-env
pm2 save

say "Done"
pm2 status "$APP_NAME"
