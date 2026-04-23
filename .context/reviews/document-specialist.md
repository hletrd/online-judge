# Document Specialist Review — RPF Cycle 46

**Date:** 2026-04-23
**Reviewer:** document-specialist
**Base commit:** 54cb92ed

## Inventory of Documentation Reviewed

- `CLAUDE.md` — Project rules
- `src/lib/assignments/submissions.ts` — Comment on clock-skew fix (verified)
- `src/lib/assignments/active-timed-assignments.ts` — Good example of clock-skew documentation
- `src/lib/realtime/realtime-coordination.ts` — Missing comment about Date.now clock-skew risk
- `src/lib/security/api-rate-limit.ts` — Missing comment about Date.now vs DB time

## Previously Fixed Items (Verified)

- Import TABLE_MAP drift warning comment: Fixed
- Recruiting-constants JSDoc: Present
- Submission route rate-limit comment: Present
- `validateAssignmentSubmission` clock-skew comment: Present (added in cycle 45)

## New Findings

### DOC-1: `realtime-coordination.ts` uses `Date.now()` without comment about clock-skew risk [LOW/LOW]

**File:** `src/lib/realtime/realtime-coordination.ts:88,148`

**Description:** The `acquireSharedSseConnectionSlot` and `shouldRecordSharedHeartbeat` functions use `Date.now()` at lines 88 and 148 to compare against DB-stored timestamps without any comment explaining the inconsistency with the codebase convention of using `getDbNowUncached()`. The `submissions.ts` module now has an excellent comment: "Use DB server time for deadline checks to avoid clock skew between app and DB servers, consistent with other schedule checks." A similar comment should exist here, or preferably the code should be fixed.

**Fix:** If the clock-skew issue is fixed, add a comment. If deferred, add a `// TODO(clock-skew)` comment for visibility.

**Confidence:** Low

---

### Carry-Over Items

- **DOC-1 (from prior cycles):** SSE route ADR (LOW/LOW, deferred)
- **DOC-2 (from prior cycles):** Docker client dual-path behavior documentation (LOW/LOW, deferred)
