# Critic Review -- Review-Plan-Fix Cycle 5

**Reviewer:** critic
**Base commit:** 4c2769b2

## Findings

### F1 -- Group assignment export OOM risk is a carried-over regression from cycle 4
- **Severity:** MEDIUM
- **Confidence:** HIGH
- **Description:** The group assignment export route's unbounded data loading was identified in cycle 4 (AGG-3) as LOW severity. However, the contest export version of the same issue was rated HIGH (AGG-1) and was fixed. The severity discrepancy is questionable -- both routes have similar OOM risk, but the group export serves a different use case (grades export by instructor) that may involve even larger data sets (all students in a class with multiple problems). The finding should have been elevated to MEDIUM in cycle 4.
- **Suggested fix:** Elevate severity and implement the same MAX_EXPORT_ROWS cap used for contest export.

### F2 -- PublicHeader dropdown uses role strings instead of capabilities
- **Severity:** MEDIUM
- **Confidence:** HIGH
- **File:** `src/components/layout/public-header.tsx:51-53`
- **Description:** The `getDropdownItems` function checks `role === "instructor" || role === "admin" || role === "super_admin"` and `role === "admin" || role === "super_admin"`. This hardcodes role names and creates a maintenance burden when roles change. The rest of the application uses the capability system (`resolveCapabilities`) for access control. This inconsistency means the header navigation can fall out of sync with actual permissions.
- **Concrete failure:** If a custom role is created with `problems.view_all` capability but not named "instructor" or "admin", the dropdown won't show the "Problems" link even though the user can access the problems page.
- **Suggested fix:** Pass capabilities to the header component and use capability checks.

### F3 -- Deploy-worker.sh `ensure_env_var` sed injection risk
- **Severity:** MEDIUM
- **Confidence:** MEDIUM
- **File:** `scripts/deploy-worker.sh:101-107`
- **Description:** The `sed -i` command uses `|` as the delimiter but the value can contain `|` characters (e.g., URLs with pipe characters, though rare). More practically, the value interpolation into a double-quoted shell string over SSH means that shell special characters in the value (like `$`, backticks) could be interpreted. The `AUTH_TOKEN` is typically an opaque string, but `APP_URL` is user-provided via `--app-url`.
- **Suggested fix:** Use a Python one-liner or `awk` for the env file update, which avoids shell interpolation issues.

### F4 -- Cycle 21 plan items M3/M4 (leaderboard live rank + participant timeline tests) still TODO
- **Severity:** LOW
- **Confidence:** HIGH
- **Description:** These test tasks were created in the cycle 21 remediation plan but remain TODO. They represent real test coverage gaps for critical scoring functions. The `computeSingleUserLiveRank` function is used in the frozen leaderboard feature, and incorrect behavior could give students wrong rank information during exams.
- **Suggested fix:** Prioritize implementing these tests.

### F5 -- `parsePagination` capped at MAX_PAGE=10000 but no error/warning when exceeded
- **Severity:** LOW
- **Confidence:** MEDIUM
- **File:** `src/lib/api/pagination.ts:3,16`
- **Description:** When a client requests page > 10000, the function silently caps to 10000 without any indication to the client. This means the client may think they're viewing page 10001 but they're actually viewing page 10000 again. A `truncated` flag in the response would be more helpful.
- **Suggested fix:** Either return an error when page exceeds MAX_PAGE, or include a `maxPage` field in paginated responses.
