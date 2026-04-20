# Debugger — Cycle 7 Deep Review

**Date:** 2026-04-20
**Scope:** Latent bug surface, failure modes, regressions

---

## Findings

### HIGH 1 — `tokenInvalidatedAt` clock-skew can leave revoked sessions active

**Confidence:** HIGH
**Files:**
- `src/app/api/v1/users/[id]/route.ts:164,185,218,260,466`
- `src/lib/auth/session-security.ts:26-36`
- `src/proxy.ts:240-274`

**Problem:** When a user is deactivated or their password is changed, `tokenInvalidatedAt` is set to `new Date()`. The proxy compares this against the JWT's `authenticatedAt` (also set via `Date.now()`). If the app server clock jumps forward between JWT issuance and invalidation (e.g., NTP correction), the JWT's `authenticatedAt` could be ahead of `tokenInvalidatedAt`, causing `isTokenInvalidated()` to return `false` for a revoked session.

**Failure mode:** Deactivated user retains access after deactivation. Password-changed user retains access with old session.

**Suggested fix:** Use `await getDbNowUncached()` for all `tokenInvalidatedAt` assignments.

---

### MEDIUM 1 — Public contest page status can show "open" for closed contests

**Confidence:** HIGH
**Files:**
- `src/lib/assignments/public-contests.ts:30,124`

**Problem:** `new Date()` is used for contest status determination. If the app server clock is behind the DB server, closed contests appear open.

**Failure mode:** User sees contest as "open", clicks "start", gets rejected by API. Confusing UX but no security breach.

**Suggested fix:** Use `await getDbNow()`.

---

### MEDIUM 2 — Non-null assertions on Map.get() can throw at runtime

**Confidence:** MEDIUM
**Files:**
- `src/app/(dashboard)/dashboard/groups/[id]/assignments/[assignmentId]/student/[userId]/page.tsx:131`
- `src/lib/assignments/submissions.ts:365`
- `src/lib/assignments/contest-scoring.ts:243`

**Problem:** `map.get(key)!.push(...)` throws TypeError if key is missing. Under race conditions or data inconsistencies, these can crash the server component or API handler.

**Failure mode:** Server component crashes with TypeError instead of showing a user-friendly error.

**Suggested fix:** Replace with safe access pattern.

---

### LOW 1 — SSE connection cleanup timer interval may not properly handle module re-initialization

**Confidence:** LOW
**Files:**
- `src/app/api/v1/submissions/[id]/events/route.ts:81-95`

**Problem:** The module-level `setInterval` for SSE connection cleanup is stored in `globalThis.__sseCleanupTimer`. If the module is re-evaluated (e.g., hot module replacement in development), the old timer is cleared and a new one is created. This is correct behavior. However, the `unref()` call on line 94 is conditional on the timer being an object with an `unref` property, which is always true for Node.js `setTimeout`/`setInterval` return values. The conditional check is unnecessary but not harmful.

**No fix needed.**

---

## Final sweep

No additional latent bug findings. The `submittedAt: new Date()` in submissions route is already documented as deferred (DEFER-2 in cycle 6 plan). The exam session handling is solid with proper transactional DB time usage.
