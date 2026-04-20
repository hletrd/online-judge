# Document Specialist — Cycle 24

**Date:** 2026-04-20
**Base commit:** 2af713d3

---

## DOC-1: i18n key `contests.openWorkspace` contradicts the workspace-to-public migration [MEDIUM/HIGH]

**Files:** `messages/en.json:2901`, `messages/ko.json:2901`
**Description:** The i18n key `contests.openWorkspace` still exists in both locale files with values "Open workspace" / "워크스페이스 열기". This contradicts the workspace-to-public migration which replaced "workspace" with "dashboard" terminology in all other locations (nav, sidebar, header, home page, 404 page). The key is actively used by `src/app/(public)/contests/[id]/page.tsx:237`.
**Concrete failure scenario:** Translators see "openWorkspace" and may add translations for a concept that should be deprecated.
**Fix:** Rename the key to `contests.openDashboard` and update both locale files with "Open dashboard" / "대시보드 열기".

## DOC-2: robots.txt still disallows `/workspace` — inconsistent with migration docs [LOW/MEDIUM]

**Files:** `src/app/robots.ts:17`
**Description:** The robots.txt disallow list includes `"/workspace"`. The migration plan documents the workspace-to-public migration but does not mention cleaning up the robots.txt entry.
**Fix:** Remove `/workspace` from the disallow list and note the cleanup in the migration plan.

---

## Verified Safe

- AGENTS.md correctly documents the workspace-to-public migration progress.
- The migration plan correctly documents Phase 4 as in progress.
