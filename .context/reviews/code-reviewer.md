# Code Quality Review — RPF Cycle 7

**Date:** 2026-04-22
**Reviewer:** code-reviewer
**Base commit:** b3147a98

## Findings

### CR-1: `create-group-dialog.tsx` still parses JSON before checking `response.ok` — error-first anti-pattern [MEDIUM/HIGH]

**File:** `src/app/(dashboard)/dashboard/groups/create-group-dialog.tsx:64-68`

**Description:** Line 64 calls `const data = await response.json()` unconditionally, then line 66 checks `if (!response.ok)`. This is the exact `response.json()` before `response.ok` anti-pattern documented in `client.ts`. When the server returns a non-JSON body (e.g., 502 from a reverse proxy), `response.json()` throws SyntaxError, which is caught by the generic catch on line 74 and surfaces as `tCommon("error")` instead of a meaningful error.

**Concrete failure scenario:** Admin creates a group while the API server is restarting. The reverse proxy returns a 502 HTML page. `response.json()` throws SyntaxError. The catch block shows a generic "Error" toast. The admin has no idea whether the group was created.

**Fix:** Check `response.ok` before calling `response.json()`. Use `.json().catch(() => ({}))` for error bodies.

**Confidence:** HIGH

---

### CR-2: `bulk-create-dialog.tsx` parses JSON before checking `response.ok` [MEDIUM/MEDIUM]

**File:** `src/app/(dashboard)/dashboard/admin/users/bulk-create-dialog.tsx:212-215`

**Description:** Same anti-pattern as CR-1. Line 212 calls `const data = await response.json()`, then line 214 checks `if (!response.ok)`. The `.json()` call can throw SyntaxError on non-JSON error responses.

**Concrete failure scenario:** Bulk user creation hits a proxy timeout. The 502 response body is HTML. `response.json()` throws SyntaxError. Admin sees a generic error toast with no indication of how many users were actually created.

**Fix:** Check `response.ok` before `response.json()`.

**Confidence:** HIGH

---

### CR-3: `database-backup-restore.tsx` restore handler parses JSON before `response.ok` [MEDIUM/MEDIUM]

**File:** `src/app/(dashboard)/dashboard/admin/settings/database-backup-restore.tsx:144-146`

**Description:** The restore handler on line 144 calls `const data = await response.json()` unconditionally, then checks `if (!response.ok)` on line 146. The backup handler (line 44) correctly uses `.json().catch(() => ({}))` before the check, but the restore handler does not.

**Concrete failure scenario:** Database restore hits a proxy error. SyntaxError thrown. Admin sees generic error instead of specific restore failure message.

**Fix:** Apply the same `.json().catch(() => ({}))` pattern used in the backup handler.

**Confidence:** HIGH

---

### CR-4: `admin-config.tsx` test-connection handler calls `response.json()` with no `response.ok` check [MEDIUM/MEDIUM]

**File:** `src/lib/plugins/chat-widget/admin-config.tsx:99-100`

**Description:** The `handleTestConnection` function calls `const data = await response.json()` on line 99 without checking `response.ok` first. When the test-connection endpoint returns an error (e.g., invalid API key returns 400), the error body is still parsed and set as `testResult`, which might work if the error body has `{success: false, error: "..."}`. But if the server returns non-JSON (502), it throws SyntaxError and the catch on line 101 shows a generic "Network error" instead of the actual failure.

**Fix:** Check `response.ok` before parsing, or use `.json().catch(() => ({}))` and validate the response structure.

**Confidence:** MEDIUM

---

### CR-5: `submission-detail-client.tsx` handleRetryRefresh calls `res.json()` without checking `res.ok` [MEDIUM/MEDIUM]

**File:** `src/app/(dashboard)/dashboard/submissions/[id]/submission-detail-client.tsx:100`

**Description:** `handleRetryRefresh` uses a `.then((res) => res.json())` chain without checking `res.ok` first. If the submission API returns a non-JSON error, this throws and the catch shows a generic error toast. This is a less critical path since it's a manual retry action, but it still violates the documented error handling convention.

**Fix:** Check `res.ok` before calling `.json()`, or restructure to use async/await with the standard pattern.

**Confidence:** MEDIUM

---

### CR-6: `admin-config.tsx` `Number(e.target.value)` can produce NaN for `maxTokens` and `rateLimitPerMinute` [LOW/LOW]

**File:** `src/lib/plugins/chat-widget/admin-config.tsx:290,301`

**Description:** `setMaxTokens(Number(e.target.value))` and `setRateLimitPerMinute(Number(e.target.value))` can produce `NaN` if the input is empty or contains non-numeric characters. While HTML `<input type="number">` normally prevents this, the `value` can be an empty string when the user clears the field, producing `NaN` via `Number("")`.

**Concrete failure scenario:** Admin clears the maxTokens field. `Number("")` returns `0`, not `NaN`, but if a user types "e" (scientific notation allowed in number inputs in some browsers), `Number("e")` returns `NaN`. The `min`/`max` attributes only prevent form submission, not the onChange event.

**Fix:** Use `parseInt(e.target.value, 10) || defaultValue` or validate before setting state.

**Confidence:** LOW

---

## Final Sweep

The systematic `response.json()` before `response.ok` anti-pattern identified in cycles 1-3 was partially fixed. The main submission form, discussion components, group member manager, and assignment form dialog were all fixed. However, 4 additional files still use the anti-pattern: `create-group-dialog.tsx`, `bulk-create-dialog.tsx`, `database-backup-restore.tsx` (restore handler only), and `admin-config.tsx`. The `submission-detail-client.tsx` also has the pattern via a `.then()` chain. These are all newly identified instances not previously flagged.
