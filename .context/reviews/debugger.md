# Debugger Review — RPF Cycle 34

**Date:** 2026-04-23
**Reviewer:** debugger
**Base commit:** 16cf7ecf

## Inventory of Files Reviewed

- `src/lib/plugins/chat-widget/chat-widget.tsx` — Chat widget state management
- `src/app/api/v1/submissions/[id]/events/route.ts` — SSE connections
- `src/lib/security/in-memory-rate-limit.ts` — Rate limiter
- `src/lib/db/import.ts` — Import engine
- `src/lib/compiler/execute.ts` — Compiler execution
- `src/lib/realtime/realtime-coordination.ts` — Realtime coordination

## Findings

### DBG-1: Chat widget `sendMessage` uses `isStreaming` from closure — potential stale guard after abort [MEDIUM/MEDIUM]

**File:** `src/lib/plugins/chat-widget/chat-widget.tsx:157-237`

**Description:** The `sendMessage` callback checks `if (!text || isStreaming) return` at line 158, reading `isStreaming` from its closure. When the user aborts a streaming request (line 302: `abortControllerRef.current?.abort()`), the abort handler in the catch block (line 225) does NOT set `isStreaming` to false — only the `finally` block does (line 234). However, the `finally` block runs after the catch, so `isStreaming` IS correctly set to false. The real issue is that `isStreaming` is in the dependency array, making the guard stale-sensitive. If a user rapidly clicks "send" after aborting, the `sendMessage` instance they call may still have `isStreaming=true` from a prior render cycle. Using a ref would make the guard always-current.

**Concrete failure scenario:** User is streaming, aborts, the `finally` block sets `isStreaming=false`, but a re-render hasn't happened yet. The old `sendMessage` closure still has `isStreaming=true`. If the user clicks send before the re-render, the guard incorrectly rejects the message. This is a timing-dependent race that's more likely on slow devices.

**Fix:** Use ref for `isStreaming` check:
```tsx
const isStreamingRef = useRef(isStreaming);
useEffect(() => { isStreamingRef.current = isStreaming; }, [isStreaming]);

const sendMessage = useCallback(async (text: string, displayText?: string) => {
  if (!text || isStreamingRef.current) return;
  // ...rest unchanged
}, [editorContent?.code, editorContent?.language, problemContext, sessionId, t]);
```

**Confidence:** Medium

---

### DBG-2: Import engine silently skips unknown tables — data loss is invisible [MEDIUM/MEDIUM]

**File:** `src/lib/db/import.ts:183-184`

**Description:** When importing, if a table name in the export data doesn't have a corresponding entry in `TABLE_MAP`, the import silently continues (line 183: `if (!table) continue`). This means data for missing tables is silently dropped with only a `result.errors.push()` entry. The error is not prominent enough — a full database import that silently drops a table is a significant data integrity issue.

**Concrete failure scenario:** After adding a new table to the schema and updating the export but not the import, a production restore silently drops all data from the new table. The `errors` array mentions it, but the import still reports `success: true` if the transaction completes.

**Fix:** If any table is skipped due to missing `TABLE_MAP` entry, set `result.success = false` or at least add a warning-level log. Better yet, derive `TABLE_MAP` from `TABLE_ORDER` (see ARCH-1).

**Confidence:** High

---

### Previously Fixed Items (Verified)

- AGG-1 (Docker client remote path error leak): Fixed — verified
- AGG-2 (Compiler spawn error leak): Fixed — verified
- AGG-3 (SSE NaN guard): Fixed — verified
