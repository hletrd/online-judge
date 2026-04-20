# Cycle 4 Architect Review

**Reviewer:** architect
**Base commit:** 5086ec22

## Findings

### F1 — PublicHeader lacks authenticated dropdown menu (migration Phase 2 prerequisite)
- **Severity:** MEDIUM
- **Confidence:** HIGH
- **File:** `src/components/layout/public-header.tsx:154-176`
- **Description:** The `PublicHeader` component renders a single link when the user is logged in (`loggedInUser.href`/`loggedInUser.label`). The workspace-to-public migration plan calls for a "Dashboard" dropdown menu with role-appropriate links (Problems, Groups, Submissions, Profile, Admin). Without this dropdown, authenticated users have no way to navigate to dashboard features from public pages except by manually entering `/dashboard`. This is the Phase 2 item from the migration plan.
- **Suggested fix:** Implement the authenticated dropdown as described in `plans/open/2026-04-19-workspace-to-public-migration.md` Phase 2.

### F2 — Inconsistent API handler patterns across codebase
- **Severity:** LOW
- **Confidence:** HIGH
- **Files:** 11 routes using manual `getApiUser` pattern (see code-reviewer F5)
- **Description:** The codebase has two patterns for API route handlers: `createApiHandler` (the modern, recommended pattern) and manual `getApiUser` + `csrfForbidden` + `consumeApiRateLimit`. The manual pattern is error-prone (missing CSRF checks, inconsistent error handling) and increases maintenance burden. Some routes like SSE and file-upload have legitimate reasons for the manual pattern, but others (tags, backup, admin/migrate/*) should be migrated.
- **Suggested fix:** Establish a guideline that all new routes must use `createApiHandler`. Migrate existing manual routes incrementally.

### F3 — Proxy matcher includes dead `/workspace/:path*` entry
- **Severity:** LOW
- **Confidence:** HIGH
- **File:** `src/proxy.ts:311`
- **Description:** After the Phase 1 workspace migration, the `/workspace/:path*` matcher entry is dead code. The redirects are handled by Next.js route-level redirects, not the proxy middleware.
- **Suggested fix:** Remove `/workspace/:path*` from the matcher.

### F4 — Contest export and group assignment export bypass `createApiHandler` auth/capabilities framework
- **Severity:** MEDIUM
- **Confidence:** HIGH
- **Files:**
  - `src/app/api/v1/contests/[assignmentId]/export/route.ts` — uses `createApiHandler` but only checks `canViewAssignmentSubmissions`
  - `src/app/api/v1/groups/[id]/assignments/[assignmentId]/export/route.ts` — uses manual `getApiUser` + `canManageGroupResourcesAsync`
- **Description:** These export routes have different authorization checks from each other and from the rest of the codebase. The contest export checks `canViewAssignmentSubmissions` (broad), while the group assignment export checks `canManageGroupResourcesAsync` (narrower). The inconsistency means that different users may have access to the same data through different routes.
- **Suggested fix:** Standardize authorization checks for export routes. Both should require management-level access.
