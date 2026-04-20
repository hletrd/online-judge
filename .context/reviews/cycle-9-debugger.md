# Cycle 9 Debugger Report

**Reviewer:** debugger
**Date:** 2026-04-19
**Base commit:** 63a31dc0
**Scope:** Latent bug surface, failure modes, regressions

## Findings

### CR9-DB1 — [MEDIUM] SSE connection tracking eviction removes oldest tracking entry, not the oldest actual connection — active connections can lose their tracking entry

- **Confidence:** HIGH
- **Cross-agent agreement:** verifier CR9-V2
- **File:** `src/app/api/v1/submissions/[id]/events/route.ts:41-45`
- **Evidence:** When `connectionInfoMap.size >= MAX_TRACKED_CONNECTIONS` (2000), the eviction code takes `connectionInfoMap.keys().next().value` — the first key in insertion order. This evicts the tracking entry for the first-inserted connection, which may still be active. When that connection later closes, `removeConnection` would:
  1. Call `activeConnectionSet.delete(connId)` — succeeds (Set still has it)
  2. Call `connectionInfoMap.delete(connId)` — no-op (already evicted)
  3. Skip the `userConnectionCounts` decrement because `info` is undefined
  
  This means `userConnectionCounts` becomes permanently inflated for that user. The user would be blocked from opening new SSE connections even though their actual connection count is below the limit.
- **Failure scenario:** Under heavy SSE load (approaching 2000 tracked connections), a user with an active connection gets their tracking entry evicted. They can never open another SSE connection until the server restarts, because their `userConnectionCounts` entry is permanently inflated.
- **Suggested fix:** Evict the entry with the oldest `createdAt` (from the `ConnectionInfo` stored in the map). Or better: when evicting, also call `removeConnection` to properly decrement counts.

### CR9-DB2 — [MEDIUM] Auth `jwt` callback re-query race: token could be cleared and re-synced in the same request

- **Confidence:** MEDIUM
- **File:** `src/lib/auth/config.ts:358-415`
- **Evidence:** The `jwt` callback first checks `isTokenInvalidated(token.authenticatedAt, freshUser.tokenInvalidatedAt)`. If the token is invalidated, it returns `clearAuthToken(token)`. But `clearAuthToken` sets all auth fields to null/falsy values. The next time the JWT is accessed (same session), the `jwt` callback runs again with the cleared token, `getTokenUserId` returns null, and the token is cleared again — the user is effectively logged out. This is intentional behavior for token invalidation.
  
  However, there's a subtle race: if a user's account is deactivated (`isActive = false`) between the `findFirst` query and the `syncTokenWithUser` call, the code correctly clears the token (line 389-395). But if the user is reactivated between two consecutive requests (admin quickly undoes the deactivation), the first request would clear the token, forcing a new login. This is correct behavior, not a bug — but the user experience is poor because the session is lost even though the deactivation was brief.
- **Failure scenario:** Admin accidentally deactivates a user, then immediately reactivates them. The user's next API call hits the deactivated branch and clears their JWT. They must re-login even though their account is now active.
- **Suggested fix:** This is arguably correct behavior (defense-in-depth: deactivated tokens should be invalidated). Document it. Consider adding a grace period for very brief deactivations if UX demands it.

### CR9-DB3 — [LOW] Export `streamDatabaseExport` does not handle `AbortSignal` abort during DB transaction

- **Confidence:** MEDIUM
- **File:** `src/lib/db/export.ts:45-144`
- **Evidence:** The `streamDatabaseExport` function accepts an optional `AbortSignal`. When the signal fires, `cancelled` is set to `true`. However, if the abort happens while a DB query is in flight (e.g., `tx.select().from(table)`), the query completes before the next `cancelled` check. The transaction continues to hold its REPEATABLE READ lock until the `start` callback returns.
- **Failure scenario:** A user starts a large export, then cancels. The DB transaction stays open with a REPEATABLE READ lock until the current chunk's query completes. For large tables, this could be seconds. During this time, the transaction holds locks that could block writes.
- **Suggested fix:** Pass the abort signal to the DB query execution. Most PG drivers support cancellation via signals. Alternatively, set a statement timeout for each query within the export transaction.

## Previously Found Issues (Verified Fixed)

- AGG-2: Backup `body` shadowing — FIXED
- AGG-3: Encryption key caching — FIXED
- AGG-4: Export polling interval — FIXED
