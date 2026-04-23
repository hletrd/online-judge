# Document Specialist Review — RPF Cycle 28 (Fresh)

**Date:** 2026-04-23
**Reviewer:** document-specialist
**Base commit:** 63557cc2

## DOC-1: `apiFetchJson` JSDoc already mentions the "parse once" pattern — no update needed [INFO]

**File:** `src/lib/api/client.ts`

The `apiFetchJson` JSDoc was updated in a prior cycle to mention the "parse once, then branch" pattern. No further documentation updates are needed.

---

## DOC-2: `code-editor.tsx` lacks i18n documentation for hardcoded strings [LOW/LOW]

**File:** `src/components/code/code-editor.tsx`

The code editor has 5 hardcoded English strings without any comment explaining why they are not i18n-ized. If there was a deliberate decision to keep them in English (e.g., because keyboard shortcut names are universal), a comment should document this. Otherwise, they should be migrated to i18n.

**Fix:** Either add i18n keys for these strings, or add a comment documenting why they are intentionally kept in English.
