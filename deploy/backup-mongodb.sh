#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────────────────────────
# Daily MongoDB backup — keeps the last 14 dumps.
# Install once with `setup-cron.sh` (or manually with crontab -e).
# ─────────────────────────────────────────────────────────────────────────────
set -euo pipefail

BACKUP_DIR="/var/backups/codex-mongodb"
RETAIN_DAYS=14
DB_NAME="${DB_NAME:-codex_website}"

mkdir -p "$BACKUP_DIR"

# Read MongoDB credentials from /root/codex-db-credentials.txt
if [[ -r /root/codex-db-credentials.txt ]]; then
  USER="$(grep '^APP' /root/codex-db-credentials.txt | awk '{print $2}' | sed 's/user=//')"
  PASS="$(grep '^APP' /root/codex-db-credentials.txt | awk '{print $3}' | sed 's/pass=//')"
fi

STAMP="$(date +%Y%m%d-%H%M%S)"
OUT="$BACKUP_DIR/$DB_NAME-$STAMP.archive.gz"

if [[ -n "${USER:-}" && -n "${PASS:-}" ]]; then
  mongodump --quiet \
    --host=127.0.0.1 \
    --port=27017 \
    --db="$DB_NAME" \
    --username="$USER" --password="$PASS" --authenticationDatabase="$DB_NAME" \
    --gzip --archive="$OUT"
else
  # Fallback (auth disabled — not recommended in production)
  mongodump --quiet --db="$DB_NAME" --gzip --archive="$OUT"
fi

# Rotate
find "$BACKUP_DIR" -type f -name '*.archive.gz' -mtime +$RETAIN_DAYS -delete

echo "$(date -Iseconds)  saved $OUT"
