#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────────────────────────
# STEP 5 — Hook up Nginx and obtain SSL certificate from Let's Encrypt
# Usage (run as root, AFTER your domain points to this VPS):
#   DOMAIN=codex-tech.com EMAIL=you@example.com bash 5-nginx-ssl.sh
# ─────────────────────────────────────────────────────────────────────────────
set -euo pipefail

DOMAIN="${DOMAIN:-}"
EMAIL="${EMAIL:-}"
APP_DIR="${APP_DIR:-/home/deploy/codex-website}"

if [[ -z "$DOMAIN" || -z "$EMAIL" ]]; then
  echo "Usage: DOMAIN=example.com EMAIL=you@example.com bash 5-nginx-ssl.sh"
  exit 1
fi
if [[ "$(id -u)" -ne 0 ]]; then
  echo "Please run as root."
  exit 1
fi

log()  { printf "\n\033[1;36m▶ %s\033[0m\n" "$*"; }
ok()   { printf "\033[1;32m✓ %s\033[0m\n" "$*"; }

# Make sure default site is removed
rm -f /etc/nginx/sites-enabled/default

log "Installing Nginx site config for $DOMAIN..."
cp "$APP_DIR/deploy/nginx.conf" /etc/nginx/sites-available/codex.conf
sed -i "s/YOUR_DOMAIN\.com/$DOMAIN/g" /etc/nginx/sites-available/codex.conf
ln -sf /etc/nginx/sites-available/codex.conf /etc/nginx/sites-enabled/codex.conf

# Make sure /var/www/html exists for the ACME challenge
mkdir -p /var/www/html

nginx -t
systemctl reload nginx
ok "Nginx config in place"

log "Requesting Let's Encrypt certificate for $DOMAIN, www.$DOMAIN, dashboard.$DOMAIN..."
certbot --nginx \
  --non-interactive \
  --agree-tos \
  --email "$EMAIL" \
  --redirect \
  -d "$DOMAIN" \
  -d "www.$DOMAIN" \
  -d "dashboard.$DOMAIN"

systemctl reload nginx
ok "SSL active. Auto-renew is handled by the certbot snap timer."

log "Verifying renew timer..."
systemctl list-timers | grep -i certbot || true

echo
echo "════════════════════════════════════════════════════════════════════════"
echo "  ✓ https://$DOMAIN              → public website"
echo "  ✓ https://www.$DOMAIN          → public website"
echo "  ✓ https://dashboard.$DOMAIN    → admin dashboard"
echo "════════════════════════════════════════════════════════════════════════"
