# Cycle 22 Performance Reviewer

**Date:** 2026-04-20
**Base commit:** 717a5553

---

## F1: Dashboard layout makes 4 sequential async calls that could be parallelized further [MEDIUM/MEDIUM]

**Files:** `src/app/(dashboard)/layout.tsx:34-64`
**Description:** The dashboard layout has two sequential `Promise.all` blocks (lines 34-49 and 56-64). The second block depends on `capabilities` from the first, but `getResolvedSystemSettings` and `getActiveTimedAssignmentsForSidebar` only need `session.user.id` and `session.user.role`, which are available before the first block. These could be combined into a single `Promise.all`.
**Fix:** Restructure to resolve all promises in a single `Promise.all` by passing `session.user.id` and `session.user.role` directly.
**Confidence:** MEDIUM

## F2: Public rankings page runs COUNT query in generateMetadata AND in the page component [MEDIUM/MEDIUM]

**Files:** `src/app/(public)/rankings/page.tsx:55-69, 117-120`
**Description:** `generateMetadata` runs a `COUNT(DISTINCT fa.user_id)` query, and the page component runs another `SELECT COUNT(*)::int FROM users` estimate query. While these return slightly different values, the metadata query could be cached or the page could reuse the count from the window function. Running two separate count queries per page load is wasteful.
**Fix:** Use `fetchCache` or React cache to deduplicate the metadata and page queries, or rely solely on the `COUNT(*) OVER()` window function in the page component.
**Confidence:** LOW
