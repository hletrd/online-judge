# RPF Cycle 10 Comprehensive Review — JudgeKit (Loop 10/100)

**Date:** 2026-04-24
**HEAD commit:** b6151c2a (cycle 9 — no new findings)
**Scope:** Full repository — `src/`, configuration files

## Summary

**No new findings this cycle.** Deep code review across all critical paths (auth, API handlers, rate limiting, SSE, file storage, encryption, DB schema, recruiting, anti-cheat, HTML sanitization, file uploads, admin backup/restore/import) found no new issues beyond what is already in the deferred registry.

One observation refines deferred item #1: `atomicConsumeRateLimit()` in `src/lib/security/api-rate-limit.ts` uses `Date.now()` (line 56) while `checkServerActionRateLimit()` in the same file uses `getDbNowUncached()` (line 223). This cross-function inconsistency within the same module means rate limit rows written by one function could be misinterpreted by the other if app-server and DB-server clocks diverge. This does not change the severity or recommended fix from the existing deferred item, but makes the impact more concrete.

## Verified Prior Fixes (from old loop, now confirmed)

- **F1 (json_extract)**: Fixed — No SQLite functions in PostgreSQL paths
- **F2 (DELETE...LIMIT)**: Fixed — All batched deletes use `ctid IN (SELECT ctid ... LIMIT)`
- **CR9-CR1 (auth field mapping)**: Fixed — `mapUserToAuthFields()` centralizes mapping
- **CR9-SR1 (SSE re-auth race)**: Fixed — Re-auth awaits before processing
- **CR9-SR3 (tags rate limiting)**: Fixed — Tags route uses `createApiHandler` with rate limit

## Deferred Items Carried Forward

The 21-item deferred registry from the current RPF loop's cycle 4 plan is carried forward intact. No additions, no removals, no severity downgrades.

### Refinement to Deferred Item #1

The `atomicConsumeRateLimit` ↔ `checkServerActionRateLimit` time source inconsistency within `src/lib/security/api-rate-limit.ts` (lines 56 vs 223) makes deferred item #1's impact more concrete: it is not just clock skew vs DB round-trip, but also internal consistency within the same module. The severity (MEDIUM) and recommended fix (use `getDbNowUncached()`) remain unchanged.
