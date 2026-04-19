# Cycle 1 Review Remediation Plan (review-plan-fix loop)

**Date:** 2026-04-19  
**Source:** `.context/reviews/_aggregate.md` + preserved per-agent review files under `.context/reviews/`  
**Status:** IN PROGRESS

## Scope and revalidation rules
- This plan revalidates all preserved review artifacts against **current HEAD** before scheduling work.
- Findings that are already fixed on current HEAD or that directly contradict repo policy are recorded explicitly below and are **not** rescheduled.
- Actionable work for this cycle is limited to issues confirmed by current code review and/or the mandatory `algo.xylolabs.com` browser audit.

## Archived prior plan
- Archived fully implemented prior plan: `plans/archive/2026-04-19-cycle-1-review-remediation-pre-loop.md`

## Implementation stories for this cycle

### UX-01: Restore semantic page headings on public/auth entry routes
**Severity:** HIGH | **Confidence:** HIGH | **Effort:** Quick win

**Files:**
- `src/app/(auth)/login/page.tsx`
- `src/app/(auth)/signup/page.tsx`
- `src/app/(public)/community/page.tsx`
- `src/components/discussions/discussion-thread-list.tsx`
- Related tests under `tests/component/`

**Problem:** The browser audit on `algo.xylolabs.com` showed no semantic heading on `/login` and `/signup`, and only an `h2` on `/community`. Current source confirms the auth pages render `CardTitle`/`CardDescription` as plain `<div>` nodes and the community page delegates its visible title to a component that always renders `<h2>`.

**Fix:**
1. Render explicit `h1` headings on login and signup pages.
2. Let the community route expose a page-level `h1` without duplicating the visible title.
3. Add component tests that assert heading roles/levels.

**Verification:** `npm run test:component`, `npm run test:e2e`

---

### UX-02: Localize public-header accessibility labels
**Severity:** MEDIUM | **Confidence:** HIGH | **Effort:** Quick win

**Files:**
- `src/components/layout/public-header.tsx`
- `messages/en.json`
- `messages/ko.json`
- Related tests under `tests/component/` or `tests/unit/`

**Problem:** `public-header.tsx` still hard-codes English ARIA labels such as `Main navigation`, `Toggle navigation menu`, `Mobile navigation`, and `Mobile menu`. This creates an accessibility i18n gap in Korean locale.

**Fix:** Move the ARIA labels into translations and update tests to cover the localized labels.

**Verification:** `npm run test:component`, `npm run test:e2e`

---

### UI-01: Bring `FilterSelect` into compliance with the Base UI `SelectValue` contract
**Severity:** MEDIUM | **Confidence:** HIGH | **Effort:** Quick win

**Files:**
- `src/components/filter-select.tsx`
- Related tests under `tests/component/`
- Repo rule: `AGENTS.md` select/dropdown contract

**Problem:** The shared filter select uses a nested `<span>` and inline label lookup inside `<SelectValue>`, which violates the repo rule requiring a simple state-based child expression.

**Fix:** Precompute the selected label from state and pass a simple text child to `SelectValue`. Add a regression test that verifies the selected label, not the raw value, is rendered.

**Verification:** `npm run test:component`, `npx tsc --noEmit`

---

## Deferred / investigation-required items

### DEF-01: Investigate production-only failures on `/practice` and `/rankings`
- **Original finding:** `.context/reviews/_aggregate.md` → `MEDIUM-3`
- **File/route citations:**
  - `https://algo.xylolabs.com/practice`
  - `https://algo.xylolabs.com/rankings`
  - Related repo files: `src/app/(public)/practice/page.tsx`, `src/app/(public)/rankings/page.tsx`
- **Original severity / confidence:** Medium / Medium
- **Reason for deferral:** The browser audit confirms live failures, but current-head static review has not yet isolated a repo-side root cause. This may be deployment drift, production schema drift, or state/data specific to the deployed environment.
- **Exit criterion:** Reproduce the failure against current HEAD with production-like data/config or prove a specific code-level fault from logs/stack traces.

## Revalidated non-actions from preserved review files

These findings were reviewed and explicitly closed for this cycle so they are not silently dropped.

### CLOSED-01: Password-complexity escalation requests are invalid under repo policy
- **Original citations:** `.context/reviews/code-reviewer.md Finding 1`, `.context/reviews/security-reviewer.md Finding S1`, `.context/reviews/critic.md Finding C1`, `.context/reviews/verifier.md Finding V1`, `.context/reviews/test-engineer.md Finding T1`
- **Original severity / confidence:** High / High (or Confirmed)
- **Closure reason:** Repo policy explicitly forbids adding complexity requirements and requires exactly an 8-character minimum length rule only. See:
  - `AGENTS.md` → `Password validation MUST only check minimum length — exactly 8 characters minimum, no other rules.`
  - `.context/plans/README.md` → `Password policy remains minimum-length-only by project rule; plans must not add complexity requirements without explicit approval.`
- **Current-head check:** `src/lib/security/password.ts` already implements the repo-approved checks (minimum length, common-password blocklist, username/email matching) and `tests/unit/security/password.test.ts` covers them.

### CLOSED-02: JSON-LD script-escaping finding is already fixed on current HEAD
- **Original citations:** `.context/reviews/security-reviewer.md Finding S5`, `.context/reviews/critic.md Finding C6`, `.context/reviews/verifier.md Finding V5`
- **Original severity / confidence:** Low / High-Medium
- **Closure reason:** `src/components/seo/json-ld.tsx` already uses `safeJsonForScript()` to escape `</script` sequences before injecting JSON-LD.

### CLOSED-03: Shell-command prefix-bypass finding is already fixed on current HEAD
- **Original citations:** `.context/reviews/security-reviewer.md Finding S6`, `.context/reviews/verifier.md Finding V3`, `.context/reviews/test-engineer.md Finding T5`
- **Original severity / confidence:** Medium / Medium-High
- **Closure reason:** `src/lib/compiler/execute.ts` now routes command-prefix validation through `isValidCommandPrefix()`, which only permits exact matches or version-style suffixes.

### CLOSED-04: Deprecated rate-limit constant finding is stale
- **Original citations:** `.context/reviews/code-reviewer.md Finding 2`, `.context/reviews/verifier.md Finding V4`
- **Original severity / confidence:** Medium / High
- **Closure reason:** Current files `src/lib/security/api-rate-limit.ts` and `src/lib/security/rate-limit.ts` no longer expose the deprecated module-level constants described by the preserved review files.

## Progress ledger

| Story | Status | Notes |
|---|---|---|
| UX-01 | Done | Added semantic `h1` coverage for login, signup, and community surfaces plus component tests |
| UX-02 | Done | Localized public-header ARIA labels and aligned remote-smoke E2E expectations |
| UI-01 | Done | Simplified `FilterSelect` selected-label rendering to the repo-approved `SelectValue` contract and added regression coverage |
| DEF-01 | Deferred | Needs reproduction against current-head runtime/data |
| CLOSED-01 | Closed | Policy conflict + current-head revalidation |
| CLOSED-02 | Closed | Already fixed on current HEAD |
| CLOSED-03 | Closed | Already fixed on current HEAD |
| CLOSED-04 | Closed | Preserved review artifact is stale |

## Gate notes

- Full gate set completed this cycle: `npm run lint`, `npx tsc --noEmit`, `npm run build`, `npm run test:unit`, `npm run test:integration`, `npm run test:component`, `npm run test:e2e`, `(cd judge-worker-rs && cargo test)`.
- `npm run lint` still reports **13 warnings** from unrelated untracked local scratch scripts (`add-stress-tests.mjs`, `auto-solver.mjs`, `gen_test_cases.mjs`, `playwright.visual.config.ts`, `solve-fixes.mjs`, `stress-tests.mjs`). These are warning-level only, outside the repo-managed remediation scope for this cycle, and left unchanged to avoid mixing unrelated personal scratch-file cleanup into the review-remediation commit set.
