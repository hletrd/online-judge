# Cycle 14 Architect Report

**Base commit:** 74d403a6
**Reviewer:** architect
**Scope:** Architectural/design risks, coupling, layering, module boundaries

---

## CR14-AR1 — [MEDIUM] Three separate rate-limit function families with overlapping responsibilities — `rate-limit.ts`, `api-rate-limit.ts`, `rate-limiter-client.ts`

- **Confidence:** HIGH
- **Files:** `src/lib/security/rate-limit.ts`, `src/lib/security/api-rate-limit.ts`, `src/lib/security/rate-limiter-client.ts`
- **Evidence:** The codebase has three rate-limit modules:
  1. `rate-limit.ts` — login rate limiting with `isRateLimited`, `recordRateLimitFailure`, `recordRateLimitFailureMulti`, `consumeRateLimitAttemptMulti`, `clearRateLimit`
  2. `api-rate-limit.ts` — API rate limiting with `consumeApiRateLimit`, `consumeUserApiRateLimit`, `checkServerActionRateLimit`, uses sidecar + DB
  3. `rate-limiter-client.ts` — Rust sidecar client
  Both `rate-limit.ts` and `api-rate-limit.ts` read/write the same `rateLimits` DB table with similar but not identical logic. `api-rate-limit.ts` has a sidecar pre-check and does not track `consecutiveBlocks`. `rate-limit.ts` has exponential backoff but no sidecar. The `changePassword` server action uses the older `rate-limit.ts` API while most API routes use `api-rate-limit.ts`. This dual-system architecture is a maintenance burden.
- **Suggested fix:** Long-term: unify into a single rate-limit module with configurable strategies (sidecar vs no-sidecar, backoff vs fixed). Short-term: ensure `changePassword` uses the same atomic check+increment pattern as the other consumers.

## CR14-AR2 — [LOW] Sync role-helper functions (`isAtLeastRole`, `canManageUsers`, `isInstructorOrAbove`) are dead code — architectural debt from async migration

- **Confidence:** HIGH
- **Files:** `src/lib/auth/role-helpers.ts:11-13, 30-32, 46-48`
- **Evidence:** Three sync functions remain in `role-helpers.ts` that are never called. They were superseded by async versions that support custom roles via the capability cache. The sync `isAtLeastRole` uses `ROLE_LEVEL` (built-in roles only), while `isAtLeastRoleAsync` uses `getRoleLevel` from the capability cache. This is leftover from the async migration that removed `canManageRole` (cycle 14) and `isAdmin` from external use.
- **Suggested fix:** Remove all three sync functions. They create confusion about which to use and may be accidentally called by future developers who don't realize they don't support custom roles.

## CR14-AR3 — [LOW] `getActiveAuthUserById` in `api/auth.ts` and middleware `proxy()` have separate auth-check implementations with slightly different field selections

- **Confidence:** MEDIUM
- **Files:** `src/lib/api/auth.ts:28-59`, `src/middleware.ts:220-316`
- **Evidence:** The middleware's `proxy()` function calls `getActiveAuthUserById` which uses `authUserSelect` (9 fields including `tokenInvalidatedAt`). The middleware then uses the returned object to check `mustChangePassword`. The API route handlers also call `getApiUser` which calls `getActiveAuthUserById` internally. This is actually well-consolidated. However, `authenticateApiKey` in `api-key-auth.ts` constructs a similar user object with `mustChangePassword: false` hardcoded, bypassing the shared `getActiveAuthUserById` function. This is an architectural inconsistency.
- **Suggested fix:** Have `authenticateApiKey` return the user object from `getActiveAuthUserById` (or a similar function) rather than constructing its own.

## Final Sweep

- Navigation layer is now well-organized after the `public-nav.ts` extraction.
- `createApiHandler` provides a consistent pattern for API routes — most routes use it.
- SSE route remains the exception (streaming response), which is documented.
- Workspace-to-public migration is making good progress (Phase 3 in progress).
- The capability system is well-layered: types -> defaults -> cache -> role-helpers.
