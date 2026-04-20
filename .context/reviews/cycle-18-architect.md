# Cycle 18 Architect Reviewer Findings

**Date:** 2026-04-19
**Reviewer:** Architectural/design risks, coupling, layering
**Base commit:** 7c1b65cc

---

## Findings

### F1: `getRecruitingAccessContext` is a cross-cutting concern without a caching layer — systemic N+1 risk

- **File**: `src/lib/recruiting/access.ts:14-66`
- **Severity**: MEDIUM
- **Confidence**: HIGH
- **Description**: This is an architectural issue rather than a simple code issue. `getRecruitingAccessContext` is a cross-cutting concern (similar to auth context) that is called from 15+ locations. Unlike auth context which is cached via the JWT session, this function hits the database on every call. The lack of a caching strategy means every new page or route that needs recruiting context adds another redundant DB query. This is a systemic pattern issue that will get worse as more features are added.
- **Suggested fix**: Create a `withRecruitingContext()` wrapper or React `cache()` wrapper that ensures the context is computed once per request. This is the architectural fix, as opposed to the code-level fix of deduplicating calls in individual pages.

### F2: Admin data-management routes have duplicated request-handling logic — violation of DRY

- **File**: `src/app/api/v1/admin/backup/route.ts`, `src/app/api/v1/admin/restore/route.ts`, `src/app/api/v1/admin/migrate/export/route.ts`, `src/app/api/v1/admin/migrate/import/route.ts`
- **Severity**: LOW
- **Confidence**: HIGH
- **Description**: All four admin data-management routes share the same authentication/authorization pattern (getApiUser, CSRF check, capability check, rate limit, password verification). This pattern is repeated verbatim in each file. Additionally, the import route has duplicated logic between its form-data and JSON paths. This increases the risk of the routes diverging over time (e.g., one route gets a security update but others don't).
- **Suggested fix**: Create a `withAdminPasswordVerification()` middleware/handler wrapper that encapsulates the common auth + CSRF + capability + rate limit + password verification pattern. Each route would only need to specify its unique logic (export, import, etc.).

### F3: Workspace-to-public migration Phase 3 is stalled — `AppSidebar` still contains navigation items that duplicate PublicHeader

- **File**: `plans/open/2026-04-19-workspace-to-public-migration.md`
- **Severity**: LOW
- **Confidence**: MEDIUM
- **Description**: The migration plan shows Phase 3 is "IN PROGRESS" with remaining work: "Further slim down AppSidebar to icon-only mode or contextual sub-navigation", "Move breadcrumb to top navbar area", and "Evaluate (control) route group merge into (dashboard)/admin". While these are UX improvements rather than bugs, the dual-navigation state (PublicHeader + AppSidebar with overlapping items) creates a confusing user experience and adds maintenance burden.
- **Suggested fix**: Continue Phase 3 work in this cycle: at minimum, convert `AppSidebar` to an icon-only rail (remove text labels from items already in PublicHeader dropdown) and evaluate the `(control)` route group merge.

---

## Verified Safe

### VS1: Route group structure is reasonable
- The (public), (dashboard), and (control) route groups are logically separated. The workspace group was correctly removed in Phase 1.

### VS2: Data retention architecture is properly layered
- `data-retention.ts` (config), `data-retention-maintenance.ts` (pruning), `audit/events.ts` (audit pruning), `db/cleanup.ts` (deprecated cron endpoint). The cleanup.ts is now properly marked as deprecated and uses canonical config.
