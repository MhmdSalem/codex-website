#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────────────────────────
# Installs the daily MongoDB backup as a root cron job (3:30 AM).
# Run as root once.
# ─────────────────────────────────────────────────────────────────────────────
set -euo pipefail

if [[ "$(id -u)" -ne 0 ]]; then
  echo "Please run as root."
  exit 1
fi

SCRIPT_PATH="$(readlink -f "$(dirname "$0")")/backup-mongodb.sh"
chmod +x "$SCRIPT_PATH"

CRON_LINE="30 3 * * * $SCRIPT_PATH >> /var/log/codex/backup.log 2>&1"

mkdir -p /var/log/codex
( crontab -l 2>/dev/null | grep -v "$SCRIPT_PATH"; echo "$CRON_LINE" ) | crontab -
echo "Installed cron: $CRON_LINE"
echo "Log file: /var/log/codex/backup.log"
