# Cycle 4 Code Quality Review

**Reviewer:** code-reviewer
**Base commit:** 5086ec22

## Findings

### F1 — `parsePagination` uses bare `parseInt` instead of `parsePositiveInt` (NaN bug class)
- **Severity:** MEDIUM
- **Confidence:** HIGH
- **File:** `src/lib/api/pagination.ts:14-17`
- **Description:** `parsePagination` uses `parseInt(searchParams.get("page") || "1", 10) || 1` and `parseInt(searchParams.get("limit") || String(defaultLimit), 10) || defaultLimit`. The `|| 1` / `|| defaultLimit` fallback *does* handle NaN correctly (since `NaN || 1` is `1`), but the pattern is inconsistent with the project-wide adoption of `parsePositiveInt` for all query parameter parsing. The `||` fallback is fragile — it also coerces `0` to the default, but `0` is already excluded by `Math.max(1, ...)`. This inconsistency makes the codebase harder to audit and more likely to see a `Math.max(1, NaN)` regression in future edits.
- **Concrete failure:** If someone refactors `parsePagination` and changes `|| 1` to `Math.max(1, ...)` (matching the pattern in the chat-logs route that was fixed in cycle 3), they would introduce a NaN bug.
- **Suggested fix:** Refactor `parsePagination` to use `parsePositiveInt` for both `page` and `limit` parameters.

### F2 — Contest export uses local `escapeCsvCell` with inconsistent formula-injection mitigation
- **Severity:** MEDIUM
- **Confidence:** HIGH
- **File:** `src/app/api/v1/contests/[assignmentId]/export/route.ts:11-21`
- **Description:** The contest export route has a local `escapeCsvCell` function that prefixes dangerous leading characters with a single quote (`'`), while the shared `escapeCsvField` in `src/lib/csv/escape-field.ts` prefixes with a tab character (`\t`). These two different mitigation strategies produce different CSV output, and the contest export version (single-quote prefix) is actually the weaker approach — a tab prefix is more widely recognized by spreadsheet applications as an escape mechanism.
- **Concrete failure:** A contest name starting with `=` could execute a formula in Excel/LibreOffice when the CSV is opened. The single-quote prefix may not prevent this in all spreadsheet applications, while the tab prefix used by the shared utility is more robust.
- **Suggested fix:** Import `escapeCsvField` from `@/lib/csv/escape-field` and delete the local `escapeCsvCell`.

### F3 — Group assignment export uses local `escapeCsvField` instead of shared utility
- **Severity:** LOW
- **Confidence:** HIGH
- **File:** `src/app/api/v1/groups/[id]/assignments/[assignmentId]/export/route.ts:12-25`
- **Description:** The group assignment export route has another local `escapeCsvField` function. While this one uses the same `\t` prefix strategy as the shared utility, it is still a duplicate that could diverge.
- **Suggested fix:** Import `escapeCsvField` from `@/lib/csv/escape-field` and delete the local copy.

### F4 — Anti-cheat GET route still uses bare `parseInt` for `rawOffset`
- **Severity:** LOW
- **Confidence:** HIGH
- **File:** `src/app/api/v1/contests/[assignmentId]/anti-cheat/route.ts:150`
- **Description:** While the `limit` parameter was fixed to use `parsePositiveInt` in cycle 3, the `offset` parameter still uses `parseInt(searchParams.get("offset") ?? "0", 10)`. The subsequent `Math.max(0, Number.isFinite(rawOffset) ? rawOffset : 0)` does handle NaN correctly, but this is the only route using `parseInt` for offset — inconsistent with the project standard.
- **Suggested fix:** Create a `parseNonNegativeInt` utility or reuse `parsePositiveInt` with a default of 0 and special handling.

### F5 — 11 API routes still use manual `getApiUser` + `csrfForbidden` pattern instead of `createApiHandler`
- **Severity:** LOW
- **Confidence:** HIGH
- **Files:**
  - `src/app/api/v1/tags/route.ts`
  - `src/app/api/v1/submissions/[id]/events/route.ts`
  - `src/app/api/v1/admin/migrate/export/route.ts`
  - `src/app/api/v1/admin/backup/route.ts`
  - `src/app/api/v1/groups/[id]/assignments/[assignmentId]/export/route.ts`
  - `src/app/api/v1/files/route.ts` (POST only)
  - `src/app/api/v1/files/[id]/route.ts`
  - `src/app/api/v1/admin/migrate/import/route.ts`
  - `src/app/api/v1/admin/migrate/validate/route.ts`
  - `src/app/api/v1/admin/restore/route.ts`
  - `src/app/api/v1/groups/[id]/assignments/route.ts` (POST only)
- **Description:** These routes manually call `getApiUser`, `csrfForbidden`, and `consumeApiRateLimit` instead of using the `createApiHandler` wrapper. The SSE and file-upload routes have legitimate reasons (streaming, formData), but the others should be migrated. The manual pattern risks missing CSRF checks, rate limiting, or error handling.
- **Suggested fix:** Migrate routes to `createApiHandler` where feasible (tags, backup, admin/migrate/*, admin/restore, group assignments POST).

### F6 — Contest export has no row limit (OOM risk, same class as cycle-3 AGG-1)
- **Severity:** HIGH
- **Confidence:** HIGH
- **File:** `src/app/api/v1/contests/[assignmentId]/export/route.ts:84-172`
- **Description:** The contest export calls `computeContestRanking(assignmentId)` which returns *all* entries without a limit. On a contest with thousands of participants, this loads all ranking data into memory and serializes it to CSV/JSON. This is the same class of bug as the admin submissions export (AGG-1 in cycle 3) but in a different route.
- **Concrete failure:** A contest with 10,000+ participants could cause OOM on the server during export.
- **Suggested fix:** Add a row limit (e.g., 10,000) or implement streaming CSV via ReadableStream.

### F7 — Group assignment export has no row limit
- **Severity:** MEDIUM
- **Confidence:** HIGH
- **File:** `src/app/api/v1/groups/[id]/assignments/[assignmentId]/export/route.ts:64-97`
- **Description:** `getAssignmentStatusRows(assignmentId)` returns all student rows without a limit. For large groups, this could be memory-intensive.
- **Suggested fix:** Add a row limit or ensure `getAssignmentStatusRows` has internal pagination.
