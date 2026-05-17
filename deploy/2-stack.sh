#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────────────────────────
# STEP 2 — Install Node.js 20, Nginx, MongoDB 7, PM2, Certbot
# Usage (run as root):
#   bash 2-stack.sh
# ─────────────────────────────────────────────────────────────────────────────
set -euo pipefail

log()  { printf "\n\033[1;36m▶ %s\033[0m\n" "$*"; }
ok()   { printf "\033[1;32m✓ %s\033[0m\n" "$*"; }

if [[ "$(id -u)" -ne 0 ]]; then
  echo "Please run as root."
  exit 1
fi

UBUNTU_CODENAME="$(lsb_release -cs)"

# ── Node.js 20 LTS ───────────────────────────────────────────────────────────
if ! command -v node &>/dev/null; then
  log "Installing Node.js 20 LTS..."
  curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
  apt-get install -y nodejs
  ok "node $(node -v) / npm $(npm -v)"
else
  ok "node already installed: $(node -v)"
fi

# ── PM2 ──────────────────────────────────────────────────────────────────────
if ! command -v pm2 &>/dev/null; then
  log "Installing PM2..."
  npm install -g pm2
  pm2 install pm2-logrotate
  pm2 set pm2-logrotate:max_size 20M
  pm2 set pm2-logrotate:retain 14
  ok "PM2 installed"
else
  ok "PM2 already installed"
fi

# ── Nginx ────────────────────────────────────────────────────────────────────
if ! command -v nginx &>/dev/null; then
  log "Installing Nginx..."
  apt-get install -y nginx
  systemctl enable --now nginx
  ok "Nginx installed"
else
  ok "Nginx already installed"
fi

# ── Certbot (Let's Encrypt) ──────────────────────────────────────────────────
if ! command -v certbot &>/dev/null; then
  log "Installing Certbot (snap)..."
  apt-get install -y snapd
  snap install core; snap refresh core
  snap install --classic certbot
  ln -sf /snap/bin/certbot /usr/bin/certbot
  ok "Certbot installed"
else
  ok "Certbot already installed"
fi

# ── MongoDB 8.0 (works on Ubuntu 22.04 jammy & 24.04 noble) ──────────────────
if ! command -v mongod &>/dev/null; then
  # MongoDB 8.0 is the first major version that supports noble (Ubuntu 24.04)
  # officially, so we install it for both 22.04 and 24.04.
  MONGO_VERSION="8.0"

  case "$UBUNTU_CODENAME" in
    jammy|noble)
      MONGO_REPO_CODENAME="$UBUNTU_CODENAME"
      ;;
    *)
      # Fall back to jammy for unknown codenames (best-effort compat).
      MONGO_REPO_CODENAME="jammy"
      ;;
  esac

  log "Installing MongoDB ${MONGO_VERSION} for Ubuntu ${UBUNTU_CODENAME} (repo: ${MONGO_REPO_CODENAME})..."

  curl -fsSL "https://www.mongodb.org/static/pgp/server-${MONGO_VERSION}.asc" \
    | gpg -o "/usr/share/keyrings/mongodb-server-${MONGO_VERSION}.gpg" --dearmor

  echo "deb [ arch=amd64,arm64 signed-by=/usr/share/keyrings/mongodb-server-${MONGO_VERSION}.gpg ] https://repo.mongodb.org/apt/ubuntu ${MONGO_REPO_CODENAME}/mongodb-org/${MONGO_VERSION} multiverse" \
    > "/etc/apt/sources.list.d/mongodb-org-${MONGO_VERSION}.list"

  apt-get update -y
  apt-get install -y mongodb-org

  # Bind to localhost only (security)
  sed -i 's/^  bindIp:.*/  bindIp: 127.0.0.1/' /etc/mongod.conf

  # Limit WiredTiger cache on small VPS (1GB)
  if ! grep -q "wiredTiger" /etc/mongod.conf; then
    cat >> /etc/mongod.conf <<'EOF'

storage:
  wiredTiger:
    engineConfig:
      cacheSizeGB: 1
EOF
  fi

  systemctl enable --now mongod
  sleep 4
  ok "MongoDB ${MONGO_VERSION} installed and running on 127.0.0.1:27017"
else
  ok "MongoDB already installed"
fi

# ── Logging dir ──────────────────────────────────────────────────────────────
mkdir -p /var/log/codex
chown deploy:deploy /var/log/codex 2>/dev/null || true

log "Stack installation complete."
echo
echo "Next steps:"
echo "  1. Run: bash 3-mongodb-secure.sh    (secure MongoDB with auth)"
echo "  2. Run: bash 4-app-init.sh          (clone repo, build app)"
