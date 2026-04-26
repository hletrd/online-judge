# Designer Review — RPF Cycle 4/100

**Date:** 2026-04-27
**Scope:** UI/UX review of recent changes; web frontend exists (Next.js + Tailwind + shadcn UI)
**Method:** source-level review (no live runtime; Postgres + Docker not available in sandbox per cycle-3 history note)

## Inventory of UI/UX-relevant files (recently changed)

- `src/components/exam/anti-cheat-monitor.tsx` — privacy notice dialog, heartbeat events
- `src/components/exam/` — siblings (no recent change)
- `src/lib/navigation/public-nav.ts` — top-nav config (Languages was removed in earlier cycle)
- `src/components/layout/public-footer.tsx` — Languages now lives here
- `src/components/layout/app-sidebar.tsx` — workspace sidebar (potential migration source)
- `messages/` — i18n translations

## Findings

### DES4-1: [LOW] Privacy notice dialog has no decline path (carried)

**Severity:** LOW | **Confidence:** HIGH | **File:** `src/components/exam/anti-cheat-monitor.tsx:307-332`

Repeating the carried-deferred finding (cycle 2 AGG-12, cycle 3 AGG3-8). The dialog has only an "Accept" button. The `Dialog` is also marked `disablePointerDismissal` and `onOpenChange={() => {}}`, which together prevent the user from dismissing without accepting.

**Concrete UX issue:**
- User opens an exam, sees the surveillance disclosure, decides not to consent → only path is to close the browser tab. There's no in-app "Decline & exit" → return to dashboard.
- For accessibility: a screen reader user encounters the dialog with no way to back out. The escape key is suppressed (`disablePointerDismissal`).
- The "X" close button is hidden (`showCloseButton={false}`).

**Fix (deferred per cycle 3):** Either:
1. Add a secondary "Decline & exit" button that navigates to `/dashboard` or `/contests` (depending on user role).
2. Allow `Escape` key to close → soft cancel that aborts the exam load.

Carry forward.

**Exit criterion:** UX/legal direction from product owner.

---

### DES4-2: [LOW] Privacy notice dialog uses `ShieldAlert` icon which can imply "alert/error" rather than informational

**Severity:** LOW | **Confidence:** MEDIUM | **File:** `src/components/exam/anti-cheat-monitor.tsx:312-313`

```tsx
<ShieldAlert className="size-5 text-muted-foreground" aria-hidden="true" />
```

The icon is `ShieldAlert` (a shield with an exclamation mark from lucide-react), which visually implies "warning/alert." The privacy notice is a *informational* disclosure ("here's what we monitor"), not an alert ("something went wrong"). A neutral icon (`Shield`, `ShieldCheck`, or `Eye`) might better match intent.

**Failure scenario:** User sees an alert icon, panics, expects something is wrong. Currently mitigated by the `text-muted-foreground` class (subtle color), but the iconography itself implies urgency.

**Fix:** Swap to `Shield` or `Eye`. Cosmetic.

**Exit criterion:** Icon swap deemed appropriate.

---

### DES4-3: [LOW] Workspace-to-public migration: no candidate surfaces this cycle

**Severity:** LOW | **Confidence:** MEDIUM | **Files:** `src/lib/navigation/public-nav.ts`, `src/components/layout/app-sidebar.tsx`

Per the user-injected directive (`user-injected/workspace-to-public-migration.md`), the loop should incrementally migrate workspace-only pages to public navigation. Cycle 4's review of recently-changed files surfaces no specific candidate page (the changes touched `analytics/route.ts`, `anti-cheat-monitor.tsx`, `env.ts`, `proxy.ts` — none of which are routing or page-level components).

**Suggested next-cycle review focus:**
- Compare `dashboard/sidebar.tsx` items against `public-nav.ts` items for unification candidates.
- Specifically `Submissions` (already in both — could unify), `Compiler/Playground` (status of unification unclear from this cycle's diff).

**Exit criterion:** Migration plan continues to track this in `plans/open/2026-04-19-workspace-to-public-migration.md`. No cycle-4 task added.

---

### DES4-4: [INFO] Korean letter-spacing rule observed

Per CLAUDE.md, no `tracking-*` Tailwind utility may be applied to Korean text. The `anti-cheat-monitor.tsx` privacy notice uses `text-sm text-muted-foreground space-y-1 list-disc list-inside` — no `tracking-*` class. Compliant.

The `Dialog` content is rendered through shadcn primitives. No tracking applied at component level.

**No action.**

---

### DES4-5: [LOW] Privacy notice text content is not visible without translation lookup

**Severity:** LOW | **Confidence:** HIGH | **Files:** `src/components/exam/anti-cheat-monitor.tsx:312-327`, `messages/en.json` and `messages/ko.json`

The dialog uses `t("privacyNoticeTitle")`, `t("privacyNoticeDescription")`, and four bullet keys (`privacyNoticeTabSwitch`, `privacyNoticeCopyPaste`, `privacyNoticeIpAddress`, `privacyNoticeCodeSnapshots`). For a sandbox source-level review, I did not verify the actual translated copy. A future runtime designer pass should:

- Confirm Korean translation reads naturally (no AI-translated awkwardness — see CLAUDE.md `korean-naturalizer` skill).
- Confirm English translation is legally clear about what is monitored.
- Verify all four bullets are present in both locales.

**Fix:** Spot-check translations in the next cycle that has live messages access.

**Exit criterion:** N/A this cycle.

---

## Confidence Summary

- DES4-1: HIGH (literal observation; carried-deferred).
- DES4-2: MEDIUM (subjective UX call).
- DES4-3: MEDIUM (no surface this cycle; migration is standing work).
- DES4-4: HIGH (informational, compliance check).
- DES4-5: HIGH (need runtime verification).
