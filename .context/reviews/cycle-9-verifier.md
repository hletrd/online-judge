# Cycle 9 Verifier Report

**Reviewer:** verifier
**Date:** 2026-04-19
**Base commit:** 63a31dc0
**Scope:** Evidence-based correctness check against stated behavior

## Verification Method

For each claim made by the codebase (comments, docs, API contracts), verify that the implementation matches. Check edge cases and invariant violations.

## Findings

### CR9-V1 — [MEDIUM] JWT `authenticatedAt` field is set from `Date.now()` / 1000 but compared against `tokenInvalidatedAt` from DB — potential clock skew mismatch

- **Confidence:** MEDIUM
- **File:** `src/lib/auth/config.ts:325,392`
- **Evidence:** In the `jwt` callback, `authenticatedAtSeconds` is computed as `Math.trunc(Date.now() / 1000)` (line 325). The `isTokenInvalidated` function (line 392) compares this against `freshUser.tokenInvalidatedAt`. If the DB server's clock and the app server's clock are not synchronized, a user could have their token invalidated but the comparison would fail (or succeed incorrectly).
- **Stated behavior:** The code assumes that `Date.now()` on the app server and the DB's `NOW()` function produce consistent timestamps.
- **Failure scenario:** App server clock is 5 seconds ahead of DB clock. Admin sets `tokenInvalidatedAt = NOW()` on DB. The JWT's `authenticatedAt` is 5 seconds in the future relative to the DB's `tokenInvalidatedAt`. The user's old token (with `authenticatedAt` before the invalidation) is correctly invalidated. But a new login happening at the same moment might have `authenticatedAt` that's "in the future" from the DB's perspective, causing the token to be incorrectly invalidated on the next refresh.
- **Suggested fix:** Use the DB server's time for `tokenInvalidatedAt` comparisons. When setting `authenticatedAt` on login, also read the DB server's `NOW()` and use that instead of `Date.now()`. Or add a small grace period (e.g., 5s) to the `isTokenInvalidated` comparison.

### CR9-V2 — [MEDIUM] SSE connection tracking cleanup timer evicts by insertion order, not by age

- **Confidence:** HIGH
- **File:** `src/app/api/v1/submissions/[id]/events/route.ts:41-45`
- **Evidence:** The `addConnection` function evicts entries when `connectionInfoMap.size >= MAX_TRACKED_CONNECTIONS` by taking `connectionInfoMap.keys().next().value` — the first key in insertion order. However, the first key is not necessarily the oldest active connection. A long-lived connection added early would be evicted in favor of a newer connection, even though the long-lived connection might still be actively streaming data.
- **Stated behavior:** The eviction is meant to cap tracking map size, not to close active connections. The eviction only removes the tracking entry, not the actual SSE stream.
- **Failure scenario:** With 1000 active SSE connections (MAX_TRACKED_CONNECTIONS = 1000), the 1001st connection triggers eviction of the oldest tracking entry. The evicted connection's SSE stream continues running, but its tracking entry is gone. The `removeConnection` call when the stream finally closes would silently fail (no entry in the map), and the `userConnectionCounts` would be permanently decremented incorrectly if the connection was re-added by a different code path.
- **Suggested fix:** Evict based on `createdAt` timestamp rather than insertion order. Or better: evict the tracking entry with the oldest `createdAt` from `connectionInfoMap`.

### CR9-V3 — [LOW] Export `normalizeValue` does not handle BigInt values from PostgreSQL

- **Confidence:** MEDIUM
- **File:** `src/lib/db/export.ts:215-222`
- **Evidence:** PostgreSQL `BIGINT` columns are returned as `BigInt` by some PG drivers. The `normalizeValue` function does not handle `BigInt` — it would fall through to the default return, and `JSON.stringify` would throw a TypeError for BigInt values.
- **Stated behavior:** The export is designed to be portable JSON. BigInt is not JSON-serializable.
- **Failure scenario:** If a BIGINT column is added to any exported table and the driver returns it as BigInt, the export would crash with `TypeError: Do not know how to serialize a BigInt`.
- **Suggested fix:** Add a `typeof val === "bigint"` check that converts to `Number` (or `String` for very large values).

### CR9-V4 — [LOW] `validateExport` accepts `mysql` as a valid `sourceDialect` but no MySQL support exists

- **Confidence:** LOW
- **File:** `src/lib/db/export.ts:286`
- **Evidence:** Line 286 validates `sourceDialect` against `["sqlite", "postgresql", "mysql"]`. But the import code only handles SQLite and PostgreSQL. There is no MySQL dialect support anywhere in the codebase.
- **Stated behavior:** The validation should only accept dialects that the system can actually import.
- **Failure scenario:** An export file with `sourceDialect: "mysql"` passes validation, but import would fail or produce incorrect results.
- **Suggested fix:** Remove `"mysql"` from the valid dialect list, or add a warning during import if the dialect is not the current runtime's dialect.

## Previously Verified Fixes

- AGG-1: `recordRateLimitFailure` exponent — VERIFIED NOT A BUG (correct behavior)
- AGG-2: Backup `body` shadowing — VERIFIED FIXED
- AGG-3: Encryption key caching — VERIFIED FIXED
- AGG-4: Export polling interval — VERIFIED FIXED (50ms)
