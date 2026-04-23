# Tracer Review — RPF Cycle 21

**Date:** 2026-04-22
**Reviewer:** tracer
**Base commit:** 4b9d48f0

## TR-1: `anti-cheat-dashboard.tsx` `formatDetailsJson` diverges — causal trace [MEDIUM/HIGH]

**File:** `src/components/contest/anti-cheat-dashboard.tsx:91-97`
**Confidence:** HIGH

**Trace:**
1. Anti-cheat event is created with details: `{"target": "code-editor", "timestamp": "2026-04-22T10:00:00Z"}`
2. Instructor opens anti-cheat dashboard for a contest
3. `AntiCheatDashboard` component loads, uses `formatDetailsJson` at line 91
4. The function calls `JSON.stringify(JSON.parse(raw), null, 2)` — returns pretty-printed JSON
5. Instructor sees: `{"target": "code-editor", "timestamp": "2026-04-22T10:00:00Z"}`
6. Instructor clicks through to participant timeline for the same student
7. `ParticipantAntiCheatTimeline` component loads, uses `formatDetailsJson(raw, t)` at line 45
8. The function parses JSON, finds `parsed.target`, looks up i18n key `detailTargets.code-editor`
9. Returns `${t("detailTargetLabel")}: ${label}` — "Target: Code editor" (English) or "대상: 코드 편집기" (Korean)
10. Instructor sees: "Target: Code editor"

**Hypothesis confirmed:** The same event data is displayed inconsistently across two views because one `formatDetailsJson` was migrated and the other was not.

**Fix:** Migrate the dashboard's `formatDetailsJson` to match the timeline's i18n-aware version.

---

## TR-2: `role-editor-dialog.tsx` level input `Number()` NaN propagation — causal trace [LOW/MEDIUM]

**File:** `src/app/(dashboard)/dashboard/admin/roles/role-editor-dialog.tsx:187`

**Trace:**
1. Admin opens role editor dialog to create a new role
2. Types "2" in level field — `Number("2")` = 2 — correct
3. Clears the level field — `Number("")` = 0 — sets level to 0 (valid but perhaps unintended)
4. Pastes "abc" — `Number("abc")` = NaN
5. Clicks "Create" — form submits with `level: NaN`
6. `JSON.stringify({level: NaN})` produces `{"level":null}` (JSON spec: NaN becomes null)
7. Server receives `level: null` — but the Zod schema `z.number().int().min(0).max(2)` expects a number, not null
8. Server returns 400 validation error

**Alternative trace (if using parseInt):**
1. Same steps 1-4
2. `parseInt("abc", 10)` = NaN, `NaN || 0` = 0
3. Form submits with `level: 0` — valid, passes server validation

**Fix:** Use `parseInt(e.target.value, 10) || 0` matching established pattern.

---

## TR-3: `forceNavigate` call sites — confirmed safe [NO ISSUE]

**File:** `src/lib/navigation/client.ts:3-5`

Re-traced from cycle 18. Both call sites remain justified:
- `src/app/(dashboard)/dashboard/contests/layout.tsx:37` — opt-in data attribute
- `src/app/(dashboard)/dashboard/contests/join/contest-join-client.tsx:23` — RSC streaming bug workaround
