# Tracer — Cycle 5 (Fresh)

**Date:** 2026-04-20
**Base commit:** 9d6d7edc
**Reviewer:** tracer

## Findings

### TR-1: Clock-skew causal chain — `new Date()` in API routes creates divergent enforcement [MEDIUM/HIGH]

**Description:** Tracing the causal chain of a clock-skew scenario:

1. App server clock drifts 5 minutes behind DB server.
2. Student requests `POST /api/v1/submissions` at 12:03 UTC (DB time) / 11:58 UTC (app time).
3. Submission route checks `lt(examSessions.personalDeadline, new Date())` — `new Date()` returns 11:58 UTC. If personal deadline is 12:00 UTC, the check passes (11:58 < 12:00), so the submission is accepted.
4. But the exam actually ended at 12:00 UTC per DB time. The submission was accepted 3 minutes after the exam closed.

Competing hypotheses:
- H1: The drift is unlikely in practice (app and DB are on the same server in Docker). TRUE for current deployment, but the architecture supports separate DB hosts (e.g., managed PostgreSQL), and the code should not assume co-location.
- H2: The 5-minute drift is unrealistic. DEBUNKED: NTP sync failures, container clock issues, and VM time drift are well-documented in production systems.

The recruit page was fixed for this exact class of issue. The same causal chain applies to all 6+ remaining API routes.

**Fix:** Use DB-sourced time in all API routes that make security-relevant temporal decisions.

**Confidence:** HIGH

---

### TR-2: `getDbNow()` fallback causal chain — silent degradation [MEDIUM/MEDIUM]

**File:** `src/lib/db-time.ts:16`

**Description:** Tracing the causal chain of a DB query failure:

1. `getDbNow()` calls `rawQueryOne("SELECT NOW()")`.
2. DB connection pool is exhausted, query times out, `rawQueryOne` returns null.
3. `getDbNow()` falls back to `new Date()`.
4. The recruit page uses this time for expiry check. If app server clock is ahead, an invitation that is still valid per DB is shown as "expired."
5. The candidate sees "expired" and cannot start the exam, but the invitation is actually valid.

This is a degradation amplification: the DB failure causes a secondary failure (incorrect time) that produces a user-visible error with no indication that the root cause was a DB issue.

**Fix:** Throw an error when the DB query returns null, so the DB connectivity issue is immediately visible.

**Confidence:** MEDIUM

---

## Verified Safe

- No competing-state races in the recruiting token flow (uses atomic SQL with SELECT FOR UPDATE).
- SSE connection tracking has proper cleanup on stream close.
- Rate limiting uses advisory locks to prevent TOCTOU races.
