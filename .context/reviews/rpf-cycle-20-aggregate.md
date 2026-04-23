# RPF Cycle 20 — Aggregate Review

**Date:** 2026-04-22
**Base commit:** 4182e529
**Review artifacts:** rpf-cycle-20-code-reviewer.md, rpf-cycle-20-security-reviewer.md, rpf-cycle-20-perf-reviewer.md, rpf-cycle-20-debugger.md, rpf-cycle-20-critic.md, rpf-cycle-20-verifier.md, rpf-cycle-20-test-engineer.md, rpf-cycle-20-tracer.md, rpf-cycle-20-architect.md, rpf-cycle-20-designer.md, rpf-cycle-20-document-specialist.md

## Previous Findings Resolution

| Previous ID | Finding | Resolution |
|-------------|---------|------------|
| AGG-1 (cycle 19) | Unguarded `.json()` on 5+ success paths | FIXED — `.catch()` added to all 5 locations |
| AGG-2 (cycle 19) | Raw server error messages via toast | FIXED — console.error + localized labels |
| AGG-3 (cycle 19) | contest-join navigates to `/dashboard/contests/undefined` | FIXED — guard added for missing assignmentId |
| AGG-4 (cycle 19) | forceNavigate lacks JSDoc | FIXED — JSDoc added |
| L2 (cycle 19) | `Number()` NaN risk in assignment-form-dialog points field | FIXED — uses `parseFloat() \|\| 0` |

## New Deduped Findings (sorted by severity then signal)

### AGG-1: `create-group-dialog.tsx:74` — Unguarded `.json()` on success path + undefined navigation crash chain [MEDIUM/HIGH]

**Flagged by:** code-reviewer (CR-1), security-reviewer (SEC-1), debugger (DBG-1), verifier (V-1), tracer (TR-1), critic (CRI-1), designer (DES-1), document-specialist (DOC-2)
**Signal strength:** 8 of 11 review perspectives

**File:** `src/app/(dashboard)/dashboard/groups/create-group-dialog.tsx:74`

**Description:** After checking `response.ok`, line 74 calls `const data = await response.json()` without `.catch()`. If the server returns a 200 with a non-JSON body (e.g., reverse proxy HTML), this throws an unhandled `SyntaxError`. Line 78 then accesses `data.data.id` which would crash on the fallback. The `getErrorMessage` function has a `SyntaxError` guard (line 44-46), but this is fragile — it masks the underlying `.json()` anti-pattern.

**Concrete failure scenario:** nginx returns `200 OK` with an HTML body. `.json()` throws `SyntaxError`. The catch shows "createError" toast. The group was actually created on the server but the user cannot navigate to it. The user may try creating it again, resulting in a duplicate.

**Fix:** Add `.catch(() => ({ data: {} }))` to line 74, and guard `data.data?.id` before navigation on line 78.

---

### AGG-2: `admin-config.tsx:103` — Unguarded `.json()` on test-connection success path [MEDIUM/MEDIUM]

**Flagged by:** code-reviewer (CR-2), security-reviewer (SEC-2), debugger (DBG-2), verifier (V-2), perf-reviewer (PERF-3), critic (CRI-1)
**Signal strength:** 6 of 11 review perspectives

**File:** `src/lib/plugins/chat-widget/admin-config.tsx:103`

**Description:** The `handleTestConnection` function calls `response.json()` without `.catch()` after checking `response.ok`. If the test-connection endpoint returns 200 with a non-JSON body, SyntaxError is caught and a misleading "error" test result is shown. The test may have actually succeeded.

**Fix:** Add `.catch()` or use `apiFetchJson`.

---

### AGG-3: `providers.ts:138,258,398` — AI provider `.json()` unguarded on success paths in all three providers [MEDIUM/MEDIUM]

**Flagged by:** code-reviewer (CR-3), security-reviewer (SEC-3), debugger (DBG-3), verifier (V-4), critic (CRI-1)
**Signal strength:** 5 of 11 review perspectives

**Files:**
- `src/lib/plugins/chat-widget/providers.ts:138` (OpenAI chatWithTools)
- `src/lib/plugins/chat-widget/providers.ts:258` (Claude chatWithTools)
- `src/lib/plugins/chat-widget/providers.ts:398` (Gemini chatWithTools)

**Description:** All three AI provider `chatWithTools` implementations call `response.json()` without `.catch()` after checking `response.ok`. CDN/WAF intermediaries (Cloudflare, etc.) can inject HTML error pages on 200 responses, causing SyntaxError that terminates the chat tool-calling loop.

**Fix:** Wrap `.json()` calls in `.catch(() => ({}))` and handle the empty fallback.

---

### AGG-4: `comment-section.tsx:45` — Unguarded `.json()` on GET success path [MEDIUM/MEDIUM]

**Flagged by:** code-reviewer (CR-6), security-reviewer (SEC-4), debugger (DBG-4), verifier (V-3), perf-reviewer (PERF-1), architect (ARCH-2)
**Signal strength:** 6 of 11 review perspectives

**File:** `src/app/(dashboard)/dashboard/submissions/[id]/_components/comment-section.tsx:45`

**Description:** The `fetchComments` callback calls `response.json()` after checking `response.ok` without `.catch()`. A non-JSON 200 response causes SyntaxError and an unnecessary "loadError" toast. Since `fetchComments` is called on mount and whenever `submissionId` changes, this could result in repeated error toasts.

**Fix:** Add `.catch(() => ({ data: [] }))` or use `apiFetchJson`.

---

### AGG-5: `admin-config.tsx:294,305` — `Number(event.target.value)` NaN risk for maxTokens and rateLimitPerMinute [LOW/MEDIUM]

**Flagged by:** code-reviewer (CR-4), verifier (V-5), critic (CRI-2), architect (ARCH-3)
**Signal strength:** 4 of 11 review perspectives

**File:** `src/lib/plugins/chat-widget/admin-config.tsx:294,305`

**Description:** Two `<Input type="number">` fields use `Number(e.target.value)`. If the input is empty, `Number("")` returns `0` — sending `maxTokens: 0` or `rateLimitPerMinute: 0` which are likely invalid. If the input contains non-numeric text, `NaN` propagates to the config object.

**Fix:** Use `parseInt(e.target.value, 10) || 100` (for maxTokens, fallback to default 100) and `parseInt(e.target.value, 10) || 10` (for rateLimitPerMinute, fallback to default 10).

---

### AGG-6: `assignment-form-dialog.tsx:454` — `Number(event.target.value)` for exam duration [LOW/MEDIUM]

**Flagged by:** critic (CRI-2), architect (ARCH-3)
**Signal strength:** 2 of 11 review perspectives

**File:** `src/app/(dashboard)/dashboard/groups/[id]/assignment-form-dialog.tsx:454`

**Description:** The exam duration field uses `Number(e.target.value)` while the points field (line 651) was fixed to use `parseFloat() || 0`. This inconsistency means the exam duration field can produce `NaN` or `0` from empty/invalid input.

**Fix:** Use `parseInt(e.target.value, 10) || null` (matches the `null` type for `examDurationMinutes`).

---

### AGG-7: `apiFetchJson` JSDoc does not explicitly mention success-path `.catch()` protection [LOW/MEDIUM]

**Flagged by:** document-specialist (DOC-1), critic (CRI-1)
**Signal strength:** 2 of 11 review perspectives

**File:** `src/lib/api/client.ts:87-123`

**Description:** The `apiFetchJson` JSDoc explains the footguns it prevents but does not explicitly state that it applies `.catch()` to both success and error response parsing. This may lead developers to assume `apiFetchJson` only handles error paths.

**Fix:** Update JSDoc to explicitly state: "Both success and error response JSON parsing is wrapped in `.catch()`, ensuring non-JSON bodies never throw SyntaxError regardless of the HTTP status code."

---

### AGG-8: Test connection result not announced to screen readers [LOW/LOW]

**Flagged by:** designer (DES-2)
**Signal strength:** 1 of 11 review perspectives

**File:** `src/lib/plugins/chat-widget/admin-config.tsx:240-243`

**Description:** The test connection result is displayed as a `<span>` with no `role` or `aria-live` attribute. Screen readers would not announce the result.

**Fix:** Add `role="status"` and `aria-live="polite"`.

---

## Test Coverage Gaps (from test-engineer)

### TE-1: No component tests for `create-group-dialog.tsx` [MEDIUM/MEDIUM]
### TE-2: No component tests for `admin-config.tsx` test-connection flow [LOW/MEDIUM]
### TE-3: No component tests for `comment-section.tsx` GET fetch path [LOW/MEDIUM]
### TE-4: No unit tests for AI provider `chatWithTools` error handling [LOW/MEDIUM]

## Architectural Concern (from architect)

### ARCH-1: Recurring `.json()` anti-pattern suggests `apiFetchJson` adoption is insufficient — consider ESLint rule or API deprecation [MEDIUM/HIGH]

This is not a code fix but a process/tooling improvement. Despite 3+ cycles fixing `.json()` anti-patterns, new instances appear because the convention is not enforced at the tooling level.

---

## Previously Deferred Items (Carried Forward)

- DEFER-1: Migrate raw route handlers to `createApiHandler` (22 routes)
- DEFER-2: SSE connection tracking eviction optimization
- DEFER-3: SSE connection cleanup test coverage
- D1: JWT authenticatedAt clock skew with DB tokenInvalidatedAt (MEDIUM)
- D2: JWT callback DB query on every request — add TTL cache (MEDIUM)
- A19: `new Date()` clock skew risk in remaining routes (LOW)
- DEFER-20: Contest clarifications show raw userId instead of username
- DEFER-21: Duplicated visibility-aware polling pattern (partially addressed)
- DEFER-22: copyToClipboard dynamic import inconsistency
- DEFER-23: Practice page Path B progress filter
- DEFER-24: Invitation URL uses window.location.origin
- DEFER-25: Duplicate formatTimestamp utility
- DEFER-26: Unit tests for create-group-dialog.tsx and bulk-create-dialog.tsx
- DEFER-27: Unit tests for comment-section.tsx
- DEFER-28: Unit tests for participant-anti-cheat-timeline.tsx polling behavior
- DEFER-29: Add dedicated candidates summary endpoint for recruiter-candidates-panel
- DEFER-30: Remove unnecessary `router.refresh()` from discussion-vote-buttons
- ARCH-1: Centralized error-to-i18n mapping utility (refactor suggestion)
- DEFER-50: Encryption module unit tests
- DEFER-51: Unit tests for create-problem-form.tsx
- DEFER-52: Unit tests for problem-export-button.tsx
- DEFER-53: `contest-join-client.tsx` 1-second setTimeout delay
- DEFER-54: Anti-cheat dashboard polling full shallow comparison for multi-page data
- DEFER-55: `recruiting-invitations-panel.tsx` Promise.all vs Promise.allSettled
- DEFER-56: Unit tests for apiFetchJson helper
- DEFER-57: Unit tests for recruiting-invitations-panel.tsx

## Agent Failures

None. All 11 review perspectives completed successfully.
