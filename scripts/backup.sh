#!/bin/bash
# =============================================================================
# SQLite Backup Script
# Story 8.4: Set Up Backup and Monitoring
#
# Features:
# - Daily SQLite backups (AC1, NFR31)
# - 30-day retention (AC2)
# - Compressed with gzip
#
# Usage:
#   ./scripts/backup.sh
#
# Cron setup (daily at 2 AM):
#   0 2 * * * /path/to/cie-website/scripts/backup.sh >> /var/log/cie-backup.log 2>&1
# =============================================================================

set -e

# Configuration
BACKUP_DIR="${BACKUP_DIR:-/var/backups/cie-website}"
RETENTION_DAYS="${RETENTION_DAYS:-30}"
CONTAINER_NAME="${CONTAINER_NAME:-cie-website}"
DB_PATH="/app/data/prod.db"

# Create backup directory if it doesn't exist
mkdir -p "$BACKUP_DIR"

# Generate timestamp
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_FILE="$BACKUP_DIR/cie-website_$TIMESTAMP.db.gz"

echo "[$(date)] Starting backup..."

# Create backup using docker exec and sqlite3
# The .backup command creates a consistent backup even while the database is in use
docker exec "$CONTAINER_NAME" sqlite3 "$DB_PATH" ".backup /tmp/backup.db"

# Copy and compress
docker cp "$CONTAINER_NAME:/tmp/backup.db" - | gzip > "$BACKUP_FILE"

# Clean up temp file in container
docker exec "$CONTAINER_NAME" rm -f /tmp/backup.db

# Verify backup was created
if [ -f "$BACKUP_FILE" ]; then
    SIZE=$(ls -lh "$BACKUP_FILE" | awk '{print $5}')
    echo "[$(date)] Backup created: $BACKUP_FILE ($SIZE)"
else
    echo "[$(date)] ERROR: Backup failed!"
    exit 1
fi

# Remove backups older than retention period
echo "[$(date)] Cleaning up backups older than $RETENTION_DAYS days..."
find "$BACKUP_DIR" -name "cie-website_*.db.gz" -mtime +$RETENTION_DAYS -delete

# Count remaining backups
COUNT=$(find "$BACKUP_DIR" -name "cie-website_*.db.gz" | wc -l)
echo "[$(date)] Backup complete. $COUNT backups retained."
