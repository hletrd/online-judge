# RPF Cycle 18 Review Remediation Plan

**Date:** 2026-04-20
**Source:** `rpf-cycle-18-aggregate.md`
**Status:** All priority items DONE

## Priority Items (implement this cycle)

### H1: Add `formatNumber` locale-aware utility and replace hardcoded `toLocaleString("en-US")` [AGG-1] — DONE

Commit: 131dc046

### H2: Fix access code share link to include locale prefix [AGG-2] — DONE

Commit: 51ea6980

### M1: Replace hardcoded English string in api-keys clipboard fallback [AGG-4] — DONE

Commit: f52c7fe9

### M2: Replace `userId!` non-null assertion with explicit capture [AGG-5] — DONE

Commit: c8ce897a

### M3: Add clipboard error feedback to copy-code-button [AGG-6] — DONE

Commit: 337e306e

## Deferred Items

### DEFER-1: Practice page progress-filter SQL CTE optimization [AGG-3]

**Original severity:** MEDIUM/MEDIUM
**Reason for deferral:** Significant refactoring scope — requires rewriting the progress filter query logic and careful testing. The current code works correctly for existing problem counts. The code already has a comment acknowledging this tech debt.
**Exit criterion:** Problem count exceeds 5,000 or a performance benchmark shows >2s page load time with progress filters.

### DEFER-2: Practice page decomposition — extract data module [AGG-7]

**Original severity:** LOW/MEDIUM
**Reason for deferral:** Large refactoring scope that should be combined with DEFER-1. Extracting the data module without also fixing the progress filter query would create a module with the same performance issue.
**Exit criterion:** DEFER-1 is picked up, or the page exceeds 800 lines.

### DEFER-3: Recruiting invitations panel `min` date uses client time [AGG-8]

**Original severity:** LOW/LOW
**Reason for deferral:** Server-side validation already prevents invalid dates. The `min` attribute is a UX hint only. Adding a server-provided date would require passing additional props through the component hierarchy for minimal benefit.
**Exit criterion:** Users report date picker UX issues, or a pattern for passing server time to client components is established.

## Workspace-to-Public Migration Progress

**Current phase:** Phase 4 — IN PROGRESS
**Next step:** Remove redundant page components under `(dashboard)` where public counterparts exist.

Per the user-injected TODO, this cycle should make incremental progress on the workspace-to-public migration. The migration plan is at `plans/open/2026-04-19-workspace-to-public-migration.md`. The remaining Phase 4 item is:

> Remove redundant page components under `(dashboard)` where public counterparts exist.

Dashboard pages that now have public counterparts and redirect:
- `/dashboard/rankings` -> `/rankings` (already redirects)
- `/dashboard/languages` -> `/languages` (already redirects)
- `/dashboard/compiler` -> `/playground` (already redirects)

These pages redirect but the page components still exist. Removing them would clean up the codebase. This will be addressed as an additional implementation item this cycle.

### M4: Remove redundant dashboard page components that redirect to public counterparts — SKIPPED

Investigated: The directories `src/app/(dashboard)/dashboard/rankings/`, `src/app/(dashboard)/dashboard/languages/`, and `src/app/(dashboard)/dashboard/compiler/` do not exist — they were already removed in previous cycles. The redirects are already in place.
