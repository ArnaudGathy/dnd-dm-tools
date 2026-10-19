#!/usr/bin/env bash
# Backs up the PRODUCTION database to backups/backup_<timestamp>.sql and verifies the dump.
# Run before ANY database change: migration, bulk script, manual SQL (see CLAUDE.md).
# Read-only on the database side: it only runs pg_dump.
# Exits non-zero (and deletes the partial file) if the dump is incomplete or empty.
set -euo pipefail

cd "$(dirname "$0")/.."

if [[ ! -f .env ]]; then
  echo "backup-db: .env not found" >&2
  exit 1
fi

# Load .env without echoing it. The connection string must never be printed.
set -a
# shellcheck disable=SC1091
. ./.env
set +a

if [[ -z "${DATABASE_URL_BACKUP:-}" ]]; then
  echo "backup-db: DATABASE_URL_BACKUP is not set in .env" >&2
  exit 1
fi

mkdir -p backups
target="backups/backup_$(date +%Y-%m-%d_%H-%M-%S).sql"
tmp="${target}.partial"
trap 'rm -f "$tmp"' EXIT

pg_dump --clean --if-exists "$DATABASE_URL_BACKUP" > "$tmp"

if ! tail -n 20 "$tmp" | grep -q "PostgreSQL database dump complete"; then
  echo "backup-db: dump is incomplete (no completion marker), aborting" >&2
  exit 1
fi

# Count the rows in the Character COPY block, as a sanity check that the DB is not empty.
character_rows=$(awk '/^COPY public\."Character" /{on=1; next} on && /^\\\.$/{exit} on{n++} END{print n+0}' "$tmp")
if [[ "$character_rows" -eq 0 ]]; then
  echo "backup-db: dump contains 0 Character rows. The database looks empty, refusing to treat this as a valid backup" >&2
  exit 1
fi

mv "$tmp" "$target"
trap - EXIT
echo "backup-db: OK → $target ($(du -h "$target" | cut -f1), $character_rows characters)"
