# Tracer — Cycle 7 Deep Review

**Date:** 2026-04-20
**Scope:** Causal tracing of suspicious flows, competing hypotheses

---

## Findings

### HIGH 1 — Session revocation flow: clock-skew allows bypass

**Confidence:** HIGH
**Causal trace:**

```
User logs in
  -> JWT callback: authenticatedAt = Date.now() (app time T1)
  -> JWT stored in cookie

Admin deactivates user
  -> PUT /api/v1/users/[id]: tokenInvalidatedAt = new Date() (app time T2)
  -> DB row updated

Proxy middleware on next request
  -> getToken() -> JWT with authenticatedAt = T1
  -> getActiveAuthUserById() -> DB row with tokenInvalidatedAt = T2
  -> isTokenInvalidated(T1, T2) -> T1 < T2 ? revoked : valid

If T1 >= T2 (clock jumped backward between login and invalidation):
  -> isTokenInvalidated returns false
  -> Deactivated user retains access
```

**Competing hypothesis:** Could `tokenInvalidatedAt` be compared against DB time elsewhere?
- No. The proxy fetches `tokenInvalidatedAt` from the DB and compares it directly against the JWT's `authenticatedAt`. There is no DB-time conversion step.

**Root cause:** `tokenInvalidatedAt` is set using app-server time, while the comparison is against a JWT value that was also set using app-server time at a different moment. If the app-server clock changes between these two moments, the comparison is invalid.

**Fix:** Use `getDbNowUncached()` for `tokenInvalidatedAt` so it's in the DB reference frame, and ensure JWT `authenticatedAt` is also comparable against DB time (or document the assumption clearly).

---

### MEDIUM 1 — Public contest status flow: display vs API inconsistency

**Causal trace:**

```
User visits /contests (public)
  -> getPublicContests() -> getContestStatus(contest, new Date()) -> status = "open"
  -> User sees contest as "open"

User clicks "start exam"
  -> API call: startExamSession()
  -> DB time check: SELECT NOW() -> contest is "closed"
  -> API returns error "assignmentClosed"
  -> User confused: page said "open" but API says "closed"
```

**Root cause:** `new Date()` in `getPublicContests()` doesn't match `SELECT NOW()` in `startExamSession()`.

**Fix:** Use `getDbNow()` in `getPublicContests()` and `getPublicContestById()`.

---

## Final sweep

No additional suspicious flows found. The chat widget, backup/restore, and recruiting flows all have proper DB-time usage for their security-critical paths.
