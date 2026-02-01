#!/bin/sh
# Docker Entrypoint Script
# Story 8.1: Create Docker Multi-Stage Build
#
# Handles:
# - Database migrations (H1 fix)
# - Application startup

set -e

echo "[Entrypoint] Starting CIE Website..."

# Run database migrations if DATABASE_URL is set
if [ -n "$DATABASE_URL" ]; then
  echo "[Entrypoint] Running database migrations..."
  npx prisma migrate deploy --schema=./prisma/schema.prisma || {
    echo "[Entrypoint] Warning: Migration failed or no migrations to run"
  }
fi

echo "[Entrypoint] Starting Node.js server..."
exec node server.js
