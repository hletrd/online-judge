# Aggregate Review — Cycle 11

**Date:** 2026-04-28
**Reviewers:** code-reviewer (1 lane — focused verification + new findings)
**Total findings:** 2 MEDIUM, 8 LOW (deduplicated, new findings only)

---

## Cycle 1-10 Fix Verification Summary

All 50+ tasks from cycles 1-10 were re-verified. No regressions found. Key verifications this cycle:

- C10-AGG-1 through C10-AGG-8: All fixes confirmed applied and correct
- C9-AGG-1 through C9-AGG-6: All dark mode fixes confirmed intact
- C8 Tasks A-E: All locale/formatting and dark mode fixes confirmed intact
- Contest status label shared utility still in place, ContestStatusKey eliminated
- Badge dark mode variants from cycles 7-8 all present
- Leaderboard trophy rank 1 has `text-yellow-500 dark:text-yellow-400` (C10 fix)

---

## Deduplicated Findings (sorted by severity)

### C11-AGG-1: [MEDIUM] Leaderboard rank 2 and 3 trophy icons missing dark mode variants

**Sources:** C11-CR-1 | **Confidence:** HIGH

`src/components/contest/leaderboard-table.tsx:85-86` — Rank 1 trophy was fixed in C10, but rank 2 uses `text-slate-400` and rank 3 uses `text-amber-600` without dark mode variants. In dark mode, slate-400 may be too bright against dark backgrounds, and amber-600 is inconsistent with rank 1's treatment.

**Fix:** Change `text-slate-400` to `text-slate-400 dark:text-slate-300`; change `text-amber-600` to `text-amber-600 dark:text-amber-400`.

---

### C11-AGG-2: [MEDIUM] Contest join CheckCircle2 icon missing dark mode variant

**Sources:** C11-CR-2 | **Confidence:** HIGH

`src/app/(public)/contests/join/contest-join-client.tsx:91` — `<CheckCircle2 className="h-14 w-14 text-green-500 animate-pulse" />` — the large 56x56px success icon without dark mode. The adjacent text was fixed in C10-AGG-8 but the icon was missed.

**Fix:** Change to `text-green-500 dark:text-green-400`.

---

### C11-AGG-3: [LOW] API keys page and copy-code-button check icons missing dark mode variants

**Sources:** C11-CR-3, C11-CR-4 | **Confidence:** MEDIUM

- `src/app/(dashboard)/dashboard/admin/api-keys/api-keys-client.tsx:483` — `<Check className="h-3.5 w-3.5 text-green-500" />`
- `src/components/code/copy-code-button.tsx:39` — `<Check className="h-3.5 w-3.5 text-green-500" />`

Same pattern: small green checkmark indicating "copied" state.

**Fix:** Change both to `text-green-500 dark:text-green-400`.

---

### C11-AGG-4: [LOW] Status board override icons missing dark mode variants

**Sources:** C11-CR-5 | **Confidence:** MEDIUM

`src/app/(dashboard)/dashboard/groups/[id]/assignments/[assignmentId]/status-board.tsx:219,464` — `<PenLine className="size-3 shrink-0 text-amber-500" />` override indicator without dark mode.

**Fix:** Change both to `text-amber-500 dark:text-amber-400`.

---

### C11-AGG-5: [LOW] Compiler client status labels and output missing dark mode variants

**Sources:** C11-CR-6 | **Confidence:** MEDIUM

`src/components/code/compiler-client.tsx:524,529,566,577`:
- Line 524: `text-yellow-600` (timed out label)
- Line 529: `text-red-600` (compile error label)
- Lines 566, 577: `text-red-600` on stderr/compile output blocks

**Fix:** Add `dark:text-yellow-400` for line 524, `dark:text-red-400` for lines 529, 566, 577.

---

### C11-AGG-6: [LOW] Problems page stat icons and labels missing dark mode variants

**Sources:** C11-CR-7 | **Confidence:** MEDIUM

`src/app/(dashboard)/dashboard/problems/page.tsx:436,456,493,500`:
- Lines 436, 493: `text-emerald-600` — missing dark mode
- Lines 456, 500: `text-amber-600` — missing dark mode

Parent containers have dark mode backgrounds but text/icons lack variants.

**Fix:** Add `dark:text-emerald-400` and `dark:text-amber-400` respectively.

---

### C11-AGG-7: [LOW] Create problem form and assignment form locked notice missing dark mode variants

**Sources:** C11-CR-8 | **Confidence:** LOW

- `src/app/(dashboard)/dashboard/problems/create/create-problem-form.tsx:802` — `text-amber-600`
- `src/app/(dashboard)/dashboard/groups/[id]/assignment-form-dialog.tsx:565` — `text-amber-600`

**Fix:** Change both to `text-amber-600 dark:text-amber-400`.

---

### C11-AGG-8: [LOW] Chat widget admin config success text missing dark mode variant

**Sources:** C11-CR-9 | **Confidence:** LOW

`src/lib/plugins/chat-widget/admin-config.tsx:179` — `text-green-600` without dark mode. Line 242 also uses `text-green-600` in a conditional.

**Fix:** Change to `text-green-600 dark:text-green-400` on both lines.

---

### C11-AGG-9: [LOW] Change password alert box border/background missing dark mode variants

**Sources:** C11-CR-10 | **Confidence:** LOW

`src/app/change-password/change-password-form.tsx:86` — `border-amber-500/40 bg-amber-500/10` without dark mode. Inner text already has `dark:text-amber-200`.

**Fix:** Add `dark:border-amber-400/30 dark:bg-amber-500/5`.

---

## Carried Deferred Items (unchanged from cycle 10)

- DEFER-22: `.json()` before `response.ok` — 60+ instances
- DEFER-23: Raw API error strings without translation — partially fixed
- DEFER-24: `migrate/import` unsafe casts — partially addressed by C2-AGG-4
- DEFER-27: Missing AbortController on polling fetches
- DEFER-28: `as { error?: string }` pattern — 22+ instances
- DEFER-29: Admin routes bypass `createApiHandler`
- DEFER-30: Recruiting validate token brute-force
- DEFER-32: Admin settings exposes DB host/port
- DEFER-33: Missing error boundaries
- DEFER-34: Hardcoded English fallback strings
- DEFER-35: Hardcoded English strings in editor title attributes
- DEFER-36: `formData.get()` cast assertions
- DEFER-43: Docker client leaks `err.message` in build responses
- DEFER-44: No documentation for timer pattern convention
- C2-AGG-9/C3-AGG-5/C4-AGG-4: `getDbNow` called redundantly — LOW, deferred
- C2-AGG-10: CountdownTimer namespace mismatch — LOW, deferred

---

## No Agent Failures

The review lane completed successfully.

---

## Gate Status

- **eslint:** To be verified
- **tsc --noEmit:** To be verified
- **next build:** To be verified

---

## Plannable Tasks for This Cycle

1. **C11-AGG-1** (MEDIUM) — Add dark mode variants to leaderboard rank 2 and 3 trophy icons
2. **C11-AGG-2** (MEDIUM) — Add dark mode variant to contest join CheckCircle2 icon
3. **C11-AGG-3** (LOW) — Add dark mode variants to API keys and copy-code-button check icons
4. **C11-AGG-4** (LOW) — Add dark mode variants to status board override icons
5. **C11-AGG-5** (LOW) — Add dark mode variants to compiler client status labels
6. **C11-AGG-6** (LOW) — Add dark mode variants to problems page stat icons and labels
7. **C11-AGG-7** (LOW) — Add dark mode variants to create-problem and assignment-form locked notices
8. **C11-AGG-8** (LOW) — Add dark mode variants to chat widget admin config success text
9. **C11-AGG-9** (LOW) — Add dark mode variants to change password alert box border/background
