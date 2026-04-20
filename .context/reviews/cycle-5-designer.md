# Designer — Cycle 5 (Fresh)

**Date:** 2026-04-20
**Base commit:** 9d6d7edc
**Reviewer:** designer

## Findings

### DES-1: Client-side `toLocaleString()` without locale produces inconsistent date formatting [LOW/MEDIUM]

**Files:**
- `src/components/contest/participant-anti-cheat-timeline.tsx:149`
- `src/components/contest/anti-cheat-dashboard.tsx:256`
- `src/app/(dashboard)/dashboard/admin/plugins/chat-logs/chat-logs-client.tsx:110`
- `src/app/(dashboard)/dashboard/admin/plugins/chat-logs/chat-logs-client.tsx:154`

**Description:** These client components use `toLocaleString()` without specifying a locale. For an i18n app supporting Korean and English, this produces inconsistent formatting depending on the browser's locale setting. A Korean user on an English-locale browser would see dates in English format (e.g., "4/20/2026, 11:00:00 PM") instead of Korean format.

The recruit page was fixed in cycle 27 to use `formatDateTimeInTimeZone` with the user's locale, but these admin components were not updated.

**Fix:** Pass the current locale from next-intl to `toLocaleString(locale)` or use `formatDateTimeInTimeZone` from `@/lib/datetime`.

**Confidence:** MEDIUM

---

### DES-2: `toLocaleDateString()` without locale in recruiting invitations panel [LOW/LOW]

**File:** `src/components/contest/recruiting-invitations-panel.tsx:252`

**Description:** `new Date(dateStr).toLocaleDateString(undefined, {...})` uses the browser's default locale. This is a client component used by instructors/admins. While the impact is lower than student-facing pages, it is still inconsistent with the i18n approach.

**Fix:** Pass locale from next-intl context.

**Confidence:** LOW

---

## Verified Safe

- Korean letter-spacing remediation is comprehensive — all headings and labels are properly locale-conditional.
- The recruit page correctly uses `formatDateTimeInTimeZone` with user locale for deadline display.
- Practice page and problem pages correctly pass `locale` to `toLocaleDateString`.
- Dark mode support is properly implemented with dark: variant classes.
- Card-based layout on the recruit page provides clear visual hierarchy.
