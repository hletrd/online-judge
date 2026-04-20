# Architecture Review -- Review-Plan-Fix Cycle 5

**Reviewer:** architect
**Base commit:** 4c2769b2

## Findings

### F1 -- Inconsistent API handler pattern: 5 routes still use manual `getApiUser`
- **Severity:** LOW
- **Confidence:** HIGH
- **Files:**
  - `src/app/api/v1/tags/route.ts`
  - `src/app/api/v1/submissions/[id]/events/route.ts` (SSE, valid reason)
  - `src/app/api/v1/groups/[id]/assignments/[assignmentId]/export/route.ts`
  - `src/app/api/v1/admin/migrate/export/route.ts`
  - `src/app/api/v1/admin/backup/route.ts`
  - `src/app/api/v1/files/route.ts`
  - `src/app/api/v1/files/[id]/route.ts`
  - `src/app/api/v1/admin/migrate/import/route.ts`
  - `src/app/api/v1/admin/migrate/validate/route.ts`
  - `src/app/api/v1/admin/restore/route.ts`
  - `src/app/api/v1/groups/[id]/assignments/route.ts` (POST only)
- **Description:** The `createApiHandler` wrapper was introduced to standardize auth, CSRF, rate limiting, body validation, and error handling. However, 11 routes (down from the 12 noted in cycle 4 -- the test/seed route was not counted) still use manual patterns. The SSE route has a legitimate reason (streaming response), and file upload routes have a reason (formData). The others should be migrated. This was noted in cycle 4 (AGG-12) but no progress has been made.
- **Suggested fix:** Incrementally migrate the simple routes (tags, backup, admin/migrate/*, admin/restore, group assignments POST, group assignment export).

### F2 -- PublicHeader dropdown items are hardcoded, not capability-driven
- **Severity:** LOW
- **Confidence:** HIGH
- **File:** `src/components/layout/public-header.tsx:51-72`
- **Description:** The `getDropdownItems` function uses role string comparisons (`role === "instructor"`) instead of capability checks. If a new role is added with a subset of instructor capabilities (e.g., "teaching_assistant"), the dropdown would not show the correct items. The rest of the codebase uses `resolveCapabilities()` for access control.
- **Concrete failure:** Adding a "teaching_assistant" role that can view problems and groups but isn't `instructor` or `admin` would not see those dropdown items.
- **Suggested fix:** Accept a `capabilities` set in the `loggedInUser` prop and use capability checks instead of role string comparisons.

### F3 -- Dual-query pagination pattern should be a shared utility
- **Severity:** LOW
- **Confidence:** MEDIUM
- **Description:** Multiple routes (submissions, problems, users, anti-cheat) all implement the same dual count + data query pattern. If migrated to COUNT(*) OVER(), each route needs to implement the same "extract total from first row" logic. This should be a shared utility function.
- **Suggested fix:** Create a `parsePaginatedResults` utility that extracts the total from a COUNT(*) OVER() result set.

### F4 -- PublicHeader mobile menu does not render dropdown items with icons in accessible way
- **Severity:** LOW
- **Confidence:** MEDIUM
- **File:** `src/components/layout/public-header.tsx:300-312`
- **Description:** The mobile menu renders dropdown items as plain links without indicating their grouping as "Dashboard" navigation items. On desktop, these items are in a dropdown menu with a clear label ("Dashboard"). On mobile, they appear as a flat list mixed with the sign-out button. There is no visual or semantic grouping.
- **Suggested fix:** Add a heading or separator in the mobile menu to group the dashboard navigation items, mirroring the dropdown structure.
