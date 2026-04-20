# Cycle 18 Critic Findings

**Date:** 2026-04-19
**Reviewer:** Multi-perspective critique
**Base commit:** 7c1b65cc

---

## Findings

### F1: `db/cleanup.ts` is marked deprecated but the cron endpoint still calls it — operational confusion

- **File**: `src/lib/db/cleanup.ts:17-19`, `src/app/api/internal/cleanup/route.ts:23`
- **Severity**: LOW
- **Confidence**: HIGH
- **Description**: The `cleanupOldEvents()` function is marked as `@deprecated` in its JSDoc comment (line 17), and the comment explains it is "superseded by the in-process pruners." However, the `/api/internal/cleanup` cron endpoint still calls it (line 23 of route.ts). This creates operational confusion: operators who read the deprecation notice may disable their cron jobs, expecting the in-process pruners to handle cleanup. But the cron endpoint is still functional and could be referenced by external cron configurations. The deprecation should either be completed (remove the endpoint or make it a no-op that redirects to the canonical pruners) or the deprecation notice should be removed.
- **Suggested fix**: Either (a) make the cron endpoint call the canonical pruners from `data-retention-maintenance.ts` and `audit/events.ts` instead of `cleanupOldEvents`, or (b) add an explicit log message when the cron endpoint is called warning that it is deprecated and operators should rely on the in-process pruners.

### F2: `contest-analytics.ts` F7 from existing review (ROUND(score,2)=100) has a documented comment but no code fix

- **File**: `src/lib/assignments/contest-analytics.ts:166-178`
- **Severity**: LOW
- **Confidence**: LOW
- **Description**: The existing cycle-18 review (F7) identified that `ROUND(s.score, 2) = 100` in the first-AC query is ICPC-oriented and may not accurately reflect IOI "first solve" timing. A detailed comment has been added (lines 166-178) documenting this limitation. However, the code itself hasn't been changed, and the comment mentions "A future enhancement could add IOI-aware first max adjusted score tracking if needed." This is acceptable for now but should be tracked as a known limitation.
- **Suggested fix**: No code change needed this cycle. The comment is sufficient documentation. Track as a deferred item.

### F3: Workspace-to-public migration Phase 3 remaining items are design decisions, not bugs

- **File**: `plans/open/2026-04-19-workspace-to-public-migration.md`
- **Severity**: LOW
- **Confidence**: HIGH
- **Description**: The remaining Phase 3 items ("Further slim down AppSidebar to icon-only mode", "Move breadcrumb to top navbar area", "Evaluate (control) route group merge") are UX design decisions that require stakeholder input. They should not be treated as bugs or technical debt. The current dual-navigation state is functional, just not optimal.
- **Suggested fix**: Make incremental progress on the sidebar slim-down (remove text labels for items already in PublicHeader) and defer the breadcrumb and control route merge to a design review.

---

## Cross-agent Agreement

- **getRecruitingAccessContext N+1**: Agree with code-reviewer F1, perf-reviewer F1, architect F1. This is the most impactful finding this cycle — it affects 15+ routes and causes measurable performance degradation.
- **Import memory usage**: Agree with code-reviewer F2, debugger F1. The 100 MB upload can cause OOM on memory-constrained containers.
- **Admin route DRY**: Agree with code-reviewer F3, architect F2. The duplicated patterns increase maintenance burden.
