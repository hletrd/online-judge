# Cycle 12 Review Remediation Plan

**Date:** 2026-04-19
**Source:** `.context/reviews/cycle-12-comprehensive-review.md` and `.context/reviews/_aggregate.md`
**Status:** Complete

---

## MEDIUM Priority

### M1: Replace hardcoded `=== "super_admin"` in `validateRoleChange`/`validateRoleChangeAsync`
- **File**: `src/lib/users/core.ts:93,113`
- **Status**: DONE (commit ae209094)
- **Fix applied**:
  1. Imported `isSuperAdminRole` from `@/lib/capabilities/cache`
  2. Replaced `targetCurrentRole === "super_admin"` with `await isSuperAdminRole(targetCurrentRole)` in `validateRoleChangeAsync`
  3. Replaced `requestedRole !== "super_admin"` with `!(await isSuperAdminRole(requestedRole))` in `validateRoleChangeAsync`
  4. Added `@deprecated` JSDoc to the sync `validateRoleChange` (no callers exist — only `validateRoleChangeAsync` is used)
  5. Updated test mocks to include `isSuperAdminRole`
- **Exit criterion**: Met — No hardcoded `=== "super_admin"` checks remain in `validateRoleChangeAsync`.

### M2: Replace hardcoded `ROLE_LEVELS` in `POST /admin/roles` with `getRoleLevel()`
- **File**: `src/app/api/v1/admin/roles/route.ts:63-64`
- **Status**: DONE (commit 5a093b25)
- **Fix applied**:
  1. Removed local `ROLE_LEVELS` map
  2. Added `getRoleLevel` to existing import from `@/lib/capabilities/cache`
  3. Replaced `const creatorLevel = ROLE_LEVELS[user.role] ?? -1` with `const creatorLevel = await getRoleLevel(user.role)`
- **Exit criterion**: Met — No local `ROLE_LEVELS` map in roles POST route; uses `getRoleLevel()`.

---

## LOW Priority

### L1: Replace `resolveCapabilities` shortcut with level-based check
- **File**: `src/lib/capabilities/cache.ts:94`
- **Status**: DONE (commit 00a4f48c)
- **Fix applied**:
  1. Removed early-return `if (roleName === "super_admin")` shortcut
  2. After `await ensureLoaded()`, check if the role's level >= SUPER_ADMIN_LEVEL and return ALL_CAPABILITIES
  3. Kept the built-in "super_admin" shortcut as fallback for bootstrap (cache not yet loaded)
- **Exit criterion**: Met — Custom roles at super_admin level receive ALL_CAPABILITIES from `resolveCapabilities`.

### L2: Restrict column selection in `GET /api/v1/languages` (public endpoint)
- **File**: `src/app/api/v1/languages/route.ts:11-14`
- **Status**: DONE (commit 225844ed)
- **Fix applied**:
  1. Replaced `db.select().from(languageConfigs)` with explicit column selection `{ id, language, isEnabled }`
- **Exit criterion**: Met — Public languages endpoint only loads necessary columns from DB.

### L3: Add column selection to `GET /api/v1/files/[id]`
- **File**: `src/app/api/v1/files/[id]/route.ts:71-75`
- **Status**: DEFERRED
- **Reason**: The `files` table has no sensitive/unnecessary columns for the file-serve use case. All loaded columns are used in the response.
- **Exit criterion**: Re-open if `files` table gains audit/internal columns.

### L4: Add column selection to `GET /overrides`
- **File**: `src/app/api/v1/groups/[id]/assignments/[assignmentId]/overrides/route.ts:148`
- **Status**: DONE (commit f5878fd2)
- **Fix applied**:
  1. Replaced `db.select().from(scoreOverrides)` with explicit column selection matching the response shape
- **Exit criterion**: Met — Score overrides GET uses explicit column selection.

### L5: Add column selection to admin roles endpoints
- **Files**: `src/app/api/v1/admin/roles/[id]/route.ts` and `src/app/api/v1/admin/roles/route.ts`
- **Status**: DONE (commit fadd9998)
- **Fix applied**:
  1. Added shared `ROLE_COLUMNS` constant in `[id]/route.ts` and used it for GET, PATCH re-fetch, and DELETE
  2. Added `ROLE_COLUMNS` constant in `route.ts` POST re-fetch (GET list already had explicit columns)
- **Exit criterion**: Met — All roles endpoints use explicit column selection.

---

## Deferred Items

| Finding | Severity | Reason | Exit Criterion |
|---------|----------|--------|----------------|
| L3 (files GET uncolumned select) | LOW | All loaded columns are used in the response; `files` table has no sensitive/unnecessary columns | Re-open if `files` table gains audit/internal columns |
