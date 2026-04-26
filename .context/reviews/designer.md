# Designer Lane - Cycle 1

**Date:** 2026-04-26
**Angle:** UI/UX review of frontend components

## UI/UX Presence Confirmation

Repository confirmed as web frontend:
- Next.js App Router with React/TSX components
- Tailwind CSS styling (postcss.config.mjs present)
- shadcn/ui + Radix UI component library (components.json, src/components/ui/)
- next-intl for i18n (Korean + English locales confirmed)
- src/components/ directory with 40+ components

## Findings

### Finding DES-1: Anti-cheat privacy notice dialog has unclosable Dialog — intentional UX [LOW/HIGH]

**File:** `src/components/exam/anti-cheat-monitor.tsx:295-296`

```tsx
<Dialog open={true} onOpenChange={() => { /* prevent closing — notice must be accepted */ }} disablePointerDismissal>
```

The privacy notice dialog explicitly prevents closing via overlay click or escape. The only way to dismiss is clicking the "Accept" button. This is intentional — the user MUST acknowledge the monitoring before the exam begins.

**UX assessment:** This is standard practice for mandatory consent dialogs. The `disablePointerDismissal` prop prevents accidental dismissal. The comment explains the intent.

**Verdict:** Acceptable UX for mandatory consent.

---

### Finding DES-2: Korean Letter Spacing — component returns null when disabled, no Korean text rendered

**File:** `src/components/exam/anti-cheat-monitor.tsx:291,320-321`

When disabled, the component returns null (no DOM output). When enabled and privacy notice is shown, the Dialog contains translatable text via `useTranslations`. When enabled and notice accepted, it returns null (no visible UI).

**Korean letter spacing check:** The privacy notice text comes from `t()` (next-intl translations). These translations are configured in the i18n system, not in the component itself. The CLAUDE.md rule states: "Do NOT apply custom letter-spacing (or tracking-* Tailwind utilities) to Korean content."

**Review of rendered UI:** The Dialog component uses:
- `DialogTitle className="flex items-center gap-2"` — no tracking utilities
- `ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside"` — no tracking utilities
- No `letter-spacing`, `tracking-*`, or custom letter spacing applied

**Verdict:** Compliant with Korean letter spacing rule. No custom tracking applied.

---

### Finding DES-3: Anti-cheat monitor renders no visible UI during exam — UX is appropriate

**File:** `src/components/exam/anti-cheat-monitor.tsx:320`

When monitoring is active and privacy notice is accepted, the component returns `null`. This is correct UX — anti-cheat monitoring should be invisible to avoid distracting the test-taker.

The only user-facing feedback is:
1. Privacy notice dialog (one-time)
2. Toast warning on tab switch (`toast.warning(resolvedWarningMessage)` at line 215)

**Verdict:** Appropriate UX. No visual interference during exam.

---

### Finding DES-4: No loading/error states visible in anti-cheat monitor

**File:** `src/components/exam/anti-cheat-monitor.tsx`

**Observation:** When `sendEvent` fails (network error), the failure is silent — events are queued in localStorage and retried later. There's no user-visible error state. This is intentional (don't distract the test-taker with error toasts for background monitoring failures).

**Tradeoff:** Users have no feedback that their anti-cheat events failed to send. This could be31 problematic if the network is persistently down throughout the exam.

**Suggestion:** Consider a non-blocking indicator (e.g., a subtle icon or badge) showing "offline" status if events have been failing for an extended period.

---

### Finding DES-5: Select component compliance check

**Scope:** The anti-cheat monitor doesn't use Select components. Check the broader codebase.

**Check:** Per AGENTS.md rules:
1. SelectValue MUST have static children using React state variable
2. Every SelectItem MUST have label prop
3. No render functions in SelectValue children

Sample check of `src/components/ui/select.tsx` — verified Radix UI base-ui/select pattern.

**Verdict:** No Select violations found in the changed files. Broader Select compliance would need a separate audit.

---

### Finding DES-6: Accessibility — privacy notice dialog

**File:** `src/components/exam/anti-cheat-monitor.tsx:295-316`

**Assessment:**
- Dialog uses `DialogHeader`, `DialogTitle`, `DialogDescription` from shadcn/ui — these provide proper ARIA roles and labels
- The `ShieldAlert` icon has `className="size-5 text-muted-foreground"` but no `aria-hidden="true"` — decorative icon should be hidden from screen readers
- The Button has no `aria-label` but the text content is sufficient
- Focus is trapped in the Dialog (Radix UI Dialog behavior)

**Improvement:** Add `aria-hidden="true"` to the ShieldAlert icon.

---

## Summary

| ID | Finding | Severity | Confidence |
|----|---------|----------|------------|
| DES-1 | Unclosable consent dialog — intentional | LOW | HIGH |
| DES-2 | Korean letter spacing — compliant | LOW | HIGH |
| DES-3 | Invisible monitoring — appropriate UX | — | HIGH |
| DES-4 | No loading/error states | LOW | LOW |
| DES-5 | Select compliance — not applicable | — | HIGH |
| DES-6 | ARIA: ShieldAlert missing aria-hidden | LOW | MEDIUM |

2 actionable findings (DES-4, DES-6). Both LOW severity.
