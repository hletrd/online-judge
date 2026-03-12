#!/usr/bin/env bash
set -euo pipefail

# JudgeKit Deployment Script
# Usage: ./scripts/deploy.sh [--skip-backup] [--skip-worker]

# Configuration
APP_DIR="$(cd "$(dirname "$0")/.." && pwd)"
BACKUP_DIR="$APP_DIR/backups"
SERVICE_NAME="online-judge"
WORKER_SERVICE="online-judge-worker-rs"
CARGO_PATH="${CARGO_PATH:-$HOME/.cargo/bin/cargo}"

# Parse arguments
SKIP_BACKUP=false
SKIP_WORKER=false
for arg in "$@"; do
  case "$arg" in
    --skip-backup) SKIP_BACKUP=true ;;
    --skip-worker) SKIP_WORKER=true ;;
  esac
done

log() { echo "[deploy] $(date +%H:%M:%S) $*"; }
die() { log "ERROR: $*"; exit 1; }

# Save current state for rollback
PREV_COMMIT=$(git -C "$APP_DIR" rev-parse HEAD)
log "Current commit: $PREV_COMMIT"

# Pre-deployment backup
if [ "$SKIP_BACKUP" = false ]; then
  log "Running pre-deployment backup..."
  bash "$APP_DIR/scripts/backup-db.sh" || die "Backup failed"
fi

# Pull latest changes
log "Pulling latest changes..."
git -C "$APP_DIR" pull --rebase || die "Git pull failed"

# Install dependencies
log "Installing dependencies..."
cd "$APP_DIR"
npm ci || die "npm ci failed"

# Sync language configs
log "Syncing language configs..."
npm run languages:sync || die "Language sync failed"

# Push database schema
log "Pushing database schema..."
npm run db:push || die "Database push failed"

# Build Next.js app
log "Building application..."
npm run build || {
  log "Build failed! Rolling back to $PREV_COMMIT"
  git -C "$APP_DIR" checkout "$PREV_COMMIT"
  npm ci && npm run build
  die "Build failed, rolled back to $PREV_COMMIT"
}

# Build Rust worker
if [ "$SKIP_WORKER" = false ]; then
  log "Building Rust worker..."
  cd "$APP_DIR/judge-worker-rs"
  "$CARGO_PATH" build --release || die "Cargo build failed"
  cd "$APP_DIR"
fi

# Restart services
log "Restarting services..."
sudo systemctl restart "$SERVICE_NAME" || die "Failed to restart $SERVICE_NAME"

if [ "$SKIP_WORKER" = false ]; then
  sudo systemctl restart "$WORKER_SERVICE" || die "Failed to restart $WORKER_SERVICE"
fi

# Health check
log "Waiting for service to start..."
sleep 3
if systemctl is-active --quiet "$SERVICE_NAME"; then
  log "✓ $SERVICE_NAME is running"
else
  log "WARNING: $SERVICE_NAME failed to start. Check: journalctl -u $SERVICE_NAME"
fi

if [ "$SKIP_WORKER" = false ]; then
  if systemctl is-active --quiet "$WORKER_SERVICE"; then
    log "✓ $WORKER_SERVICE is running"
  else
    log "WARNING: $WORKER_SERVICE failed to start. Check: journalctl -u $WORKER_SERVICE"
  fi
fi

NEW_COMMIT=$(git -C "$APP_DIR" rev-parse HEAD)
log "Deployment complete: $PREV_COMMIT → $NEW_COMMIT"
