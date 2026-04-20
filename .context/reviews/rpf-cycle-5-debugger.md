# Debugger Review -- Review-Plan-Fix Cycle 5

**Reviewer:** debugger
**Base commit:** 4c2769b2

## Findings

### F1 -- Group assignment export: `getAssignmentStatusRows` can return null but CSV generation doesn't check all fields
- **Severity:** LOW
- **Confidence:** HIGH
- **File:** `src/app/api/v1/groups/[id]/assignments/[assignmentId]/export/route.ts:50-73`
- **Description:** After `getAssignmentStatusRows` returns a non-null result, the CSV generation at line 63-72 accesses `row.latestSubmittedAt`, `row.latestStatus`, `row.bestTotalScore`, etc. The `bestTotalScore` field could be null for students who have no terminal submissions. The code uses `String(row.bestTotalScore)` which would render "null" as the CSV cell value. This is not a crash but produces incorrect CSV output.
- **Concrete failure:** A student who submitted but has no terminal (judged) submission would have `bestTotalScore: null`, rendered as "null" in the CSV instead of an empty cell or "0".
- **Suggested fix:** Use `row.bestTotalScore ?? ""` or `row.bestTotalScore ?? 0` in the CSV generation.

### F2 -- SSE connection cleanup race condition between timer and request abort
- **Severity:** LOW
- **Confidence:** MEDIUM
- **File:** `src/app/api/v1/submissions/[id]/events/route.ts:267-364`
- **Description:** The `close()` function inside the ReadableStream start callback unsubscribes from the poll, clears the timeout, and releases the connection slot. However, both the `abort` event handler (line 290) and the timeout handler (line 292) can call `close()`. The `closed` flag prevents double-closing, but there's a subtle race: if the abort fires between the poll callback checking `closed` (line 303) and the `close()` call inside the poll callback (line 344), the connection slot could be released while the poll callback is still executing. This is a theoretical concern since the single-threaded JS event loop prevents true races, but the interleaving of async operations (line 309, 327) creates a window.
- **Suggested fix:** This is a low-risk theoretical issue. The `closed` flag and the `try/catch` around `controller.enqueue` (line 354) provide sufficient protection. No immediate fix needed.

### F3 -- `getDropdownItems` role check misses `super_admin` for admin dropdown item
- **Severity:** LOW
- **Confidence:** HIGH
- **File:** `src/components/layout/public-header.tsx:53,67`
- **Description:** The `isAdmin` check at line 53 includes `super_admin`, and the admin dropdown item at line 67-69 uses `adminOnly: true` but the rendering doesn't actually filter by `adminOnly` -- all items are rendered. Looking more carefully, the `adminOnly` and `instructorOnly` flags in the `DropdownItem` type are defined but never used for conditional rendering. This means ALL dropdown items are shown to ALL authenticated users, including the admin link to students.
- **Concrete failure:** A student user sees "Admin" in the dropdown menu (clicking it would fail with a 403 from the server, but it should not appear at all).
- **Suggested fix:** Filter dropdown items by role in the rendering loop, or better, only include items based on capabilities.

### F4 -- Anti-cheat `POST` route accepts `details` up to 500 chars but some event types could produce longer client-side strings
- **Severity:** LOW
- **Confidence:** LOW
- **File:** `src/app/api/v1/contests/[assignmentId]/anti-cheat/route.ts:30`
- **Description:** The `antiCheatEventSchema` limits `details` to 500 characters. If the client sends a JSON-stringified object longer than 500 chars, Zod rejects it. However, the client-side code that generates these events is not reviewed here, and complex event details (e.g., window resize history, page visibility changes) could exceed 500 chars.
- **Suggested fix:** Document the 500-char limit in the API docs, or increase to 1000 for safety.
