# RPF Cycle 20 — Debugger

**Date:** 2026-04-22
**Base commit:** 4182e529

## Findings

### DBG-1: `create-group-dialog.tsx:74-78` — Unguarded `.json()` + `data.data.id` crash chain [MEDIUM/HIGH]

**File:** `src/app/(dashboard)/dashboard/groups/create-group-dialog.tsx:74-78`

**Description:** Line 74 calls `const data = await response.json()` without `.catch()`. If `.json()` throws SyntaxError, the catch block (line 80) calls `getErrorMessage(error)`. However, if `.json()` succeeds but returns unexpected data (e.g., `{ data: {} }` from a `.catch()` fallback scenario in a future refactor), line 78 accesses `data.data.id` which would be `undefined`. The `router.push` would navigate to `/dashboard/groups/undefined`.

**Concrete failure scenario:** A CDN returns `200 OK` with HTML. `.json()` throws SyntaxError. The catch block shows "createError" toast. User is stuck on the dialog — the group was actually created but the client couldn't parse the response. No way to navigate to the new group.

**Fix:** Add `.catch(() => ({ data: {} }))` and guard `data.data?.id` before navigating, similar to how `contest-join-client.tsx` guards `assignmentId`.

---

### DBG-2: `admin-config.tsx:103` — Test connection response parsed without safety net [MEDIUM/MEDIUM]

**File:** `src/lib/plugins/chat-widget/admin-config.tsx:103`

**Description:** The `handleTestConnection` function calls `response.json()` without `.catch()` after `response.ok`. If the test-connection endpoint returns 200 with a non-JSON body, the SyntaxError is caught and `setTestResult({ success: false, error: tCommon("error") })` is set. This is misleading — the test may have actually succeeded, but the result shows failure.

**Fix:** Add `.catch()` to the `.json()` call.

---

### DBG-3: `providers.ts` — AI provider `.json()` without `.catch()` could crash tool-calling loops [MEDIUM/MEDIUM]

**Files:**
- `src/lib/plugins/chat-widget/providers.ts:138` (OpenAI chatWithTools)
- `src/lib/plugins/chat-widget/providers.ts:258` (Claude chatWithTools)
- `src/lib/plugins/chat-widget/providers.ts:398` (Gemini chatWithTools)

**Description:** All three `chatWithTools` implementations call `response.json()` without `.catch()` on the success path. If the API returns a 200 with HTML (e.g., Cloudflare challenge page), the SyntaxError propagates up and terminates the chat tool-calling loop. The user would see a generic error with no actionable feedback.

**Fix:** Wrap `.json()` in `.catch(() => ({}))` and handle the empty fallback.

---

### DBG-4: `comment-section.tsx:45` — GET `.json()` without `.catch()` causes unnecessary error toast spam [LOW/MEDIUM]

**File:** `src/app/(dashboard)/dashboard/submissions/[id]/_components/comment-section.tsx:45`

**Description:** The `fetchComments` function is called on mount and whenever `submissionId` changes. If a non-JSON response is returned, the SyntaxError triggers `toast.error(tComments("loadError"))`. This could result in repeated error toasts if the proxy intermittently returns HTML.

**Fix:** Add `.catch(() => ({ data: [] }))` to silently handle parse failures on the success path.

---

## Verified Safe (No Issue Found)

- `contest-join-client.tsx` properly guards against `undefined` `assignmentId` after JSON parse failure
- `bulk-create-dialog.tsx` properly uses `.catch()` on both error and success `.json()` calls
- `assignment-form-dialog.tsx` properly uses `.catch()` on `.json()` and guards `createdAssignmentId`
- `use-submission-polling.ts` properly uses `.catch()` on `.json()` and handles missing `payload.data`
- `problem-submission-form.tsx` properly uses `.catch()` on both run and submit paths
- Anti-cheat heartbeat uses recursive `setTimeout` (not `setInterval`) — fixed in previous cycle
- `SubmissionListAutoRefresh` has proper exponential backoff — fixed in previous cycle
