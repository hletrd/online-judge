# Test Engineer Review — RPF Cycle 34

**Date:** 2026-04-23
**Reviewer:** test-engineer
**Base commit:** 16cf7ecf

## Inventory of Files Reviewed

- `tests/unit/` — Unit tests
- `tests/integration/` — Integration tests
- `tests/component/` — Component tests
- `src/lib/db/import.ts` — Import engine (test coverage gap)
- `src/lib/plugins/chat-widget/chat-widget.tsx` — Chat widget (test coverage gap)
- `src/app/api/v1/submissions/[id]/events/route.ts` — SSE route (test coverage gap)

## Findings

### TE-1: No test for import engine TABLE_MAP/EXPORT TABLE_ORDER drift detection [MEDIUM/MEDIUM]

**File:** `tests/unit/db/import-implementation.test.ts` (existing), `src/lib/db/import.ts`

**Description:** While there is a `import-implementation.test.ts` that tests import functionality, there is no test that verifies `TABLE_MAP` keys match `TABLE_ORDER` entries or that both match the exported schema tables. This means schema drift between the three lists (schema, TABLE_MAP, TABLE_ORDER) would not be caught by CI.

**Concrete failure scenario:** A developer adds a table to the schema and `TABLE_ORDER` but forgets `TABLE_MAP`. CI passes because no test checks for consistency. The drift reaches production.

**Fix:** Add a test that verifies:
1. Every key in `TABLE_MAP` appears in `TABLE_ORDER`
2. Every table name in `TABLE_ORDER` appears in `TABLE_MAP`
3. The total count matches

```typescript
test("TABLE_MAP and TABLE_ORDER are consistent", () => {
  const mapKeys = new Set(Object.keys(TABLE_MAP));
  const orderNames = new Set(TABLE_ORDER.map(t => t.name));
  expect(mapKeys).toEqual(orderNames);
});
```

**Confidence:** High

---

### TE-2: No test for chat widget sendMessage isStreaming guard behavior [LOW/MEDIUM]

**File:** `src/lib/plugins/chat-widget/chat-widget.tsx`

**Description:** There are tests for chat widget tools and plugins, but no component test that verifies the `sendMessage` callback correctly guards against double-submission when `isStreaming` is true. A refactoring (e.g., switching `isStreaming` from dependency array to ref) should be covered by a regression test.

**Fix:** Add a component test that:
1. Renders the chat widget
2. Starts a message send
3. Attempts to send again while streaming
4. Verifies the second send is blocked

**Confidence:** Medium

---

### TE-3: No test for SSE cleanup NaN guard [LOW/LOW]

**File:** `src/app/api/v1/submissions/[id]/events/route.ts:86-88`

**Description:** The NaN guard added in commit 8ca143d4 is untested. If someone refactors the cleanup code and breaks the guard, there is no CI signal.

**Fix:** Add a unit test that verifies `getStaleThreshold()` returns the fallback value when `sseTimeoutMs` is NaN or undefined.

**Confidence:** Low
