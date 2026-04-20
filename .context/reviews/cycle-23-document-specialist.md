# Cycle 23 Document Specialist Review

**Date:** 2026-04-20
**Reviewer:** document-specialist
**Base commit:** 86e7caf7

## Findings

### DOC-1: Migration plan says Phase 4 is "Higher risk, defer" but user TODO explicitly requests it now [MEDIUM/HIGH]

**File:** `plans/open/2026-04-19-workspace-to-public-migration.md:228`
**Description:** The migration plan labels Phase 4 as "Higher risk, defer" but the user-injected TODO for this cycle explicitly says: "Continue Phase 4 of workspace-to-public migration: merge control route group into dashboard (requires i18n namespace migration from controlShell to publicShell/dashboard)." The plan document needs updating to reflect that Phase 4 is now in progress, not deferred.
**Concrete failure scenario:** A developer reading the plan thinks Phase 4 is deferred and does not work on it, contradicting the explicit TODO.
**Confidence:** High
**Fix:** Update the migration plan to mark Phase 4 as IN PROGRESS and add the control-to-dashboard merge as a specific sub-task.

### DOC-2: `controlShell` i18n keys have no migration mapping documented [MEDIUM/MEDIUM]

**File:** `messages/en.json:2968-3018`
**Description:** The `controlShell` namespace has ~50 keys that need to be migrated to other namespaces when the control route group is removed. There is no documented mapping of which keys go where (e.g., `controlShell.nav.home` -> `nav.dashboard`, `controlShell.moderation.*` -> `publicShell.moderation.*` or `nav.moderation.*`).
**Concrete failure scenario:** During migration, keys are accidentally dropped or mapped to wrong namespaces, causing raw key leaks in production.
**Confidence:** Medium
**Fix:** Create a key migration mapping table in the plan document before starting the merge.
