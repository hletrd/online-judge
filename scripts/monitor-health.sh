#!/usr/bin/env bash
# Health monitoring script for JudgeKit
# Run via cron: */5 * * * * /path/to/monitor-health.sh
set -euo pipefail

# Configuration
DB_DIR="${DATABASE_PATH:-$(pwd)/data}"
DB_FILE="${DB_DIR}/judge.db"
WAL_FILE="${DB_FILE}-wal"
DISK_WARN_PERCENT=85
DISK_CRIT_PERCENT=95
WAL_WARN_BYTES=$((100 * 1024 * 1024))  # 100MB
WAL_CRIT_BYTES=$((500 * 1024 * 1024))  # 500MB

log() {
  echo "$(date -u +%Y-%m-%dT%H:%M:%SZ) [$1] $2" | systemd-cat -t judgekit-monitor -p "$3"
}

# Check disk space
check_disk() {
  local usage
  usage=$(df --output=pcent "${DB_DIR}" 2>/dev/null | tail -1 | tr -d ' %')
  if [ "${usage}" -ge "${DISK_CRIT_PERCENT}" ]; then
    log "CRITICAL" "Disk usage at ${usage}% on $(df --output=target "${DB_DIR}" | tail -1)" "crit"
    return 2
  elif [ "${usage}" -ge "${DISK_WARN_PERCENT}" ]; then
    log "WARNING" "Disk usage at ${usage}% on $(df --output=target "${DB_DIR}" | tail -1)" "warning"
    return 1
  fi
  return 0
}

# Check SQLite WAL size
check_wal() {
  if [ ! -f "${WAL_FILE}" ]; then
    return 0
  fi
  local wal_size
  wal_size=$(stat -c %s "${WAL_FILE}" 2>/dev/null || stat -f %z "${WAL_FILE}" 2>/dev/null || echo 0)
  if [ "${wal_size}" -ge "${WAL_CRIT_BYTES}" ]; then
    local wal_mb=$((wal_size / 1024 / 1024))
    log "CRITICAL" "SQLite WAL size: ${wal_mb}MB (threshold: $((WAL_CRIT_BYTES / 1024 / 1024))MB)" "crit"
    return 2
  elif [ "${wal_size}" -ge "${WAL_WARN_BYTES}" ]; then
    local wal_mb=$((wal_size / 1024 / 1024))
    log "WARNING" "SQLite WAL size: ${wal_mb}MB (threshold: $((WAL_WARN_BYTES / 1024 / 1024))MB)" "warning"
    return 1
  fi
  return 0
}

# Check database file size
check_db_size() {
  if [ ! -f "${DB_FILE}" ]; then
    log "WARNING" "Database file not found: ${DB_FILE}" "warning"
    return 1
  fi
  local db_size
  db_size=$(stat -c %s "${DB_FILE}" 2>/dev/null || stat -f %z "${DB_FILE}" 2>/dev/null || echo 0)
  local db_mb=$((db_size / 1024 / 1024))
  log "INFO" "Database size: ${db_mb}MB, WAL: $(stat -c %s "${WAL_FILE}" 2>/dev/null || echo 0) bytes" "info"
  return 0
}

# Run all checks
exit_code=0
check_disk || exit_code=$?
check_wal || { local rc=$?; [ $rc -gt $exit_code ] && exit_code=$rc; }
check_db_size || true

exit ${exit_code}
