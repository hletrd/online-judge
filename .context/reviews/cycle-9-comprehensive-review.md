# Cycle 9 Deep Code Review — JudgeKit

**Date:** 2026-04-19
**Reviewer:** Comprehensive multi-angle review (SQL compatibility, security, correctness, consistency)
**Scope:** Full repository — `src/`, configuration files
**Delta from prior cycle:** Focus on new issues not covered in cycles 1-8, verifying previously reported items

---

## F1: `json_extract()` in audit-logs page is a SQLite function — will fail on PostgreSQL
- **File**: `src/app/(dashboard)/dashboard/admin/audit-logs/page.tsx:158`
- **Severity**: HIGH | **Confidence**: High
- **Description**: The `buildGroupMemberScopeFilter()` function uses `sql\`json_extract(${auditEvents.details}, '$.groupId') = ${groupId}\``. `json_extract()` is a SQLite function and does not exist in PostgreSQL. The `auditEvents.details` column is defined as `text` in the schema (`src/lib/db/schema.pg.ts:131`), not `jsonb`. Since the database is PostgreSQL (confirmed by `drizzle.config.ts` dialect and all schema using `pgTable`), this query will throw a PostgreSQL error at runtime whenever an instructor-level user views the audit logs page with group scope filtering active.
- **Concrete failure scenario**: An instructor navigates to `/dashboard/admin/audit-logs`. The page loads owned groups for the instructor, calls `buildGroupMemberScopeFilter(groupIds)`, and the resulting SQL includes `json_extract(...)`. PostgreSQL raises `ERROR: function json_extract(text, unknown) does not exist`. The page returns a 500 error to the instructor.
- **Fix**: Since `auditEvents.details` is a `text` column, the correct approach is to use PostgreSQL text pattern matching. Replace:
  ```ts
  sql`json_extract(${auditEvents.details}, '$.groupId') = ${groupId}`
  ```
  with:
  ```ts
  sql`${auditEvents.details} LIKE '%"groupId":"${groupId}"%'`
  ```
  Or, if more precision is needed, cast to jsonb first:
  ```ts
  sql`(${auditEvents.details}::jsonb->>'groupId') = ${groupId}`
  ```
  However, the `::jsonb` cast approach is risky if `details` could be null or non-JSON. The LIKE approach is safer for a text column and matches the pattern already used elsewhere in this file for searching the `details` field (line 323). Alternatively, the `details` column could be migrated to `jsonb` type for proper querying.

## F2: `DELETE ... LIMIT` is not valid PostgreSQL syntax in batched delete operations
- **File**: `src/lib/data-retention-maintenance.ts:23`, `src/lib/db/cleanup.ts:21,31`, `src/lib/audit/events.ts:189`
- **Severity**: HIGH | **Confidence**: High
- **Description**: Three separate locations use `sql\`DELETE FROM ${table} WHERE ${whereClause} LIMIT ${BATCH_SIZE}\`` or similar patterns. `DELETE ... LIMIT` is MySQL/SQLite syntax and is NOT valid in PostgreSQL. PostgreSQL does not support `LIMIT` on `DELETE` statements. This means:
  1. `src/lib/data-retention-maintenance.ts:23` — the `batchedDelete()` helper used for pruning chat messages, recruiting invitations, submissions, anti-cheat events, and login events will fail.
  2. `src/lib/db/cleanup.ts:21,31` — the `cleanupOldEvents()` function used by the `/api/internal/cleanup` cron endpoint will fail.
  3. `src/lib/audit/events.ts:189` — the `pruneOldAuditEvents()` function called by the daily audit pruning timer will fail.
- **Concrete failure scenario**: The daily data retention pruning timer fires, calls `pruneSensitiveOperationalData()`, which calls `batchedDelete()`. The SQL `DELETE FROM chat_messages WHERE created_at < ... LIMIT 5000` is sent to PostgreSQL, which raises `ERROR: syntax error at or near "LIMIT"`. The error is caught and logged as a warning (line 93), but no data is ever pruned. Over time, the database grows without bound. The same applies to audit event pruning in `events.ts` (caught at line 198). The cleanup API endpoint also fails silently.
- **Fix**: Replace `DELETE ... LIMIT` with the PostgreSQL-compatible approach using a subquery on `ctid`:
  ```sql
  DELETE FROM table WHERE ctid IN (
    SELECT ctid FROM table WHERE condition LIMIT batch_size
  )
  ```
  In Drizzle:
  ```ts
  sql`DELETE FROM ${table} WHERE ctid IN (SELECT ctid FROM ${table} WHERE ${whereClause} LIMIT ${BATCH_SIZE})`
  ```

## F3: `like()` in audit-logs admin page doesn't escape LIKE wildcards or include ESCAPE clause
- **File**: `src/app/(dashboard)/dashboard/admin/audit-logs/page.tsx:294`
- **Severity**: MEDIUM | **Confidence**: High
- **Description**: `like(auditEvents.action, \`${actionTypeFilter}%\`)` uses the raw `actionTypeFilter` query parameter as a LIKE pattern prefix without escaping `%` or `_` characters, and does not include an `ESCAPE '\\'` clause. This is the same bug pattern that was fixed in the API route (`src/app/api/v1/admin/audit-logs/route.ts:67`) during cycle 8, but the server-side rendered page component was missed. If an admin searches for an action containing `%` or `_`, it would act as a wildcard rather than a literal match.
- **Fix**: Replace with `sql\`${auditEvents.action} LIKE ${escapeLikePattern(actionTypeFilter) + '%'} ESCAPE '\\\\'\`` to match the API route fix.

## F4: CSV export routes don't use `contentDispositionAttachment()` utility
- **File**: `src/app/api/v1/admin/audit-logs/route.ts:171`, `src/app/api/v1/admin/login-logs/route.ts:128`, `src/app/api/v1/admin/submissions/export/route.ts:143`, `src/app/api/v1/admin/migrate/export/route.ts:83`
- **Severity**: LOW | **Confidence**: High
- **Description**: Four export routes still use manual `attachment; filename="..."` Content-Disposition headers instead of the shared `contentDispositionAttachment()` utility created in cycle 7. The current filenames are all ASCII-safe (`audit-logs.csv`, `login-logs.csv`, `submissions-export.csv`, `judgekit-export-*.json`), so this is not functionally broken. However, the migrate/export route constructs a filename with a timestamp that includes dashes and the letter "T" — always ASCII-safe, but inconsistent with the established pattern. The inconsistency was partially fixed in cycle 8 for the backup route, but these four routes were overlooked.
- **Fix**: Import and use `contentDispositionAttachment()` in all four routes for consistency.

---

## Summary Statistics
- Total new findings this cycle: 4
- Critical: 0
- High: 2 (F1 — json_extract SQLite function on PostgreSQL, F2 — DELETE ... LIMIT invalid PostgreSQL syntax)
- Medium: 1 (F3 — unescaped LIKE in audit-logs page component)
- Low: 1 (F4 — CSV export routes not using shared Content-Disposition utility)
