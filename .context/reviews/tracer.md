# Tracer Review — RPF Cycle 34

**Date:** 2026-04-23
**Reviewer:** tracer
**Base commit:** 16cf7ecf

## Causal Tracing of Suspicious Flows

### TR-1: Chat widget sendMessage -> isStreaming guard — closure vs ref race [MEDIUM/MEDIUM]

**File:** `src/lib/plugins/chat-widget/chat-widget.tsx:157-237`

**Description:** Tracing the `sendMessage` flow:
1. User types and presses Enter -> `handleKeyDown` calls `handleSend`
2. `handleSend` calls `sendMessage(input.trim())`
3. `sendMessage` checks `if (!text || isStreaming) return` — `isStreaming` is from the closure
4. If `isStreaming=true` from a prior render, the message is incorrectly rejected

The key question: **Can the closure value of `isStreaming` be stale?**

Tracing: After abort, the `finally` block (line 233-236) calls `setIsStreaming(false)`. React batches state updates, so the re-render with `isStreaming=false` may not have happened yet when the user's next click fires the old `sendMessage`. The `sendMessageRef` pattern (line 240) mitigates this for the auto-analysis effect, but `handleSend` (line 242) captures `sendMessage` from the closure of its own `useCallback`, which is also stale if `isStreaming` hasn't updated.

**Hypothesis 1 (confirmed):** Stale closure can cause a false rejection on rapid abort+resend.
**Hypothesis 2 (unlikely):** Stale closure can cause a double-send. Unlikely because `isStreaming` can only be stale-true, not stale-false (abort always sets it to false before the user can resend).

**Fix:** Use a ref for the `isStreaming` guard to make it always-current.

**Confidence:** Medium

---

### TR-2: Import TABLE_MAP drift — silent data loss path [MEDIUM/MEDIUM]

**File:** `src/lib/db/import.ts:174-184`

**Description:** Tracing the import flow for a table not in `TABLE_MAP`:
1. Export data contains table `contestAnnouncements` with 500 rows
2. Import loops through `tableOrder`, reaches `contestAnnouncements`
3. Line 182: `const table = TABLE_MAP[tableName]` — returns `undefined`
4. Line 183: `if (!table)` — true, so `continue`
5. Line 184: `result.errors.push(...)` — error is recorded
6. Import completes with `success: true` because the transaction committed

The 500 rows are silently dropped. The error in `result.errors` is a string message, not a structured failure. The import reports success because the transaction completed without throwing.

**Fix:** Either (a) set `result.success = false` when tables are skipped, or (b) derive `TABLE_MAP` from `TABLE_ORDER` so they cannot drift.

**Confidence:** High

---

### Previously Fixed Items (Verified)

- AGG-1 (Docker remote error leak): Fixed — the three remote catch blocks now return sanitized messages
- AGG-2 (Compiler spawn error leak): Fixed — returns generic "Execution failed to start"
- AGG-3 (SSE NaN guard): Fixed — Number.isFinite check with fallback
