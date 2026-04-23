# UI/UX Review — RPF Cycle 34

**Date:** 2026-04-23
**Reviewer:** designer
**Base commit:** 16cf7ecf

## Inventory of UI Files Reviewed

- `src/lib/plugins/chat-widget/chat-widget.tsx` — Chat widget component
- `src/app/globals.css` — Global styles (prefers-reduced-motion section)
- `src/components/layout/skip-to-content.tsx` — Skip navigation
- `src/components/ui/` — UI components (select, dialog, etc.)

## Findings

### DES-1: Chat widget entry animation ignores `prefers-reduced-motion` [LOW/MEDIUM]

**File:** `src/lib/plugins/chat-widget/chat-widget.tsx:288`

**Description:** The chat widget container uses `animate-in fade-in slide-in-from-bottom-4 duration-200` for its entry animation. While the typing indicator dots correctly use `motion-safe:animate-bounce` (line 339), the entry animation does not use `motion-safe:` prefix. The `globals.css` file has a `prefers-reduced-motion: reduce` media query at line 138, but Tailwind's `animate-in` utilities may not be covered by it depending on the Tailwind config. This was identified as prior AGG-3 in cycle 33.

**Concrete failure scenario:** A user with vestibular disorders has `prefers-reduced-motion: reduce` enabled. The chat widget slides in from the bottom with a 200ms animation, causing discomfort.

**Fix:** Either prefix with `motion-safe:` or add a CSS override in globals.css:
```css
@media (prefers-reduced-motion: reduce) {
  .animate-in {
    animation: none !important;
  }
}
```

**Confidence:** High

---

### DES-2: Chat widget textarea lacks explicit `aria-label` [LOW/LOW]

**File:** `src/lib/plugins/chat-widget/chat-widget.tsx` (textarea in input section)

**Description:** The chat input textarea relies on its `placeholder` attribute for accessibility. While screen readers may announce the placeholder, an explicit `aria-label` would be more reliable. This was identified in prior cycles as a deferred cosmetic item.

**Fix:** Add `aria-label={t("placeholder")}` to the textarea element.

**Confidence:** Low

---

### Previously Fixed Items

- AGG-7 (Chat widget ARIA role): Fixed in commit 16cf7ecf — `role="log"` and `aria-label` added to messages container
