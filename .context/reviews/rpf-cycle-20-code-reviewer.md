# RPF Cycle 20 — Code Reviewer

**Date:** 2026-04-22
**Base commit:** 4182e529

## Findings

### CR-1: `create-group-dialog.tsx:74` — Unguarded `.json()` on success path [MEDIUM/HIGH]

**File:** `src/app/(dashboard)/dashboard/groups/create-group-dialog.tsx:74`

**Description:** After checking `response.ok`, line 74 calls `const data = await response.json()` without `.catch()`. If the server returns a 200 with a non-JSON body (e.g., reverse proxy HTML), this throws an unhandled `SyntaxError`. The codebase's own `apiFetchJson` helper and JSDoc in `src/lib/api/client.ts:25-48` explicitly document this anti-pattern. Line 78 then accesses `data.data.id` which would crash on the fallback.

**Concrete failure scenario:** nginx returns `200 OK` with an HTML body. `.json()` throws `SyntaxError`. The outer `catch` shows a generic error toast, but `router.push` is never called, leaving the user stuck.

**Fix:** Add `.catch()` or migrate to `apiFetchJson`.

---

### CR-2: `admin-config.tsx:103` — Unguarded `.json()` on success path [MEDIUM/HIGH]

**File:** `src/lib/plugins/chat-widget/admin-config.tsx:103`

**Description:** After checking `response.ok`, line 103 calls `const data = await response.json()` without `.catch()`. Same anti-pattern as CR-1. This is the test-connection handler which hits external AI provider APIs — non-JSON responses are more likely here due to proxy/gateway intermediaries.

**Fix:** Add `.catch()` or migrate to `apiFetchJson`.

---

### CR-3: `providers.ts:138,258,398` — Unguarded `.json()` after `response.ok` check in provider chat handlers [MEDIUM/MEDIUM]

**File:** `src/lib/plugins/chat-widget/providers.ts:138,258,398`

**Description:** Three provider `chatWithTools` implementations (OpenAI, Claude, Gemini) call `response.json()` without `.catch()` after verifying `response.ok`. While these are server-side calls to known AI APIs, a CDN/proxy returning HTML error pages (e.g., Cloudflare 502) would cause unhandled SyntaxError crashes. The providers already read `response.text()` on error paths, but not on success paths.

**Fix:** Wrap `.json()` calls in `.catch(() => ({})` or add a try-catch for JSON parse failures.

---

### CR-4: `admin-config.tsx:294,305` — `Number(event.target.value)` NaN risk for maxTokens and rateLimitPerMinute [LOW/MEDIUM]

**File:** `src/lib/plugins/chat-widget/admin-config.tsx:294,305`

**Description:** Two `<Input type="number">` fields use `Number(e.target.value)` for `maxTokens` and `rateLimitPerMinute`. If the input is empty or contains non-numeric text, `Number("")` returns `0` and `Number("abc")` returns `NaN`. The `NaN` propagates into the config object and gets sent to the server. The `assignment-form-dialog.tsx` points field was fixed in a previous cycle to use `parseFloat(value) || 0`, but these two fields in admin-config still use `Number()`.

**Concrete failure scenario:** User clears the maxTokens field, the value becomes `0`, and the API call sends `maxTokens: 0` which may be rejected by the AI provider.

**Fix:** Use `parseInt(e.target.value, 10) || 100` (for maxTokens, fallback to 100) and `parseInt(e.target.value, 10) || 10` (for rateLimitPerMinute, fallback to 10).

---

### CR-5: `contest-replay.tsx:166` — `Number(event.target.value)` for slider index [LOW/LOW]

**File:** `src/components/contest/contest-replay.tsx:166`

**Description:** The range slider uses `Number(event.target.value)` for the `currentIndex`. While `<input type="range">` always returns numeric strings and this is functionally safe, it's inconsistent with the codebase pattern of `parseFloat` or `parseInt`.

**Fix:** Use `parseInt(event.target.value, 10)` for clarity and consistency.

---

### CR-6: `comment-section.tsx:45` — Unguarded `.json()` in GET path [MEDIUM/MEDIUM]

**File:** `src/app/(dashboard)/dashboard/submissions/[id]/_components/comment-section.tsx:45`

**Description:** The `fetchComments` callback calls `response.json()` after checking `response.ok` but without `.catch()`. If the server returns 200 with a non-JSON body, this throws `SyntaxError` and the error toast in the `catch` block fires. But the specific failure mode (JSON parse error vs network error) is lost.

**Fix:** Add `.catch(() => ({ data: [] }))` or use `apiFetchJson`.

---

### CR-7: `invite-participants.tsx:89` — Server error string shown directly in toast for `userNotFound` check [LOW/MEDIUM]

**File:** `src/components/contest/invite-participants.tsx:89`

**Description:** Line 89 does `toast.error(data.error === "userNotFound" ? t("userNotFound") : t("inviteFailed"))`. This correctly maps `userNotFound` to a localized label and falls back to `inviteFailed` for all other errors. However, if the server returns a different error key not in the whitelist (e.g., `databaseError`), the user sees the generic `inviteFailed` label, which is actually the correct safe behavior. This is a low-risk observation rather than a bug — the pattern is safe but could be made explicit with a `console.error` before the toast.

**Fix:** Add `console.error("Invite failed:", data.error)` before the toast for debuggability.

---

## Verified Safe (No Issue Found)

- All discussion form components correctly use `.json().catch(() => ({}))` pattern
- `bulk-create-dialog.tsx` correctly uses `.catch()` on both error and success `.json()` calls
- `contest-join-client.tsx` properly guards against undefined `assignmentId` after JSON parse failure
- `assignment-form-dialog.tsx` properly uses `parseFloat(event.target.value) || 0` for points field
- `forceNavigate` has proper JSDoc documentation
- No `as any`, `@ts-ignore`, or `@ts-expect-error` usage found in the codebase
