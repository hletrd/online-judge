# Architect Review — Cycle 2

**Base commit:** b91dac5b
**Reviewer:** architect

## F1 — Workspace/control/dashboard route structure is fragmented
- **Severity:** MEDIUM | **Confidence:** HIGH
- **Files:** `src/app/(workspace)/`, `src/app/(control)/`, `src/app/(dashboard)/`
- Three separate route groups with overlapping purposes: workspace redirects to dashboard, control is a thin wrapper for admin functions, and dashboard is the main authenticated area. The user-injected TODO to consolidate these is architecturally sound but requires careful planning to avoid breaking authorization boundaries.
- **Key risk:** The `(workspace)` group uses a sidebar layout (`WorkspaceNav`) while `(dashboard)` uses `AppSidebar`. The `(control)` group has its own layout. Merging these requires reconciling three different navigation paradigms.
- **Fix:** Plan the migration in phases: (1) identify pages that can move immediately, (2) design the unified top navbar, (3) migrate incrementally with feature flags if possible.

## F2 — Chat widget API key storage in DB is an architectural concern
- **Severity:** MEDIUM | **Confidence:** HIGH
- **File:** `src/app/api/v1/plugins/chat-widget/chat/route.ts:176-189`
- AI provider API keys are stored as plaintext in the `plugins` table. This is an architectural pattern that should be revisited — secrets should not be in the primary data store without encryption at rest.
- **Fix:** Encrypt API keys using the existing `derive-key.ts`/`encryption.ts` infrastructure, or move to env-var-only configuration.

## F3 — `rateLimits` table multiplexing continues to be an architectural concern
- **Severity:** LOW | **Confidence:** MEDIUM
- **File:** `src/lib/realtime/realtime-coordination.ts`, `src/lib/security/rate-limit.ts`
- Previously flagged (cycle 1 AGG-6). The `rateLimits` table serves both API rate limiting and SSE connection tracking with different semantics for `blockedUntil`. This coupling makes schema changes risky.
- **Fix:** Long-term: separate SSE tracking into a dedicated table. Short-term: add code comments documenting the dual use.
