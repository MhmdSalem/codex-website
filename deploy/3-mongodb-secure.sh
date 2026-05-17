#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────────────────────────
# STEP 3 — Secure MongoDB with authentication and create app user
# Usage (run as root):
#   bash 3-mongodb-secure.sh
#
# Will print credentials at the end. SAVE THEM somewhere safe.
# ─────────────────────────────────────────────────────────────────────────────
set -euo pipefail

DB_NAME="${DB_NAME:-codex_website}"
ROOT_USER="codexroot"
APP_USER="codexapp"

ok()   { printf "\033[1;32m✓ %s\033[0m\n" "$*"; }
log()  { printf "\n\033[1;36m▶ %s\033[0m\n" "$*"; }

if [[ "$(id -u)" -ne 0 ]]; then
  echo "Please run as root."
  exit 1
fi

# Check if auth is already enabled
if grep -q "authorization: enabled" /etc/mongod.conf; then
  echo "MongoDB authentication is already enabled."
  echo "If you need to reset users, do it manually with mongosh."
  exit 0
fi

ROOT_PASS="$(openssl rand -base64 24 | tr -d '=+/')"
APP_PASS="$(openssl rand -base64 24 | tr -d '=+/')"

log "Creating root and application users..."
mongosh --quiet <<EOF
use admin
db.createUser({ user: "$ROOT_USER", pwd: "$ROOT_PASS", roles: [{ role: "root", db: "admin" }] })
use $DB_NAME
db.createUser({ user: "$APP_USER", pwd: "$APP_PASS", roles: [{ role: "readWrite", db: "$DB_NAME" }, { role: "dbAdmin", db: "$DB_NAME" }] })
EOF
ok "users created"

log "Enabling authentication in /etc/mongod.conf..."
if ! grep -q "^security:" /etc/mongod.conf; then
  cat >> /etc/mongod.conf <<'EOF'

security:
  authorization: enabled
EOF
fi

systemctl restart mongod
sleep 3
ok "MongoDB restarted with auth enabled"

# Save creds for the operator (root only)
CRED_FILE="/root/codex-db-credentials.txt"
cat > "$CRED_FILE" <<EOF
# MongoDB Credentials — KEEP SECURE!  $(date -Iseconds)
ROOT  user=$ROOT_USER  pass=$ROOT_PASS  authdb=admin
APP   user=$APP_USER   pass=$APP_PASS   authdb=$DB_NAME

Connection string for the app (.env.local on the VPS):
MONGODB_URI=mongodb://$APP_USER:$APP_PASS@127.0.0.1:27017/$DB_NAME?authSource=$DB_NAME
EOF
chmod 600 "$CRED_FILE"

echo
echo "════════════════════════════════════════════════════════════════════════"
echo "  MongoDB credentials saved to:  $CRED_FILE"
echo "  Read with:                     sudo cat $CRED_FILE"
echo "  ⚠ The connection string for your app's .env file is in that file."
echo "════════════════════════════════════════════════════════════════════════"
