# Cycle 13 Review Remediation Plan

**Date:** 2026-04-19
**Source:** `.context/reviews/cycle-13-comprehensive-review.md` and `.context/reviews/_aggregate.md`
**Status:** Complete

---

## MEDIUM Priority

### M1: Fix community votes race condition with transaction
- **File**: `src/app/api/v1/community/votes/route.ts:78-107`
- **Status**: DONE (commit c7510e10)
- **Fix applied**:
  1. Wrapped the read-check-write logic in `db.transaction()`
  2. Moved `findFirst`, `delete`, `update`, `insert` branch logic inside the transaction
  3. Moved the score summary query to run within the same transaction for consistent read
  4. Updated test mock to include `db.transaction` that delegates to a mock `tx` object
- **Exit criterion**: Met — No TOCTOU race in community votes route; all operations run atomically within a transaction.

### M2: Remove or harden deprecated `validateRoleChange` sync function
- **File**: `src/lib/users/core.ts:83-101`
- **Status**: DONE (commit d28f804c)
- **Fix applied**:
  1. Verified no production callers import `validateRoleChange` (all use `validateRoleChangeAsync`)
  2. Removed the deprecated function entirely
  3. Removed the `canManageRole` import (only used by the removed sync function)
  4. Updated all test mocks that referenced the removed function (`core.test.ts`, `user-management.test.ts`, `users.bulk.route.test.ts`, `users.route.test.ts`)
- **Exit criterion**: Met — No exported `validateRoleChange` function with hardcoded `=== "super_admin"` check exists in the codebase.

---

## LOW Priority

### L1: Refactor analytics page raw SQL to use Drizzle subquery
- **File**: `src/app/(dashboard)/dashboard/groups/[id]/analytics/page.tsx:71`
- **Status**: DONE (commit 6b5919f9)
- **Fix applied**:
  1. Replaced raw `sql`ANY (${subquery})`` with two-step: fetch assignment IDs first, then use `inArray()`
  2. Replaced `sql`... NOT IN ('pending', 'queued', 'judging')`` with Drizzle `notInArray()` using `ACTIVE_SUBMISSION_STATUSES` from `@/lib/submissions/status`
  3. Added empty-array guard to avoid `IN ()` SQL error
- **Exit criterion**: Met — No raw `sql` template with hardcoded status strings in analytics page; uses Drizzle query builder and shared constant.

### L2: Document anti-cheat LRU cache single-instance limitation
- **File**: `src/app/api/v1/contests/[assignmentId]/anti-cheat/route.ts:16`
- **Status**: DEFERRED
- **Reason**: The `getUnsupportedRealtimeGuard` at line 37 already blocks the endpoint in multi-instance deployments without shared coordination. The LRU cache is only used when running single-instance (which is the documented deployment model). No production impact.
- **Exit criterion**: Re-open if multi-instance deployment without shared coordination becomes a supported configuration for anti-cheat routes.

### L3: Replace hardcoded `role?.name === "super_admin"` with level check in role editor dialog
- **File**: `src/app/(dashboard)/dashboard/admin/roles/role-editor-dialog.tsx:83,114`
- **Status**: DONE (commit 6d9431ef)
- **Fix applied**:
  1. Added `superAdminLevel` prop to `RoleEditorDialogProps` (defaults to 4)
  2. Replaced `role?.name === "super_admin"` at line 83 with `(role && role.level >= superAdminLevel)`
  3. Replaced `role?.name === "super_admin"` at line 114 with `role != null && role.level >= superAdminLevel`
- **Exit criterion**: Met — Role editor dialog uses level-based check instead of hardcoded role name.

### L4: Replace hardcoded `userRole === "super_admin"` with level check in user actions
- **File**: `src/app/(dashboard)/dashboard/admin/users/user-actions.tsx:80`
- **Status**: DONE (commit 6d9431ef)
- **Fix applied**:
  1. Replaced `userRole` prop with `userLevel` (optional number) in `UserActions` component
  2. Replaced `userRole === "super_admin"` with `userLevel != null && userLevel >= 4`
  3. Updated both parent components (`users/page.tsx` and `users/[id]/page.tsx`) to pass `userLevel` from the role record
  4. Added `level` to the role query columns in `users/[id]/page.tsx`
- **Exit criterion**: Met — User actions component uses level-based check instead of hardcoded role name.

### L5: Add warning for elevated roles in bulk create dialog
- **File**: `src/app/(dashboard)/dashboard/admin/users/bulk-create-dialog.tsx:77-79`
- **Status**: DEFERRED
- **Reason**: The bulk create API route validates role assignments server-side. The client-side normalization merely maps CSV input to known role names. Adding a warning would be a UX enhancement but the server already protects against unauthorized role assignments. Low risk of confusion in practice since only super_admins can use the bulk create dialog.
- **Exit criterion**: Re-open if bulk user creation is made available to non-super-admin roles.

---

## Deferred Items

| Finding | Severity | Reason | Exit Criterion |
|---------|----------|--------|----------------|
| L2 (anti-cheat LRU cache) | LOW | Already guarded by `getUnsupportedRealtimeGuard`; single-instance is documented deployment model | Re-open if multi-instance becomes supported for anti-cheat |
| L5 (bulk create elevated roles) | LOW | Server validates role assignments; only super_admins can use the dialog | Re-open if bulk create is available to non-super-admin roles |
