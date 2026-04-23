# Document Specialist Review — RPF Cycle 34

**Date:** 2026-04-23
**Reviewer:** document-specialist
**Base commit:** 16cf7ecf

## Inventory of Documentation Reviewed

- `AGENTS.md` — Agent guide
- `CLAUDE.md` — Project rules
- `.context/` — Context directory
- `src/lib/db/import.ts` — Import engine comments
- `src/lib/db/export.ts` — Export engine comments
- `src/lib/compiler/execute.ts` — Shell command validation comments

## Findings

### DOC-1: SSE route missing architectural decision record [LOW/LOW]

**File:** `src/app/api/v1/submissions/[id]/events/route.ts`

**Description:** The SSE route has significant architectural decisions (in-memory connection tracking, shared poll timer, per-user connection caps, cleanup interval with NaN guard) that are documented only via inline comments. There is no architectural decision record (ADR) explaining why SSE was chosen over WebSockets, why connection tracking is in-memory, or how the shared poll timer works. This was identified in prior cycles as a deferred item.

**Confidence:** Low

---

### DOC-2: Docker client dual-path behavior not documented [LOW/LOW]

**File:** `src/lib/docker/client.ts`

**Description:** The Docker client has a dual-path design (local Docker API vs remote worker API), controlled by `USE_WORKER_DOCKER_API`. The local paths were sanitized in commit db77565d and the remote paths in commit 5527e96b. The dual-path behavior is not documented in AGENTS.md or any architectural document, making it easy for a new developer to miss the split. This was identified in prior cycles as a deferred item.

**Confidence:** Low

---

### DOC-3: Import engine TABLE_MAP drift risk not documented [LOW/MEDIUM]

**File:** `src/lib/db/import.ts:15`

**Description:** The `TABLE_MAP` comment says "Map of logical table names to Drizzle table references" but does not mention that it must stay in sync with `TABLE_ORDER` in export.ts and with the schema. Adding a warning comment would help future developers understand the coupling.

**Fix:** Add a comment:
```typescript
/**
 * Map of logical table names to Drizzle table references.
 * WARNING: Must stay in sync with TABLE_ORDER in export.ts.
 * If a table is added to the schema, it must be added to both
 * TABLE_MAP and TABLE_ORDER or imports/exports will silently
 * skip that table.
 */
```

**Confidence:** Medium
