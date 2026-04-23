# Critic Review — RPF Cycle 26

**Date:** 2026-04-22
**Reviewer:** critic
**Base commit:** f55836d0

## CRI-1: Three files still have double `.json()` anti-pattern — migration incomplete [MEDIUM/HIGH]

**Files:**
- `src/app/(dashboard)/dashboard/groups/[id]/assignment-form-dialog.tsx:273,277`
- `src/app/(dashboard)/dashboard/groups/create-group-dialog.tsx:67,71`
- `src/app/(dashboard)/dashboard/problems/create/create-problem-form.tsx:335,339`

Previous cycles (23-25) fixed the double `.json()` anti-pattern in multiple files (`compiler-client.tsx`, `discussion-post-form.tsx`, `group-members-manager.tsx`, `problem-submission-form.tsx`). However, three files were missed because the review focused on the `error.message` leaking issue rather than the structural pattern. The `apiFetchJson` JSDoc explicitly documents this as an anti-pattern, yet it persists in these files.

**Why this matters:** The "parse once, branch on ok" convention exists because it eliminates an entire class of bugs. Every file that uses the error-first pattern is a regression risk.

**Fix:** Migrate all three files to `apiFetchJson` or the "parse once, then branch" pattern.

---

## CRI-2: `compiler-client.tsx` catch block inconsistent with AGG-1 fix from cycle 25 [LOW/MEDIUM]

**File:** `src/components/code/compiler-client.tsx:292-296`

The cycle-25 fix (AGG-1) changed all `getErrorMessage` default cases to return `tCommon("error")` instead of `error.message`. However, the `handleRun` catch block still uses `err instanceof Error ? err.message : "Network error"` for the inline error display. While the toast correctly uses `t("networkError")`, the inline display still shows raw error messages. This is a partial fix — the spirit of AGG-1 was to never show raw error messages to users.

**Fix:** Use `t("networkError")` for the inline error display and log the raw error to console.

---

## CRI-3: `contest-quick-stats.tsx` still has redundant `!` non-null assertions [LOW/LOW]

**File:** `src/components/contest/contest-quick-stats.tsx:65-68`

The cycle-25 fix (AGG-3) replaced `Number.isFinite(Number(x))` with `typeof x === "number" && Number.isFinite(x)`, but left `data.data!.participantCount` with the `!` non-null assertion. The `typeof` guard already ensures the value exists, so the `!` is redundant.

**Fix:** Remove the `!` assertions where the `typeof` guard already ensures safety.
