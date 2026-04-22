# Verifier Review — RPF Cycle 7

**Date:** 2026-04-22
**Reviewer:** verifier
**Base commit:** b3147a98

## Findings

### V-1: Verified: Cycle 3/5 fixes (AGG-1 through AGG-5) are correctly implemented [N/A]

**Verification:**
- AGG-1 (systematic response.json() before response.ok): CONFIRMED fixed in problem-submission-form.tsx (lines 183-188, 246-252 both check response.ok first), discussion-vote-buttons.tsx (lines 42-47), discussion-post-form.tsx (lines 43-47), discussion-thread-form.tsx (lines 49-53), discussion-thread-moderation-controls.tsx (lines 45-47, 64-66), edit-group-dialog.tsx (lines 87-92), assignment-form-dialog.tsx (lines 271-276), group-members-manager.tsx (lines 123-128, 180-185)
- AGG-2 (discussion-vote-buttons silent failure): CONFIRMED fixed — now shows toast.error on !response.ok (line 44) and has try/catch (lines 36, 56-58)
- AGG-3 (anti-cheat timeline polling): CONFIRMED — component uses useVisibilityPolling (commit ba3dcf0d)
- AGG-4 (contest-replay native select): CONFIRMED — replaced with project Select component (commit fa826df7)
- AGG-5 (apiFetch JSDoc): CONFIRMED — anti-pattern example added (commit 13c84706)

---

### V-2: `create-group-dialog.tsx` still parses JSON before `response.ok` — verified [MEDIUM/HIGH]

**File:** `src/app/(dashboard)/dashboard/groups/create-group-dialog.tsx:64-68`

**Description:** Evidence-based verification: line 64 `const data = await response.json()` is called unconditionally. Line 66 `if (!response.ok)` is checked AFTER the JSON parse. This is the same class of bug verified as fixed in other files, but NOT fixed in this file.

**Confidence:** HIGH

---

### V-3: `bulk-create-dialog.tsx` still parses JSON before `response.ok` — verified [MEDIUM/MEDIUM]

**File:** `src/app/(dashboard)/dashboard/admin/users/bulk-create-dialog.tsx:212-214`

**Description:** Verified by reading the code: line 212 `const data = await response.json()` is called unconditionally. Line 214 `if (!response.ok)` is checked after the parse.

**Confidence:** HIGH

---

### V-4: `database-backup-restore.tsx` restore handler parses JSON before `response.ok` — verified [MEDIUM/MEDIUM]

**File:** `src/app/(dashboard)/dashboard/admin/settings/database-backup-restore.tsx:144-146`

**Description:** Verified: line 144 `const data = await response.json()` before line 146 `if (!response.ok)`. The backup handler on line 44 correctly uses `.json().catch(() => ({}))`, but the restore handler does not. Inconsistent within the same file.

**Confidence:** HIGH

---

## Final Sweep

All previously identified and claimed-fixed items from cycles 1-5 were verified as correctly implemented. The remaining issues are in files that were not part of prior fix cycles: `create-group-dialog.tsx`, `bulk-create-dialog.tsx`, and the restore path of `database-backup-restore.tsx`.
