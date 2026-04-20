# Architect — Cycle 7 Deep Review

**Date:** 2026-04-20
**Scope:** Architectural/design risks, coupling, layering

---

## Findings

### HIGH 1 — Inconsistent time-source discipline across the codebase

**Confidence:** HIGH
**Files:**
- `src/lib/db-time.ts` (getDbNow/getDbNowUncached — DB time)
- `src/lib/assignments/public-contests.ts:30,124` (new Date — app time)
- `src/lib/assignments/active-timed-assignments.ts:15,44` (new Date — app time)
- `src/app/api/v1/users/[id]/route.ts:164,185,218,260,466` (new Date — app time)
- `src/lib/actions/user-management.ts:114,308` (new Date — app time)
- `src/lib/actions/change-password.ts:75` (new Date — app time)
- `src/lib/assignments/recruiting-invitations.ts:242,359` (new Date — app time)
- `src/app/api/v1/contests/[assignmentId]/anti-cheat/route.ts:110,128` (new Date — app time)
- `src/app/api/v1/contests/[assignmentId]/invite/route.ts:103,115` (new Date — app time)
- `src/app/api/v1/submissions/route.ts:317` (new Date — app time — previously deferred)

**Problem:** The codebase has a well-designed `getDbNow()`/`getDbNowUncached()` utility and previous cycles have been systematically migrating security-relevant `new Date()` calls to use DB time. However, the migration is incomplete. There is no architectural rule or lint check that prevents developers from introducing new `new Date()` calls in security-relevant paths. The pattern of "some paths use DB time, some use app time" creates a maintenance burden and a risk of regressions.

**Suggested fix:**
1. Complete the migration of all security-relevant `new Date()` calls to DB time.
2. Add an ESLint rule or code comment convention that flags `new Date()` in security-relevant paths (anything involving deadlines, session invalidation, access control).
3. Consider a shared `withDbNow()` wrapper or context that makes DB time available without explicit async calls in server components.

---

### MEDIUM 1 — SSE route not using `createApiHandler` pattern

**Confidence:** MEDIUM
**Files:**
- `src/app/api/v1/submissions/[id]/events/route.ts:1-2`

**Problem:** The SSE events route has a comment: `// SSE route: not migrated to createApiHandler due to streaming response`. This means it manually handles auth, rate limiting, and error handling instead of using the shared `createApiHandler` middleware. While there's a valid reason (streaming responses), this creates a divergence in the API handler pattern. The SSE route has had bugs related to non-null assertions and connection cleanup that the shared handler would have caught.

**Suggested fix:** Extend `createApiHandler` to support streaming responses, or document the pattern more clearly for future SSE routes.

---

### MEDIUM 2 — Inconsistent `createdAt`/`updatedAt` defaulting strategy

**Confidence:** LOW
**Files:**
- `src/lib/db/schema.pg.ts` (many `.$defaultFn(() => new Date())` calls)
- Various API routes that explicitly set `createdAt: new Date()`

**Problem:** Some tables use Drizzle's `.$defaultFn(() => new Date())` for `createdAt`/`updatedAt`, while some API routes explicitly set these values during inserts. This creates a dual-source pattern where it's unclear whether the DB default or the explicit value takes precedence. If both are present, the explicit value wins, but if someone removes the explicit value expecting the DB default to work, it may not if the Drizzle default is overridden by the ORM.

**Suggested fix:** Choose one strategy consistently: either rely on DB/Drizzle defaults everywhere, or always set explicitly in application code. Document the choice.

---

## Final sweep

The overall architecture is sound. The Next.js App Router pattern with server components, the `createApiHandler` middleware factory, and the Drizzle ORM usage are all well-structured. The main architectural debt is the inconsistent time-source discipline.
