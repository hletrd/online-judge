# Performance Review — RPF Cycle 34

**Date:** 2026-04-23
**Reviewer:** perf-reviewer
**Base commit:** 16cf7ecf

## Inventory of Files Reviewed

- `src/app/api/v1/submissions/[id]/events/route.ts` — SSE connection management
- `src/lib/realtime/realtime-coordination.ts` — Shared realtime coordination
- `src/lib/security/in-memory-rate-limit.ts` — In-memory rate limiter
- `src/lib/security/rate-limit.ts` — DB-backed rate limiter
- `src/lib/plugins/chat-widget/chat-widget.tsx` — Chat widget rendering
- `src/lib/db/export.ts` — Database export streaming
- `src/lib/data-retention-maintenance.ts` — Data pruning
- `src/lib/compiler/execute.ts` — Compiler execution

## Findings

### PERF-1: SSE cleanup timer calls `getConfiguredSettings()` every 60s — unnecessary repeated cost [LOW/MEDIUM]

**File:** `src/app/api/v1/submissions/[id]/events/route.ts:82-91`

**Description:** The global SSE cleanup `setInterval` calls `getConfiguredSettings()` on every 60-second tick. The setting rarely changes and should be cached with a TTL. This was identified as AGG-5 in cycle 33 but remains unfixed. The `getConfiguredSettings()` function may involve DB queries (depending on cache state), so calling it every 60s is wasteful.

**Concrete failure scenario:** Under normal operation, 24 calls/hour x N config settings each with a potential DB round-trip if the internal cache has expired. On a lightly loaded system, this adds unnecessary DB load.

**Fix:** Cache the stale threshold with a 5-minute TTL:
```typescript
let cachedThreshold: number | null = null;
let cachedAt = 0;
const THRESHOLD_TTL_MS = 5 * 60 * 1000;

function getStaleThreshold(): number {
  const now = Date.now();
  if (cachedThreshold !== null && now - cachedAt < THRESHOLD_TTL_MS) {
    return cachedThreshold;
  }
  const sseTimeout = getConfiguredSettings().sseTimeoutMs;
  cachedThreshold = Number.isFinite(sseTimeout)
    ? Math.min(sseTimeout + 30_000, 2 * 60 * 60 * 1000)
    : 30_030_000;
  cachedAt = now;
  return cachedThreshold;
}
```

**Confidence:** Medium

---

### PERF-2: Chat widget `sendMessage` re-creation on streaming state change [MEDIUM/MEDIUM]

**File:** `src/lib/plugins/chat-widget/chat-widget.tsx:237`

**Description:** The `sendMessage` callback includes `isStreaming` in its dependency array. During streaming, `isStreaming` is set to `true` once at the start (line 165) and `false` at the end (line 234), so the re-creation only happens at stream start and end, not on every chunk. However, if the user rapidly starts/stops streams, each transition causes `sendMessage`, `sendMessageRef`, `handleSend`, and `handleKeyDown` to be recreated. Using a ref for the streaming guard would eliminate this entirely.

**Concrete failure scenario:** User submits a message, streaming starts (1 recreation), user aborts and submits again (2 more recreations in rapid succession). On each recreation, the useEffect at line 240 runs to update `sendMessageRef`.

**Fix:** Use ref for `isStreaming` check (same as CR-1 in code-reviewer review).

**Confidence:** Medium

---

### PERF-3: In-memory rate limiter FIFO sort on overflow creates O(n log n) allocation [LOW/LOW]

**File:** `src/lib/security/in-memory-rate-limit.ts:42`

**Description:** When the in-memory rate limiter exceeds `MAX_ENTRIES` (10,000), it sorts all entries by `lastAttempt` to find the oldest ones to evict. This creates a new array via spread + sort, allocating O(n) memory and O(n log n) CPU. Since this is bounded by the 10K cap, the impact is minimal. This was identified in prior cycles as a deferred cosmetic issue.

**Fix:** Could use a min-heap or linked-list for O(1) eviction, but the 10K cap makes this low priority.

**Confidence:** Low

---

### Previously Known Items (Verified Fixed)

- AGG-3 (SSE NaN guard): Fixed in commit 8ca143d4
