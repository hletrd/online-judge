# Architect Lane - Cycle 1

**Date:** 2026-04-26
**Angle:** Architectural/design risks, coupling, layering, abstraction quality

## Finding ARCH-1: Time authority is now split across the codebase

**File:** `src/app/api/v1/contests/[assignmentId]/analytics/route.ts:62`

**Architectural concern:** The codebase has a well-defined time authority pattern: `getDbNowMs()` for server-side time. The `db-time.ts` module provides:
- `getDbNow()` — React cached version for Server Components
- `getDbNowUncached()` — for API routes
- `getDbNowMs()` — convenience wrapper returning milliseconds

These are used consistently in:
- `api-rate-limit.ts` — rate limit window computation
- Judge claim route — claim timestamp
- `contest-scoring.ts` — ranking cache staleness

Now `analytics/route.ts` introduces `Date.now()` for cache staleness. This breaks the architectural convention. While justified by performance, it creates a split time-source pattern.

**Risk:** Future developers see `Date.now()` patterns and replicate them in correctness-critical contexts (e.g., rate limits, deadlines) where clock skew matters.

**Mitigation:** The comments in the analytics route (lines 56-61, 82-86) carefully explain the rationale and explicitly state that DB time is still used where authoritative time is needed. This is good documentation.

**Suggestion:** Consider adding a lightweight `getApproximateNowMs()` utility that uses `Date.now()` but with a JSDoc discouraging use in correctness-critical contexts.

---

## Finding ARCH-2: Anti-cheat monitor component is architecturally complex

**File:** `src/components/exam/anti-cheat-monitor.tsx`

**Architectural assessment:** The component has grown to 321 lines handling:
1. Privacy notice UI (dialog)
2. Event recording (tab switch, blur, copy, paste, contextmenu)
3. Event deduplication (MIN_INTERVAL_MS)
4. LocalStorage persistence (load/save/flush)
5. API reporting (sendEvent)
6. Retry scheduling (exponential backoff)
7. Heartbeat monitoring
8. Visibility change handling
9. Online/offline event handling
10. Element description (describeElement)

This violates the Single Responsibility Principle. The component manages state, I/O, scheduling, and UI rendering — all in one file.

**Suggestion:** Decompose into:
- `useAntiCheatEvents` — hook for event recording, deduplication, API sending
- `useAntiCheatRetry` — hook for retry scheduling, localStorage persistence
- `AntiCheatPrivacyNotice` — component for the privacy dialog
- `AntiCheatMonitor` — thin orchestrator composing the above

The current refactoring (extracting `performFlush` and `scheduleRetryRef`) is a step in the right direction but doesn't fully address the coupling.

---

## Finding ARCH-3: Cookie name constants belong in auth config, not security/env

**File:** `src/lib/security/env.ts:8-9,178-180`

**Architectural concern:** `env.ts` is becoming a dumping ground for configuration constants that aren't necessarily environment-related.

- `AUTH_SESSION_COOKIE_NAME` and `SECURE_AUTH_SESSION_COOKIE_NAME` are auth configuration constants
- `getAuthSessionCookieNames()` is an auth utility
- `shouldUseSecureSessionCookie()` uses AUTH_URL (environment) but is about auth behavior
- `getAuthUrl()` / `getAuthUrlObject()` / `validateAuthUrl()` are true environment functions

The module mixes two concerns: environment variable validation and auth cookie configuration.

**Suggestion:** Move auth cookie name constants to `src/lib/auth/config.ts` (which already exists per CLAUDE.md line 5). The `getAuthSessionCookieName()` and `getAuthSessionCookieNames()` functions could live there too.

**Note:** CLAUDE.md says "always use the current src/lib/auth/config.ts as-is" for deployment. Moving constants there would need careful handling.

---

## Finding ARCH-4: Module coupling via proxy.ts imports

**File:** `src/proxy.ts:1-16`

**Architectural assessment:** `proxy.ts` imports from 10 different modules:
- `next-auth/jwt` (external)
- `@/lib/auth/secure-cookie`
- `@/lib/auth/session-security`
- `@/lib/api/auth`
- `@/lib/security/env`
- `@/lib/audit/events`
- `@/lib/public-route-seo`
- `@/lib/i18n/constants`

This is the middleware layer — it's expected to be the integration point. The addition of `getAuthSessionCookieNames` adds one more import from `@/lib/security/env`, which is already imported. No increase in coupling.

**Verdict:** No architectural regression.

---

## Finding ARCH-5: Analytics cache uses module-level mutable state

**File:** `src/app/api/v1/contests/[assignmentId]/analytics/route.ts:17,20,24`

**Architectural concern:** Three pieces of module-level mutable state:
```typescript
const analyticsCache = new LRUCache<string, CacheEntry>({ max: 100, ttl: CACHE_TTL_MS });
const _refreshingKeys = new Set<string>();
const _lastRefreshFailureAt = new Map<string, number>();
```

This is a common Next.js App Router pattern (module-level state survives between requests in the same process). But:
1. In serverless deployments (Vercel), each function instance has its own cache — not shared across instances
2. The cache is per-process, so horizontal scaling reduces cache hit rate
3. The `_refreshingKeys` guard only works within a single process

**Assessment:** This is an acceptable tradeoff for a self-hosted Docker deployment (single process). For serverless, a Redis-backed cache would be needed. The current implementation is appropriate for the documented Docker deployment architecture.

---

## Summary

| ID | Finding | Severity | Confidence |
|----|---------|----------|------------|
| ARCH-1 | Split time authority pattern | MEDIUM | HIGH |
| ARCH-2 | Anti-cheat component complexity | LOW | MEDIUM |
| ARCH-3 | Cookie constants in wrong module | LOW | LOW |
| ARCH-4 | Proxy import coupling — no change | — | HIGH |
| ARCH-5 | Module-level cache in serverless | LOW | MEDIUM |

Total: 3 architectural findings, 2 verification notes.
