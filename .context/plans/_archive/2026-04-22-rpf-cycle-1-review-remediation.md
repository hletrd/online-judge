# RPF Cycle 1 Review Remediation Plan

**Date:** 2026-04-22
**Source:** `.context/reviews/_aggregate.md` (cycle 1)
**Status:** IN PROGRESS

## High Priority

### H1: Create shared clipboard utility and consolidate all clipboard copy sites [AGG-1]

**Severity:** MEDIUM/HIGH (7 agents flagged)
**Files to create:**
- `src/lib/clipboard.ts` — shared `copyToClipboard(text, options?)` utility

**Files to modify:**
- `src/components/code/copy-code-button.tsx` — use shared utility
- `src/app/(dashboard)/dashboard/admin/api-keys/api-keys-client.tsx` — use shared utility for both copy sites (lines 197, 210-240)
- `src/components/contest/access-code-manager.tsx` — use shared utility (line 60-67)
- `src/app/(dashboard)/dashboard/admin/workers/workers-client.tsx` — use shared utility (lines 157-165)
- `src/app/(dashboard)/dashboard/admin/files/file-management-client.tsx` — use shared utility (line 98)
- `src/components/contest/recruiting-invitations-panel.tsx` — use shared utility (lines 183, 208, 311)

**Implementation:**
1. Create `src/lib/clipboard.ts` with `copyToClipboard(text: string): Promise<boolean>` based on the `copy-code-button.tsx` pattern (navigator.clipboard -> execCommand fallback -> returns success/failure)
2. Replace all ad-hoc clipboard calls with the shared utility
3. Components handle success/failure feedback (toast) themselves since the utility just returns a boolean

**Tests:** Add unit tests for the shared clipboard utility covering success, fallback, and failure cases.

---

### H2: Fix contest layout blanket hard-navigation [AGG-2]

**Severity:** MEDIUM/HIGH (6 agents flagged)
**Files to modify:**
- `src/app/(dashboard)/dashboard/contests/layout.tsx`

**Implementation:**
1. Remove the blanket click handler that intercepts ALL `<a>` clicks
2. Add `data-full-navigate` attribute to links that genuinely need hard navigation
3. Only intercept clicks on elements with `data-full-navigate`
4. Alternatively, use `forceNavigate` from `@/lib/navigation/client.ts` directly in specific click handlers

**Tests:** Verify that regular links use soft navigation and only marked links trigger full reload.

---

## Medium Priority

### M1: Wrap `use-source-draft.ts` localStorage.removeItem calls in try/catch [AGG-3]

**Severity:** MEDIUM/MEDIUM
**Files to modify:**
- `src/hooks/use-source-draft.ts:188,205,409`

**Implementation:**
1. Wrap `window.localStorage.removeItem(storageKey)` at lines 188 and 205 in their own try/catch blocks inside `readDraftPayload`
2. Wrap `window.localStorage.removeItem(storageKey)` at line 409 in `clearAllDrafts`
3. Ensure the outer catch in `readDraftPayload` doesn't prematurely discard valid draft data

**Tests:** Verify that a failed `removeItem` doesn't prevent valid draft data from being returned.

---

### M2: Fix unhandled promise rejections in `recruiting-invitations-panel.tsx` [AGG-4]

**Severity:** MEDIUM/MEDIUM
**Files to modify:**
- `src/components/contest/recruiting-invitations-panel.tsx:208,311`

**Implementation:**
- This will be resolved as part of H1 (shared clipboard utility). If H1 is implemented, this becomes a subtask.
- If H1 is deferred, add `catch` blocks showing `toast.error(t("copyError"))` as a standalone fix.

---

## Low Priority

### L1: Remove remaining `defaultValue` inline fallbacks from `compiler-client.tsx` [AGG-5]

**Severity:** LOW/MEDIUM
**Files to modify:**
- `src/components/code/compiler-client.tsx` (16 remaining `defaultValue` usages)

**Implementation:**
1. Verify all 16 translation keys exist in the locale JSON files (en.json, ko.json)
2. Remove `defaultValue` from all `t()` calls
3. Run the app to confirm no missing key warnings

---

### L2: Use `formatScore` in `submission-detail-client.tsx` [AGG-6]

**Severity:** LOW/MEDIUM
**Files to modify:**
- `src/app/(dashboard)/dashboard/submissions/[id]/submission-detail-client.tsx:263`

**Implementation:**
1. Import `formatScore` from `@/lib/formatting`
2. Replace `Math.round(submission.score * 100) / 100` with `formatScore(submission.score, locale)`

---

### L3: Fix compiler keyboard shortcut to check active element focus [AGG-7]

**Severity:** LOW/MEDIUM
**Files to modify:**
- `src/components/code/compiler-client.tsx:303-312`

**Implementation:**
1. In the keydown handler, check if `document.activeElement` is a `textarea` or `input` element
2. Only trigger `handleRun` if focus is NOT in a textarea/input (or is in the code editor)

---

### L4: Replace raw `<button>` with `<Button>` in anti-cheat privacy notice [AGG-10]

**Severity:** LOW/LOW
**Files to modify:**
- `src/components/exam/anti-cheat-monitor.tsx:244-248`

**Implementation:**
1. Import `Button` from `@/components/ui/button`
2. Replace the raw `<button>` with `<Button variant="default" className="w-full">`

---

### L5: Update misleading test name in `access-code-manager.test.tsx` [AGG-11]

**Severity:** LOW/MEDIUM
**Files to modify:**
- `tests/component/access-code-manager.test.tsx:83`

**Implementation:**
- If H1 is implemented (shared clipboard utility with execCommand fallback), the test name becomes accurate
- Otherwise, update test name to: "shows an error toast when clipboard access fails"

---

## Carried Forward (Not Scheduled This Cycle)

### DEFER-AGG8: Practice page Path B progress filter SQL optimization [AGG-8]

**Severity:** MEDIUM/MEDIUM
**Reason for deferral:** Requires significant SQL query refactoring and careful testing with production data volumes. The current JavaScript-side filtering works correctly at current scale, just not efficiently.
**Exit criterion:** When practice page has >1000 problems or user submission count exceeds 10K for a single user, this must be implemented.

### DEFER-AGG9: SubmissionListAutoRefresh error-state backoff [AGG-9]

**Severity:** LOW/LOW
**Reason for deferral:** The component already checks `document.visibilityState === "visible"` before refreshing, and the polling interval is reasonable (5-10 seconds). Error-state backoff is a nice-to-have optimization.
**Exit criterion:** When server load monitoring shows auto-refresh polling contributes to overload events.

### Previously Deferred Items (Carried Forward)

- DEFER-1: Migrate raw route handlers to `createApiHandler` (22 routes)
- DEFER-2: SSE connection tracking eviction optimization
- DEFER-3: SSE connection cleanup test coverage
- D1: JWT authenticatedAt clock skew with DB tokenInvalidatedAt (MEDIUM)
- D2: JWT callback DB query on every request — add TTL cache (MEDIUM)
- A19: `new Date()` clock skew risk in remaining routes (LOW)

## Progress Log

| Item | Status | Commit |
|------|--------|--------|
| H1 | TODO | |
| H2 | TODO | |
| M1 | TODO | |
| M2 | TODO | (subsumed by H1) |
| L1 | TODO | |
| L2 | TODO | |
| L3 | TODO | |
| L4 | TODO | |
| L5 | TODO | (depends on H1) |
