# Cycle 27 Security Reviewer

**Date:** 2026-04-20
**Base commit:** ca3459dd

## Findings

### SEC-1: Recruit page clock-skew inconsistency with API validation [MEDIUM/HIGH]

**File:** `src/app/(auth)/recruit/[token]/page.tsx:33,89,167` vs `src/app/api/v1/recruiting/validate/route.ts:36`
**Description:** The server-rendered recruit page uses `new Date()` (app server clock) for expiry and deadline comparisons, while the API validation endpoint uses `SQL NOW()` (database server clock). This creates a security-relevant inconsistency: an invitation that appears valid on the page could be expired from the DB's perspective (or vice versa), leading to a confusing user experience or a brief window where an expired invitation could be submitted.
**Failure scenario:** If the app server clock is 5 minutes behind the DB server clock, the page shows "valid" for an invitation that is actually expired. The subsequent redeem API call would correctly reject it, but the user already saw the invitation as valid.
**Fix:** Align the page's expiry check with the DB server's time by fetching `SELECT NOW()` alongside the invitation data, or add the `now` value to the cached invitation result.
**Confidence:** HIGH

### SEC-2: SSE events route connection tracking has potential memory leak under high churn [LOW/MEDIUM]

**File:** `src/app/api/v1/submissions/[id]/events/route.ts:39-58`
**Description:** `addConnection()` adds entries to `activeConnectionSet`, `connectionInfoMap`, and `userConnectionCounts`. The eviction logic in `addConnection` (lines 44-55) only triggers when `connectionInfoMap.size >= MAX_TRACKED_CONNECTIONS` (1000). Between cleanups, if connections are closed without `removeConnection` being called (e.g., process crash, ungraceful disconnect), the tracking maps could grow until the next periodic cleanup. The cleanup timer runs every 60 seconds and evicts entries older than the stale threshold.
**Failure scenario:** Under high connection churn with frequent ungraceful disconnects, the in-memory maps could temporarily hold stale entries until the next cleanup tick. Not a critical leak since the cleanup timer bounds it.
**Fix:** The current design is adequate for the use case. The `MAX_TRACKED_CONNECTIONS` cap and periodic cleanup timer provide sufficient bounds. No immediate action required.
**Confidence:** LOW

## Verified Safe

- All judge routes (`/claim`, `/poll`, `/register`, `/heartbeat`, `/deregister`) properly validate IP allowlist + auth token before processing.
- Judge claim uses atomic `FOR UPDATE SKIP LOCKED` SQL preventing race conditions.
- Judge poll verifies `claimToken` in the WHERE clause preventing result injection from unauthorized workers.
- Password re-confirmation is required for backup, restore, and import routes.
- Transparent rehash (bcrypt to argon2id) is properly implemented across all password re-confirmation endpoints.
- CSRF protection is properly skipped for API key auth (no cookies).
- Rate limiting is applied across all public and mutation endpoints.
- HTML sanitization uses DOMPurify with strict allowlists for tags and attributes.
- JSON-LD script injection is protected by `safeJsonForScript()` which escapes `</script>`.
- SQL injection is prevented by using parameterized queries throughout.
- Recruiting token validation uses SHA-256 hashing (not storing plaintext tokens).
- The recruiting validate API uses uniform invalid responses to prevent information leakage.
- Environment variable validation is enforced in production.
