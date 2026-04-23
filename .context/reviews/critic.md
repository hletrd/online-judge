# Critic Review — RPF Cycle 34

**Date:** 2026-04-23
**Reviewer:** critic
**Base commit:** 16cf7ecf

## Multi-Perspective Critique

This review examines the change surface from multiple angles: correctness, security, maintainability, UX, and operational safety.

### CRI-1: Import engine TABLE_MAP/EXPORT TABLE_ORDER drift — systematic risk [MEDIUM/MEDIUM]

**File:** `src/lib/db/import.ts:15-55`, `src/lib/db/export.ts:156-202`

**Description:** Two independently maintained lists (`TABLE_MAP` in import, `TABLE_ORDER` in export) must stay in sync with the schema. The drift risk is real: a developer adding a new table to the schema must update both lists. The import side silently skips unknown tables (line 183: `if (!table) continue`), so data loss is invisible. This is the highest-priority carry-over finding from prior cycles.

**Confidence:** High

---

### CRI-2: Chat widget `sendMessage` dependency on `isStreaming` — callback instability [LOW/MEDIUM]

**File:** `src/lib/plugins/chat-widget/chat-widget.tsx:237`

**Description:** The `isStreaming` state variable in the `sendMessage` dependency array causes the entire callback chain (`sendMessage` -> `sendMessageRef` -> `handleSend` -> `handleKeyDown`) to be recreated on every streaming state transition. While not a correctness bug, it's a wasteful pattern that's easy to fix with a ref. This is a carry-over from AGG-4 in cycle 33.

**Confidence:** High

---

### CRI-3: Import route JSON body path sends password in plaintext — operational risk [MEDIUM/MEDIUM]

**File:** `src/app/api/v1/admin/migrate/import/route.ts:127-183`

**Description:** The JSON body path for the import route includes the admin password as a JSON field. This is less secure than the multipart/form-data path because request bodies can be logged by reverse proxies, load balancers, or CDN access logs. This is a carry-over from AGG-7 in cycle 33. The fix is straightforward: deprecate the JSON path and require multipart/form-data.

**Confidence:** Medium

---

### CRI-4: Chat widget entry animation does not respect `prefers-reduced-motion` [LOW/LOW]

**File:** `src/lib/plugins/chat-widget/chat-widget.tsx:288`

**Description:** The chat widget uses `animate-in fade-in slide-in-from-bottom-4 duration-200` for its entry animation. The typing indicator correctly uses `motion-safe:animate-bounce`, but the entry animation does not respect the reduced-motion preference. This is a carry-over from AGG-3 in cycle 33.

**Confidence:** High

---

### Positive Observations

- The NaN guard for SSE stale threshold (AGG-3, fixed in 8ca143d4) is well-implemented with a sensible fallback.
- The ARIA role addition for the chat widget messages container (AGG-7, fixed in 16cf7ecf) is correct.
- The password rehash logic, while duplicated, is correct in all three locations — the algorithm and argon2id parameters are consistent.
