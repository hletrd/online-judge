# RPF Cycle 34 — Aggregate Review

**Date:** 2026-04-23
**Base commit:** 16cf7ecf
**Review artifacts:** code-reviewer.md, perf-reviewer.md, security-reviewer.md, architect.md, critic.md, verifier.md, debugger.md, test-engineer.md, tracer.md, designer.md, document-specialist.md

## Previously Fixed Items (Verified in Current Code)

All prior cycle 33 aggregate findings have been addressed:
- AGG-1 (Docker client remote path error leak): Fixed in commit 5527e96b
- AGG-2 (Compiler spawn error leak): Fixed in commit 46ba5e0c
- AGG-3 (SSE NaN guard): Fixed in commit 8ca143d4
- AGG-7 (Chat widget ARIA role): Fixed in commit 16cf7ecf

## Deduped Findings (sorted by severity then signal)

### AGG-1: Import engine TABLE_MAP and export TABLE_ORDER are independently maintained — schema drift risk [MEDIUM/HIGH]

**Flagged by:** code-reviewer (CR-2), architect (ARCH-1), critic (CRI-1), debugger (DBG-2), tracer (TR-2), verifier (V-1), test-engineer (TE-1), document-specialist (DOC-3)
**Signal strength:** 8 of 11 review perspectives

**File:** `src/lib/db/import.ts:15-55`, `src/lib/db/export.ts:156-202`

**Description:** The import engine uses `TABLE_MAP` (a `Record<string, any>`) and the export engine uses `TABLE_ORDER` (an ordered array). These are independently maintained lists that must stay in sync with each other and with the schema. If a table is added to the schema but only to one list, exports will include data that imports silently skip, or vice versa. The import side silently skips unknown tables (line 183: `if (!table) continue`), so data loss is invisible. No compile-time or runtime check exists to detect drift.

**Concrete failure scenario:** A developer adds a `contestAnnouncements` table to the schema and to `TABLE_ORDER` for export but forgets `TABLE_MAP` for import. An export includes the table with 500 rows, but an import silently skips it. The imported database is missing all announcement data with no error.

**Fix:** Derive `TABLE_MAP` from `TABLE_ORDER` so they cannot drift:
```typescript
// In import.ts
import { TABLE_ORDER } from "./export";

const TABLE_MAP: Record<string, any> = {};
for (const { name, table } of TABLE_ORDER) {
  TABLE_MAP[name] = table;
}
```

Additionally, add a startup validation test that verifies both lists match the schema.

---

### AGG-2: Chat widget `sendMessage` includes `isStreaming` in dependency array — stale closure race and unnecessary callback chain recreation [MEDIUM/MEDIUM]

**Flagged by:** code-reviewer (CR-1), perf-reviewer (PERF-2), critic (CRI-2), debugger (DBG-1), tracer (TR-1)
**Signal strength:** 5 of 11 review perspectives

**File:** `src/lib/plugins/chat-widget/chat-widget.tsx:237`

**Description:** The `sendMessage` callback has `isStreaming` in its dependency array and also checks `if (!text || isStreaming) return` at the top. The `isStreaming` dependency causes `sendMessage` to be recreated on every streaming state change, which cascades to `sendMessageRef`, `handleSend`, and `handleKeyDown` recreation. Additionally, the tracer identified a stale-closure race: after abort, `setIsStreaming(false)` in the `finally` block may not have triggered a re-render before the user's next click fires the old `sendMessage` closure, causing a false rejection of a valid message.

**Concrete failure scenario:** User is streaming an AI response, aborts, then immediately sends another message. The old `sendMessage` closure still has `isStreaming=true`, so the message is incorrectly rejected. On slow devices, this race is more likely.

**Fix:** Use a ref for the `isStreaming` check:
```tsx
const isStreamingRef = useRef(isStreaming);
useEffect(() => { isStreamingRef.current = isStreaming; }, [isStreaming]);

const sendMessage = useCallback(async (text: string, displayText?: string) => {
  if (!text || isStreamingRef.current) return;
  // ...rest unchanged, remove isStreaming from dependency array
}, [editorContent?.code, editorContent?.language, problemContext, sessionId, t]);
```

---

### AGG-3: Duplicate password rehash logic across three locations — DRY violation with inconsistent audit coverage [LOW/MEDIUM]

**Flagged by:** code-reviewer (CR-3), architect (ARCH-2), security-reviewer (SEC-2), critic (CRI-3 implicit)
**Signal strength:** 4 of 11 review perspectives

**File:** `src/app/api/v1/admin/migrate/import/route.ts:64-74, 164-174`, `src/app/api/v1/admin/restore/route.ts:63-73`

**Description:** The exact same password verification + transparent rehash logic (verify password, check needsRehash, hashPassword, update DB) is duplicated three times. This creates maintenance risk and means none of the three locations log the rehash event, which is an audit coverage gap.

**Concrete failure scenario:** A developer adds audit logging for rehash events in one location but forgets the other two. One path now logs rehashes, the other two don't.

**Fix:** Extract to a shared utility `verifyAndRehashPassword()` in `src/lib/security/password-hash.ts` with built-in audit logging.

---

### AGG-4: SSE cleanup timer calls `getConfiguredSettings()` every 60s — unnecessary repeated cost [LOW/MEDIUM]

**Flagged by:** perf-reviewer (PERF-1)
**Signal strength:** 1 of 11 review perspectives

**File:** `src/app/api/v1/submissions/[id]/events/route.ts:82-91`

**Description:** The global SSE cleanup `setInterval` calls `getConfiguredSettings()` on every 60-second tick. The setting rarely changes and should be cached with a TTL.

**Fix:** Cache the stale threshold with a 5-minute TTL.

---

### AGG-5: Import route JSON body path sends password in plaintext — log/middleware exposure risk [MEDIUM/MEDIUM]

**Flagged by:** security-reviewer (SEC-1), critic (CRI-3)
**Signal strength:** 2 of 11 review perspectives

**File:** `src/app/api/v1/admin/migrate/import/route.ts:127-183`

**Description:** The JSON body path for the import route accepts `{ password, data: {...} }` in the request body. The admin's password is transmitted as a JSON field, which could be logged by request-logging middleware, load balancers, or CDN access logs. The multipart/form-data path is safer.

**Fix:** Deprecate the JSON body path and require multipart/form-data for all imports. Add a deprecation warning header for the JSON path while it remains for backward compatibility.

---

### AGG-6: Chat widget entry animation ignores `prefers-reduced-motion` [LOW/MEDIUM]

**Flagged by:** code-reviewer (CR-4), designer (DES-1), critic (CRI-4)
**Signal strength:** 3 of 11 review perspectives

**File:** `src/lib/plugins/chat-widget/chat-widget.tsx:288`

**Description:** The chat widget container uses `animate-in fade-in slide-in-from-bottom-4 duration-200` for its entry animation. The typing indicator dots correctly use `motion-safe:animate-bounce`, but the entry animation does not respect `prefers-reduced-motion`.

**Fix:** Add a CSS override in `globals.css` to disable `animate-in` under `prefers-reduced-motion: reduce`.

---

### AGG-7: No test coverage for TABLE_MAP/TABLE_ORDER consistency [MEDIUM/MEDIUM]

**Flagged by:** test-engineer (TE-1)
**Signal strength:** 1 of 11 review perspectives

**File:** `tests/unit/db/import-implementation.test.ts`

**Description:** There is no test that verifies `TABLE_MAP` keys match `TABLE_ORDER` entries. Schema drift between the lists would not be caught by CI.

**Fix:** Add a test:
```typescript
test("TABLE_MAP and TABLE_ORDER are consistent", () => {
  const mapKeys = new Set(Object.keys(TABLE_MAP));
  const orderNames = new Set(TABLE_ORDER.map(t => t.name));
  expect(mapKeys).toEqual(orderNames);
});
```

---

## Carry-Over Items (Still Unfixed from Prior Cycles)

These items were identified in prior cycles and remain unfixed. They are not counted as new findings.

- **Prior AGG-6:** Chat widget scrolls on every streaming chunk (mitigated with rAF, may still need throttling)

## Deferred Items (Low Signal / Cosmetic)

- **DES-2:** Chat widget textarea lacks explicit `aria-label` (placeholder present as fallback)
- **DOC-1:** SSE route missing architectural decision record
- **DOC-2:** Docker client dual-path behavior not documented
- **DOC-3:** Import engine TABLE_MAP drift warning comment
- **PERF-3:** In-memory rate limiter FIFO sort on overflow (bounded by 10K cap)
- **TE-2:** No component test for chat widget sendMessage isStreaming guard
- **TE-3:** No test for SSE cleanup NaN guard
