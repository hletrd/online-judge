# Tracer Review — RPF Cycle 28 (Fresh)

**Date:** 2026-04-23
**Reviewer:** tracer
**Base commit:** 63557cc2

## TR-1: Causal trace of `code-editor.tsx` hardcoded English strings [MEDIUM/MEDIUM]

**File:** `src/components/code/code-editor.tsx:96-97,107,113-114,117`

**Trace:**
1. User opens the playground/compiler page
2. The `CodeEditor` component renders with `showFullscreen={true}`
3. The fullscreen button renders with `aria-label="Fullscreen (F)"` — hardcoded English
4. A Korean screen reader user navigates to this button
5. The screen reader announces "Fullscreen (F)" in English
6. The user presses Enter to activate fullscreen
7. The fullscreen overlay renders with `{props.language ?? "Code Editor"}` at line 107 — hardcoded "Code Editor"
8. The exit button renders with `aria-label="Exit fullscreen (Esc)"` — hardcoded English
9. The visible text "Exit" at line 117 is also hardcoded English

**Hypothesis:** The code editor was likely written before the i18n system was fully established, or the developer assumed keyboard shortcut labels (F, Esc) don't need translation. However, the surrounding text ("Fullscreen", "Exit", "Code Editor") does need translation.

**Assessment:** This is a genuine i18n gap. The keyboard shortcut names (F, Esc) are universal, but the descriptive text needs localization.

---

## TR-2: `contest-replay.tsx` setInterval drift trace [LOW/LOW]

**File:** `src/components/contest/contest-replay.tsx:77-87`

**Trace:**
1. User opens contest replay with 100 snapshots
2. User clicks "Play" at 4x speed (interval = 350ms)
3. The `setInterval` fires every 350ms
4. User switches to another tab (background)
5. Browser throttles the interval (fires at most once per second in most browsers)
6. User returns to the tab after 10 seconds
7. The accumulated intervals fire rapidly, causing the replay to jump forward multiple snapshots at once

**Fix:** Replace `setInterval` with recursive `setTimeout`.
