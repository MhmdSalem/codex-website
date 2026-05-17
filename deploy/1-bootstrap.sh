#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────────────────────────
# STEP 1 — Server bootstrap & hardening
# Usage (run as root, first time only on a fresh Ubuntu 22.04 / 24.04 VPS):
#   bash 1-bootstrap.sh
# ─────────────────────────────────────────────────────────────────────────────
set -euo pipefail

DEPLOY_USER="${DEPLOY_USER:-deploy}"
SSH_PORT="${SSH_PORT:-22}"
SWAP_SIZE="${SWAP_SIZE:-2G}"

log()  { printf "\n\033[1;36m▶ %s\033[0m\n" "$*"; }
ok()   { printf "\033[1;32m✓ %s\033[0m\n" "$*"; }
warn() { printf "\033[1;33m⚠ %s\033[0m\n" "$*"; }

if [[ "$(id -u)" -ne 0 ]]; then
  echo "Please run this script as root (or with sudo)."
  exit 1
fi

# ── 1. System update ─────────────────────────────────────────────────────────
log "Updating system packages..."
export DEBIAN_FRONTEND=noninteractive
apt-get update -y
apt-get upgrade -y
apt-get install -y curl wget gnupg ca-certificates lsb-release \
  build-essential ufw fail2ban htop git unattended-upgrades

# ── 2. Auto security updates ─────────────────────────────────────────────────
log "Enabling automatic security updates..."
dpkg-reconfigure --priority=low unattended-upgrades || true
ok "unattended-upgrades enabled"

# ── 3. Swap file (helpful on small VPS) ──────────────────────────────────────
if ! swapon --show | grep -q "/swapfile"; then
  log "Creating ${SWAP_SIZE} swap file..."
  fallocate -l "${SWAP_SIZE}" /swapfile
  chmod 600 /swapfile
  mkswap /swapfile
  swapon /swapfile
  if ! grep -q "/swapfile" /etc/fstab; then
    echo "/swapfile none swap sw 0 0" >> /etc/fstab
  fi
  sysctl vm.swappiness=10
  echo "vm.swappiness=10" > /etc/sysctl.d/99-swappiness.conf
  ok "swap of ${SWAP_SIZE} active"
else
  ok "swap already configured"
fi

# ── 4. Deploy user ───────────────────────────────────────────────────────────
if ! id "$DEPLOY_USER" &>/dev/null; then
  log "Creating user '$DEPLOY_USER'..."
  adduser --gecos "" --disabled-password "$DEPLOY_USER"
  usermod -aG sudo "$DEPLOY_USER"
  mkdir -p "/home/$DEPLOY_USER/.ssh"
  chmod 700 "/home/$DEPLOY_USER/.ssh"
  touch "/home/$DEPLOY_USER/.ssh/authorized_keys"
  chmod 600 "/home/$DEPLOY_USER/.ssh/authorized_keys"
  chown -R "$DEPLOY_USER:$DEPLOY_USER" "/home/$DEPLOY_USER/.ssh"
  echo "$DEPLOY_USER ALL=(ALL) NOPASSWD: /usr/bin/systemctl reload nginx, /usr/bin/systemctl restart codex-web" \
    > "/etc/sudoers.d/$DEPLOY_USER"
  chmod 440 "/etc/sudoers.d/$DEPLOY_USER"
  ok "user '$DEPLOY_USER' created (paste your SSH public key into /home/$DEPLOY_USER/.ssh/authorized_keys)"
else
  ok "user '$DEPLOY_USER' already exists"
fi

# ── 5. Firewall ──────────────────────────────────────────────────────────────
log "Configuring UFW firewall..."
ufw default deny incoming
ufw default allow outgoing
ufw allow "$SSH_PORT"/tcp
ufw allow 80/tcp
ufw allow 443/tcp
ufw --force enable
ok "UFW active (only ports $SSH_PORT, 80, 443 open)"

# ── 6. fail2ban ──────────────────────────────────────────────────────────────
log "Enabling fail2ban for SSH..."
cat > /etc/fail2ban/jail.local <<EOF
[sshd]
enabled = true
port    = $SSH_PORT
maxretry = 5
findtime = 10m
bantime  = 1h
EOF
systemctl enable --now fail2ban
ok "fail2ban running"

# ── 7. SSH hardening (optional, prompted) ────────────────────────────────────
log "SSH hardening recommendations:"
warn "After you set up an SSH key for '$DEPLOY_USER', edit /etc/ssh/sshd_config:"
echo "    PermitRootLogin no"
echo "    PasswordAuthentication no"
echo "    PubkeyAuthentication yes"
echo "Then: systemctl reload ssh"

# ── 8. Useful kernel tweaks ──────────────────────────────────────────────────
cat > /etc/sysctl.d/99-codex.conf <<'EOF'
net.ipv4.tcp_fin_timeout = 30
net.ipv4.tcp_keepalive_time = 300
net.core.somaxconn = 1024
EOF
sysctl --system >/dev/null
ok "kernel tweaks applied"

log "Bootstrap finished."
echo
echo "Next steps:"
echo "  1. Copy your SSH public key into /home/$DEPLOY_USER/.ssh/authorized_keys"
echo "  2. Run: bash 2-stack.sh"
