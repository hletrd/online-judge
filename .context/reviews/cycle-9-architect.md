# Cycle 9 Architect Reviewer Report

**Reviewer:** architect
**Date:** 2026-04-19
**Base commit:** 63a31dc0
**Scope:** Architectural/design risks, coupling, layering

## Inventory of Files Reviewed

- `src/lib/auth/config.ts` — NextAuth config with triple field mapping
- `src/lib/api/handler.ts` — API handler factory
- `src/lib/realtime/realtime-coordination.ts` — SSE coordination
- `src/app/api/v1/submissions/[id]/events/route.ts` — SSE route
- `src/app/api/v1/submissions/route.ts` — Submissions CRUD
- `src/app/api/v1/playground/run/route.ts` — Playground execution
- `src/lib/compiler/execute.ts` — Code execution engine
- `src/lib/db/export.ts` — Export engine
- `src/lib/db/import.ts` — Import engine
- `src/lib/db/schema.ts` / `schema.pg.ts` — DB schema
- `src/app/(public)/layout.tsx` — Public layout
- `src/app/(dashboard)/layout.tsx` — Dashboard layout
- `src/proxy.ts` — Middleware/proxy

## Findings

### CR9-AR1 — [MEDIUM] Auth field mapping violates DRY — 3 locations maintain identical field lists

- **Confidence:** HIGH
- **File:** `src/lib/auth/config.ts:52-104, 327-345, 397-415`
- **Cross-agent agreement:** code-reviewer CR9-CR1
- **Evidence:** The same ~15 user fields are mapped in `createSuccessfulLoginResponse`, `syncTokenWithUser`, and the `jwt` callback's inline object. Adding or removing a user preference field requires coordinated changes in all three locations. The `session` callback also mirrors these fields (line 417-441).
- **Architectural risk:** This is a maintenance hazard that will worsen as more user preferences are added. A single missed update breaks the auth flow silently.
- **Suggested fix:** Extract a `mapUserToAuthFields(user)` function and a `mapTokenToSession(token)` function. Have all three locations call the shared function.

### CR9-AR2 — [MEDIUM] SSE route mixes connection management, polling, and business logic in a single 411-line file

- **Confidence:** HIGH
- **File:** `src/app/api/v1/submissions/[id]/events/route.ts`
- **Evidence:** The route file contains:
  1. Connection tracking (Set/Map data structures, addConnection, removeConnection) — lines 22-84
  2. Shared polling manager (subscribeToPoll, unsubscribeFromPoll, sharedPollTick) — lines 95-172
  3. Route handler logic (GET function) — lines 177-373
  4. Helper functions (sseHeaders, queryFullSubmission) — lines 375-410
  
  This makes the file hard to test and reason about. Connection management and polling are infrastructure concerns that should be separate from the route handler.
- **Architectural risk:** Changes to connection tracking (e.g., adding per-IP limits) require understanding the full 411-line file. Testing individual components in isolation is not possible.
- **Suggested fix:** Extract connection management into `src/lib/realtime/sse-connection-tracker.ts` and polling management into `src/lib/realtime/sse-poll-manager.ts`. The route handler should import and use these modules.

### CR9-AR3 — [LOW] `rateLimits` table used for two semantically different purposes (rate limiting + SSE connection tracking)

- **Confidence:** MEDIUM
- **File:** `src/lib/realtime/realtime-coordination.ts:92-131`
- **Cross-agent agreement:** perf-reviewer CR9-PR5
- **Evidence:** The `rateLimits` table stores both actual rate-limit records and SSE connection slot records (keyed with `realtime:sse:user:` prefix). The `acquireSharedSseConnectionSlot` function inserts rows with `attempts`, `windowStartedAt`, `blockedUntil`, etc., but these fields have different semantics for SSE connections vs rate limits.
- **Architectural risk:** Schema changes to the `rateLimits` table must account for both use cases. Cleanup logic for expired rate limits might accidentally remove SSE connection records (or vice versa). Querying rate-limit stats becomes noisy with SSE connection records mixed in.
- **Suggested fix:** Consider a dedicated `realtimeConnections` table with columns appropriate for connection tracking (userId, connectionId, expiresAt). This would also make the LIKE queries unnecessary.

### CR9-AR4 — [LOW] Workspace-to-public migration has accumulated technical debt in route group structure

- **Confidence:** HIGH
- **File:** `src/app/(public)/`, `src/app/(dashboard)/`, `src/app/(control)/`
- **Evidence:** The workspace-to-public migration plan (Phase 3-4 still pending) means the codebase currently has:
  - `(public)` layout with `PublicHeader`/`PublicFooter`
  - `(dashboard)` layout with `AppSidebar`/`Breadcrumb`/`LectureModeProvider`/`ChatWidgetLoader`
  - `(control)` layout with `ControlNav`
  
  The `(workspace)` group was eliminated in Phase 1, but the dual navigation paradigm still exists. The `PublicHeader` now has authenticated dropdown items (Phase 2), but the dashboard still uses its own sidebar. This creates two separate navigation systems that must be kept in sync.
- **Architectural risk:** Navigation changes must be made in two places. The "back to public site" link (added in commit 2bfcbb89) is a workaround, not a long-term solution.
- **Suggested fix:** Continue with Phase 3 of the workspace-to-public migration plan. The top navbar should be the single source of truth for navigation on all pages.

## Previously Found Issues (Still Open)

- D1: SSE submission events route capability check incomplete (MEDIUM)
- D4: Test coverage gaps for workspace-to-public migration Phase 2 (MEDIUM)
- D8: PublicHeader click-outside-to-close (LOW)
