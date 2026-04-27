# Designer Review — RPF Cycle 7/100

**Date:** 2026-04-26
**Cycle:** 7/100
**Lens:** UI/UX, accessibility (WCAG 2.2), responsive, dark/light mode, perceived performance, i18n, focus/keyboard

**Runtime status:** No live runtime in sandbox per cycle-3 sandbox limitation (`src/instrumentation.ts` register hook requires live Postgres; no Docker available). Source-level fallback review.

---

## Cycle-6 carry-over verification

UI-relevant cycle-6 items reverified:
- DES6-1 (privacy notice no decline path, carried) — still no decline path at `anti-cheat-monitor.tsx:274-298`. Carried.
- DES6-2 (privacy notice ARIA hierarchy not explicit, carried) — relies on Radix auto-wiring. Carried.
- DES6-3 (privacy notice ARIA structure, carried) — same. Carried.

---

## DES7-1: [LOW, NEW] Anti-cheat privacy notice dialog uses `<Button variant="default" className="w-full">` — but the `Accept` action is the ONLY action

**Severity:** LOW (a11y / mobile UX — exam-only surface, deliberate design)
**Confidence:** HIGH

**Evidence:**
- `src/components/exam/anti-cheat-monitor.tsx:274-298`:
  ```tsx
  <Dialog open={true} onOpenChange={() => { /* prevent closing */ }} disablePointerDismissal>
    <DialogContent showCloseButton={false}>
      ...
      <Button variant="default" className="w-full" onClick={() => setShowPrivacyNotice(false)}>
        {t("privacyNoticeAccept")}
      </Button>
    </DialogContent>
  </Dialog>
  ```
- The dialog blocks Esc dismissal (`onOpenChange` no-op) and pointer dismissal (`disablePointerDismissal`). Has no close button (`showCloseButton={false}`). The ONLY exit path is the Accept button.

**Why it's by design:** Per cycle-3 deferred AGG3-8/DES3-1, this is intentional — the user must explicitly consent to the anti-cheat monitoring before the exam starts. Refusal is a product/legal decision (carried-deferred since cycle 3).

**Fix:** No action needed at the code level — this is a product/legal decision. Recording for completeness so the deferred-rationale is preserved.

**Carried-deferred status:** Defer per cycle-3 reasoning (UX/legal call; not a code defect).

---

## DES7-2: [LOW, NEW] Privacy notice list (`anti-cheat-monitor.tsx:287`) uses `text-sm text-muted-foreground` — WCAG AA contrast borderline

**Severity:** LOW (a11y / WCAG AA contrast)
**Confidence:** LOW (no live render to measure exact contrast)

**Evidence:**
- `anti-cheat-monitor.tsx:287`: `<ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">`.
- WCAG AA requires 4.5:1 contrast for body text. Tailwind's default `--muted-foreground` in light mode against `--background` (white) is approximately 5.0:1 (passes AA but tight).
- In dark mode contrast is comfortable.

**Fix:** Run a contrast check via DevTools or `agent-browser-visual` accessibility-snapshot when a runtime is available.

**Exit criteria:** Privacy notice list contrast verified ≥ 4.5:1 in both light and dark mode.

**Carried-deferred status:** Defer (verification needs runtime; same as cycle-5 / cycle-6 deferred rationale).

---

## DES7-3: [LOW, NEW] `Dialog` component's `onOpenChange={() => { /* prevent closing — notice must be accepted */ }}` is a no-op handler — explicit `e.preventDefault()` on `onEscapeKeyDown` would make intent more discoverable

**Severity:** LOW (a11y — screen reader UX clarity)
**Confidence:** MEDIUM

**Evidence:**
- `anti-cheat-monitor.tsx:276`: `<Dialog open={true} onOpenChange={() => { /* ... */ }} disablePointerDismissal>`.
- Radix `Dialog` does NOT inherently announce "press Escape to close" — its internal a11y is robust.
- The current no-op `onOpenChange` works but is less discoverable than `onEscapeKeyDown={(e) => e.preventDefault()}` + `onPointerDownOutside={(e) => e.preventDefault()}`.

**Fix:** Use Radix's explicit handlers for clarity. The effect is the same.

**Exit criteria:** Modal explicitly handles escape/pointer-outside.

**Carried-deferred status:** Defer (a11y on exam-only surface; pick up alongside dedicated a11y audit cycle).

---

## DES7-4: [LOW, NEW] Heartbeat timer interval is hardcoded at `HEARTBEAT_INTERVAL_MS = 30_000` in `anti-cheat-monitor.tsx:30` — no env override, no per-assignment override

**Severity:** LOW (configuration flexibility)
**Confidence:** HIGH

**Evidence:**
- `anti-cheat-monitor.tsx:30`: `const HEARTBEAT_INTERVAL_MS = 30_000;` — module constant.
- No env-based override. No per-exam override.

**Why it's worth tracking:** A high-stakes exam may want shorter heartbeat (e.g., 10s) for tighter monitoring; a low-stakes exam may want longer (e.g., 60s) to reduce server load. Hardcoding limits flexibility.

**Fix:** Wire from `assignment.heartbeatIntervalMs` (a new optional schema field) or accept as a prop.

**Exit criteria:** Heartbeat interval is configurable per-assignment.

**Carried-deferred status:** Defer (no current product requirement).

---

## DES7-5: [LOW, NEW] `Dialog` content max-width on smallest mobile (320px) — DialogContent typical `sm:max-w-lg` (32rem ≈ 512px) collapses to `max-w-[calc(100%-2rem)]` on small screens, but the privacy notice list with bullets + long Korean text could overflow

**Severity:** LOW (responsive — depends on i18n string length)
**Confidence:** LOW

**Evidence:**
- `anti-cheat-monitor.tsx:287`: `<ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">` with 4 list items (privacyNoticeTabSwitch, privacyNoticeCopyPaste, privacyNoticeIpAddress, privacyNoticeCodeSnapshots).
- On 320px viewport, the dialog is ~280px wide. Korean text wraps fine generally, but a list-disc indent + long Korean string may cause unexpected wrapping.

**Fix:** Manual visual check on a 320px viewport. Likely already fine.

**Carried-deferred status:** Defer (verification needs runtime).

---

## Summary

**Cycle-7 NEW findings:** 0 HIGH, 0 MEDIUM, 5 LOW (all carried-deferable; runtime verification needed for several).
**Cycle-6 carry-over status:** Privacy notice carries the same a11y defers as cycles 3-6.
**Designer verdict:** No regressions at HEAD. The exam-only privacy notice surface remains the primary a11y deferred area. All findings are defensible defers.

**Note:** Live runtime review remains blocked per cycle-3 sandbox limitation.
