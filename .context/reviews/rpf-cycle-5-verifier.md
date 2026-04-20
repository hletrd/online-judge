# Verifier Review -- Review-Plan-Fix Cycle 5

**Reviewer:** verifier
**Base commit:** 4c2769b2

## Prior-cycle fix verification

### VERIFIED: AGG-1 (Contest export row limit)
- Contest export at `src/app/api/v1/contests/[assignmentId]/export/route.ts:14` now has `MAX_EXPORT_ENTRIES = 10_000` with post-query truncation and a `truncated` flag in JSON output.

### VERIFIED: AGG-2 (Contest export CSV escape)
- Contest export now imports `escapeCsvField` from `@/lib/csv/escape-field` (line 10). Local `escapeCsvCell` has been removed.

### VERIFIED: AGG-3 (Group assignment export CSV escape)
- Group assignment export now imports `escapeCsvField` from `@/lib/csv/escape-field` (line 11). Local `escapeCsvField` has been removed.

### VERIFIED: AGG-4 (Deploy-worker.sh .env preservation)
- `scripts/deploy-worker.sh` now uses `ensure_env_var` function (lines 98-108) that updates individual keys instead of replacing the entire file. Tested logic: if key exists, sed replaces; if not, appends.

### VERIFIED: AGG-5 (COMPILER_RUNNER_URL auto-injection)
- `deploy-docker.sh:284-286` now calls `ensure_env_secret COMPILER_RUNNER_URL "${COMPILER_RUNNER_DEFAULT}"` when `INCLUDE_WORKER != true`.

### VERIFIED: AGG-7 (parsePagination uses parsePositiveInt)
- `src/lib/api/pagination.ts` now imports and uses `parsePositiveInt` (line 1, 16-17). MAX_PAGE cap is applied.

### VERIFIED: AGG-9 (Proxy matcher /workspace removal)
- `src/proxy.ts:306-324` no longer includes `/workspace/:path*` in the matcher.

### NOT VERIFIED: AGG-6 (PublicHeader authenticated dropdown - Phase 2)
- **Status:** PARTIALLY DONE. The dropdown has been added, but it uses role strings instead of capabilities. The `adminOnly` and `instructorOnly` flags on dropdown items are not actually used for filtering -- ALL items are rendered to ALL users. This means a student sees "Admin" and "Groups" links that they cannot access. The server-side auth will block access, but the UX is wrong.
- **Risk:** MEDIUM -- students see navigation items they can't use.

### NOT VERIFIED: AGG-10 (Contest export + group assignment export tests)
- No new test files have been added for either export route.

### NOT VERIFIED: AGG-11 (Submissions GET dual query)
- `src/app/api/v1/submissions/route.ts:111-134` still uses separate count + data queries.

## New findings

### F1 -- `adminOnly` / `instructorOnly` dropdown item flags are dead code
- **Severity:** MEDIUM
- **Confidence:** HIGH
- **File:** `src/components/layout/public-header.tsx:30-32, 211-219`
- **Description:** The `DropdownItem` type defines `adminOnly?: boolean` and `instructorOnly?: boolean` fields. The `getDropdownItems` function sets these flags on appropriate items. However, the rendering code at lines 211-219 iterates over ALL `dropdownItems` without filtering by these flags. This means every authenticated user sees every dropdown item, including "Problems", "Groups", and "Admin" which are restricted to instructors/admins.
- **Concrete failure:** A student user sees the "Admin" link in the dropdown. Clicking it would redirect to `/dashboard/admin` which the server blocks with a 403, but the link should not be visible.
- **Suggested fix:** Filter dropdown items by role before rendering.

### F2 -- Mobile menu also shows all dropdown items without filtering
- **Severity:** MEDIUM
- **Confidence:** HIGH
- **File:** `src/components/layout/public-header.tsx:300-312`
- **Description:** Same issue as F1 but in the mobile menu. The `dropdownItems.map()` at line 302 renders all items including admin-only ones.
- **Suggested fix:** Same as F1 -- filter by role before rendering.
