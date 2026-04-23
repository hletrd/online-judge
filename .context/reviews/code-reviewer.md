# Code Review — RPF Cycle 34

**Date:** 2026-04-23
**Reviewer:** code-reviewer
**Base commit:** 16cf7ecf

## Inventory of Files Reviewed

- `src/app/api/v1/` — All API route handlers (85+ routes)
- `src/lib/` — Business logic (auth, db, docker, judge, security, plugins, etc.)
- `src/lib/plugins/chat-widget/` — Chat widget component, tools, route
- `src/lib/db/` — Schema, queries, import/export, import-transfer
- `src/lib/security/` — Rate limiting, CSRF, password hash, sanitize-html
- `src/lib/compiler/` — Execute, catalog
- `src/lib/docker/` — Client, image validation

## Findings

### CR-1: Chat widget `sendMessage` still includes `isStreaming` in dependency array — unstable callback chain [MEDIUM/MEDIUM]

**File:** `src/lib/plugins/chat-widget/chat-widget.tsx:237`

**Description:** The `sendMessage` callback has `isStreaming` in its dependency array. This causes `sendMessage` to be recreated on every streaming state change (every SSE chunk), which cascades to `sendMessageRef` update via the useEffect on line 240, `handleSend` recreation (line 242-244), and `handleKeyDown` recreation (line 246-254). This was identified as AGG-4 in cycle 33 but remains unfixed. Using a ref for the streaming guard would stabilize the entire callback chain and avoid unnecessary re-renders.

**Concrete failure scenario:** During streaming of an AI response, every chunk triggers `setIsStreaming(true)`, which recreates `sendMessage`, `handleSend`, and `handleKeyDown`. On a fast connection with 50+ chunks per second, this causes 50+ callback recreations per second.

**Fix:** Replace `isStreaming` dependency with a ref:
```tsx
const isStreamingRef = useRef(isStreaming);
useEffect(() => { isStreamingRef.current = isStreaming; }, [isStreaming]);

const sendMessage = useCallback(async (text: string, displayText?: string) => {
  if (!text || isStreamingRef.current) return;
  // ...rest unchanged, remove isStreaming from dependency array
}, [editorContent?.code, editorContent?.language, problemContext, sessionId, t]);
```

**Confidence:** High

---

### CR-2: Import engine `TABLE_MAP` uses `any` type — schema drift risk with no compile-time check [MEDIUM/MEDIUM]

**File:** `src/lib/db/import.ts:15-55`

**Description:** The `TABLE_MAP` is a manually maintained mapping of table names to Drizzle table objects typed as `Record<string, any>`. If a new table is added to `schema.pg.ts` but not to `TABLE_MAP`, imports will silently skip that table's data. No compile-time or runtime check exists to detect this drift. The `TABLE_ORDER` in `export.ts` (line 156) has the same problem but is a separate list. This was identified as AGG-6 in cycle 33 but remains unfixed.

**Concrete failure scenario:** A developer adds a `contestAnnouncements` table to the schema but forgets to add it to `TABLE_MAP`. An export includes the table, but an import silently skips it. The imported database is missing all announcement data with no error.

**Fix:** Add a startup validation that compares `TABLE_MAP` keys against the schema's exported tables:
```typescript
import * as schema from "./schema";

const schemaTableNames = new Set(
  Object.keys(schema).filter(k => {
    const val = (schema as Record<string, unknown>)[k];
    return typeof val === "object" && val !== null && "dbType" in (val as object);
  })
);

for (const name of schemaTableNames) {
  if (!TABLE_MAP[name]) {
    logger.error({ tableName: name }, "[import] Schema table missing from TABLE_MAP — imports will skip this table");
  }
}
```

**Confidence:** High

---

### CR-3: Duplicate password rehash logic across three files — violates DRY [LOW/MEDIUM]

**File:** `src/app/api/v1/admin/migrate/import/route.ts:64-74, 164-174`, `src/app/api/v1/admin/restore/route.ts:63-73`

**Description:** The exact same password rehash logic (verify password, check needsRehash, hashPassword, update DB) is duplicated three times — twice in the migrate/import route (for formData and JSON paths) and once in the restore route. This was identified as AGG-5 in cycle 33 but remains unfixed.

**Concrete failure scenario:** A developer changes the rehash logic in one location (e.g., adds audit logging) but forgets the other two. One path now logs rehashes, the other two don't.

**Fix:** Extract to a shared utility:
```typescript
// src/lib/security/password-hash.ts
export async function verifyAndRehashPassword(
  password: string,
  userId: string,
  storedHash: string
): Promise<{ valid: boolean }> {
  const { valid, needsRehash } = await verifyPassword(password, storedHash);
  if (valid && needsRehash) {
    try {
      const newHash = await hashPassword(password);
      await db.update(users).set({ passwordHash: newHash }).where(eq(users.id, userId));
    } catch (err) {
      logger.error({ err, userId }, "[password-rehash] Failed to rehash password");
    }
  }
  return { valid };
}
```

**Confidence:** High

---

### CR-4: Chat widget `animate-in slide-in-from-bottom-4` entry animation not respecting `prefers-reduced-motion` [LOW/MEDIUM]

**File:** `src/lib/plugins/chat-widget/chat-widget.tsx:288`

**Description:** The chat widget container uses `animate-in fade-in slide-in-from-bottom-4 duration-200` for its entry animation. While Tailwind's `motion-safe:` prefix is used for the typing indicator (line 339), the entry animation does not respect `prefers-reduced-motion`. This was identified as prior AGG-3 in cycle 33 but remains unfixed.

**Concrete failure scenario:** A user with vestibular disorders has `prefers-reduced-motion: reduce` enabled. The chat widget slides in from the bottom with a 200ms animation, causing discomfort.

**Fix:** Either use `motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-4` or add a CSS override in `globals.css` (which already has a `prefers-reduced-motion: reduce` section at line 138).

**Confidence:** High

---

### Previously Known Items (Verified Fixed)

- AGG-1 (Docker client remote path error leak): Fixed in commit 5527e96b
- AGG-2 (Compiler spawn error leak): Fixed in commit 46ba5e0c
- AGG-3 (SSE NaN guard): Fixed in commit 8ca143d4
- AGG-7 (Chat widget ARIA role): Fixed in commit 16cf7ecf
