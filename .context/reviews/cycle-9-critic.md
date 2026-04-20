# Cycle 9 Critic Review Report

**Reviewer:** critic
**Date:** 2026-04-19
**Base commit:** 63a31dc0
**Scope:** Multi-perspective critique of the whole change surface

## Critique Perspective

This review examines the codebase from multiple stakeholder perspectives: developer experience, operational safety, and product correctness.

## Findings

### CR9-CT1 — [MEDIUM] Auth config's triple field mapping is a ticking time bomb for silent auth regressions

- **Confidence:** HIGH
- **Cross-agent agreement:** code-reviewer CR9-CR1, architect CR9-AR1
- **Evidence:** `src/lib/auth/config.ts` maps ~15 user fields in three separate code blocks. This is the single highest-risk maintenance hazard in the codebase. Auth regressions are silent (no compile error, no test failure — just missing data in JWT/session) and hard to debug. The recent addition of multiple editor/lecture preference fields (7 fields in the last iteration) makes this worse because each new preference adds 3-4 lines of mapping code.
- **Why it matters more than the other findings:** Auth is the security perimeter. A missed field mapping could mean a user's `mustChangePassword` flag is dropped, or their role is stale. This is not theoretical — the `shareAcceptedSolutions` and `acceptedSolutionsAnonymous` fields were added recently and required changes in 4 places.
- **Suggested fix:** Extract shared mapping function immediately. This is the highest-priority fix in this cycle.

### CR9-CT2 — [MEDIUM] SSE re-auth is architecturally broken — it provides a false sense of security

- **Confidence:** HIGH
- **Cross-agent agreement:** security-reviewer CR9-SR1, code-reviewer CR9-CR2
- **Evidence:** The SSE re-auth check at `src/app/api/v1/submissions/[id]/events/route.ts:306-317` is fire-and-forget. It does not actually prevent the current event from being delivered. The comment says "auth revocation will take effect on the next tick" — but the next tick might deliver the final `result` event containing the full submission data. The re-auth provides a false sense of security while adding complexity.
- **Why it matters:** If you're going to have a re-auth check, it should be effective. A half-measure that doesn't actually prevent data leakage is worse than no check at all, because it creates a false security claim.
- **Suggested fix:** Either: (a) make the re-auth check blocking (await it before processing events), or (b) remove the re-auth check entirely and document that SSE connections are valid for their full duration once established. Option (a) is safer.

### CR9-CT3 — [LOW] The workspace-to-public migration is stalled at Phase 2 with no clear path to Phase 3

- **Confidence:** HIGH
- **File:** `plans/open/2026-04-19-workspace-to-public-migration.md`
- **Evidence:** Phase 1 and 2 are complete. Phase 3 (Dashboard layout refinement) has 4 items, none started. Phase 4 (Route consolidation) is deferred. The prerequisites section lists 4 unchecked items including "Mobile UX audit" and "Design mockup". The plan has been in this state for multiple cycles.
- **Why it matters:** The current dual-navigation paradigm (PublicHeader + AppSidebar) is a source of ongoing UX inconsistency and maintenance burden. The longer the migration stalls, the more code accumulates that depends on the current dual-layout structure.
- **Suggested fix:** Break Phase 3 into smaller, independently deployable steps. Start with the highest-value item (making the top navbar visible on dashboard pages) which doesn't require a design mockup.

### CR9-CT4 — [LOW] The `shareAcceptedSolutions` default-true policy is not documented in code or user-facing docs

- **Confidence:** MEDIUM
- **Cross-agent agreement:** security-reviewer CR9-SR2
- **Evidence:** `src/lib/auth/config.ts:66` defaults `shareAcceptedSolutions` to `true`. This is a privacy-relevant setting. There's no comment explaining why the default is opt-out rather than opt-in.
- **Suggested fix:** Add a comment explaining the design rationale. Add a user-visible notice on the profile page about this setting.

## Assessment Summary

The most critical finding is CR9-CT1 (triple auth field mapping). This is a systemic risk that grows with every new user preference field. The SSE re-auth issue (CR9-CT2) is the second priority — it's a security control that doesn't fully work.
