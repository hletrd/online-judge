# RPF Cycle 28 — Aggregate Review (Fresh)

**Date:** 2026-04-23
**Base commit:** 63557cc2
**Review artifacts:** code-reviewer.md, perf-reviewer.md, security-reviewer.md, architect.md, critic.md, verifier.md, debugger.md, test-engineer.md, tracer.md, designer.md, document-specialist.md

## Previously Fixed Items (Verified in Current Code)

All prior cycle aggregate findings have been addressed:
- AGG-1 (double `.json()` anti-pattern in 3 files): Fixed
- AGG-2 (compiler-client raw error in inline display): Fixed
- AGG-3 (handleResetAccountPassword missing fetchAll): Fixed
- AGG-4 (quick-stats redundant `!` assertions): Fixed
- AGG-5 (contest-replay setInterval): Deferred (LOW/LOW)
- AGG-6 (sidebar interval re-entry): Deferred (LOW/LOW)
- AGG-7 (console.error gating in 14 components): Fixed
- AGG-8 (admin-config double .json()): Fixed
- AGG-9 (bulk-create raw err.message): Fixed
- localStorage try/catch in compiler-client and submission-detail-client: Fixed
- normalizePage parseInt + upper bound: Fixed
- comment-section GET error feedback: Fixed
- discussion-thread-moderation-controls optimistic state: Fixed

## Deduped Findings (sorted by severity then signal)

### AGG-1: `code-editor.tsx` hardcoded English strings in aria-label, title, and visible text — i18n violation [MEDIUM/MEDIUM]

**Flagged by:** code-reviewer (CR-1), architect (ARCH-1), critic (CRI-1), designer (DES-1), verifier (V-1), tracer (TR-1), document-specialist (DOC-2)
**Signal strength:** 7 of 10 review perspectives

**Files:**
- `src/components/code/code-editor.tsx:96-97` — `title="Fullscreen (F) · Exit (Esc)"`, `aria-label="Fullscreen (F)"`
- `src/components/code/code-editor.tsx:107` — `{props.language ?? "Code Editor"}`
- `src/components/code/code-editor.tsx:113-114` — `title="Exit fullscreen (Esc)"`, `aria-label="Exit fullscreen (Esc)"`
- `src/components/code/code-editor.tsx:117` — `<span>Exit</span>`

**Description:** The code editor is the only component in the codebase with hardcoded English strings in user-facing positions. Five strings are affected: two `aria-label` attributes, two `title` attributes, one visible button text ("Exit"), and one fallback text ("Code Editor"). All other components use i18n keys. Korean screen reader users will hear English labels for these buttons.

**Concrete failure scenario:** A Korean screen reader user navigates to the code editor fullscreen button and hears "Fullscreen (F)" instead of "전체 화면 (F)".

**Fix:** Add i18n keys for these strings. The keyboard shortcut names (F, Esc) are universal and can remain in the localized string. Either use `useTranslations` inside the component or pass label props (consistent with `ContestReplay`'s approach).

---

## Performance Findings (carried/deferred)

### PERF-CARRIED-1: contest-replay setInterval — LOW/LOW, deferred from cycle 26 AGG-5
### PERF-CARRIED-2: sidebar interval re-entry — LOW/LOW, deferred from cycle 26 AGG-6

## Security Findings (carried)

### SEC-CARRIED-1: `window.location.origin` for URL construction — covered by DEFER-24
### SEC-CARRIED-2: Encryption plaintext fallback — MEDIUM/MEDIUM, carried from DEFER-39
### SEC-CARRIED-3: `AUTH_CACHE_TTL_MS` has no upper bound — LOW/MEDIUM, carried from DEFER-40
### SEC-CARRIED-4: Anti-cheat localStorage persistence — LOW/LOW, carried from DEFER-48
### SEC-CARRIED-5: `sanitizeHtml` root-relative img src — LOW/LOW, carried from DEFER-49

## Previously Deferred Items (Carried Forward)

All previously deferred items from prior cycle plans remain in effect:
- DEFER-1 through DEFER-13 (from cycle 23)
- DEFER-14 (centralized error handling / useApiFetch hook, from cycle 24)
- DEFER-15 (window.confirm replacement, from cycle 25)
- DEFER-16 (ContestAnnouncements polling, from cycle 25)
- DEFER-17 (Inconsistent createApiHandler, from cycle 27)
- DEFER-18 (Contest layout forced navigation, from cycle 27)
- DEFER-19 (use-source-draft JSON.parse validation, from cycle 27)
- DEFER-20 (Contest clarifications show userId — requires backend change)
- DEFER-21 (Duplicated visibility-aware polling pattern)
- DEFER-29 through DEFER-40 (from April-22 cycle 28 plan)

## Agent Failures

None. All 10+1 review perspectives completed successfully.
