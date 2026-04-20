# Cycle 9 Tracer Report

**Reviewer:** tracer
**Date:** 2026-04-19
**Base commit:** 63a31dc0
**Scope:** Causal tracing of suspicious flows, competing hypotheses

## Traced Flows

### Flow 1: User Login -> JWT -> Session Data Propagation

**Hypothesis:** User preference fields can be silently lost between login and session due to triple mapping.

**Trace:**
1. User submits credentials -> `authorize()` returns `AuthenticatedLoginUser`
2. NextAuth `signIn` callback checks policy -> returns true
3. NextAuth `jwt` callback fires with `user` object -> calls `syncTokenWithUser(token, user, authenticatedAtSeconds)` -> returns updated token
4. NextAuth `session` callback fires -> maps token fields to `session.user`
5. On subsequent requests, `jwt` callback fires WITHOUT `user` -> queries DB -> calls `syncTokenWithUser(token, freshUser)` -> returns updated token

**Finding:** The `user` object in step 3 comes from `authorize()` which uses `createSuccessfulLoginResponse`. In step 5, the `freshUser` comes from a DB query with explicit `columns` selection. Both paths must include the same fields. Currently they're maintained separately — see CR9-CR1.

**Verdict:** Hypothesis CONFIRMED. The triple mapping is a real risk.

### Flow 2: SSE Connection -> Re-auth -> Close Race

**Hypothesis:** The fire-and-forget re-auth check can race with terminal status delivery.

**Trace:**
1. SSE connection established, `onPollResult` callback registered
2. Shared poll tick fires -> `onPollResult(status)` called
3. Re-auth check: `now - lastAuthCheck >= AUTH_RECHECK_INTERVAL_MS` -> true
4. `void (async () => { const reAuthUser = await getApiUser(request); if (!reAuthUser) close(); })()` — fire and forget
5. Status processing continues: `if (!IN_PROGRESS_JUDGE_STATUSES.has(status))` -> true (terminal)
6. `void (async () => { const fullSubmission = await queryFullSubmission(id); controller.enqueue(...); close(); })()` — also fire and forget
7. Both IIFEs run concurrently. If re-auth's `close()` wins, the terminal result is never sent.

**Competing hypothesis:** The `close()` function has an early-return guard (`if (closed) return`), so the second `close()` call is a no-op. But the issue is that if `close()` from re-auth runs BEFORE the terminal result is enqueued, the stream is closed and the result is lost.

**Verdict:** Hypothesis CONFIRMED. The race condition exists and can cause silent data loss.

### Flow 3: Export AbortSignal -> Transaction Cleanup

**Hypothesis:** Aborting an export leaves a long-running DB transaction open.

**Trace:**
1. `streamDatabaseExport()` creates a ReadableStream with `start(controller)`
2. Inside `start`, a DB transaction is opened with REPEATABLE READ isolation
3. User aborts -> `cancelled = true`
4. The abort handler only sets `cancelled`; it doesn't cancel the DB query in flight
5. The current DB query completes, then the loop checks `cancelled` and returns early
6. The transaction's `finally` block runs, rolling back the transaction

**Finding:** The abort is cooperative, not preemptive. The DB query in flight must complete before the abort takes effect. For large tables, this could be several seconds. The REPEATABLE READ transaction holds locks during this time.

**Verdict:** Hypothesis PARTIALLY CONFIRMED. The abort is not immediate, but the transaction is eventually cleaned up. The delay depends on query execution time.
