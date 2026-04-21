# RPF Cycle 1 — Aggregate Review

**Date:** 2026-04-22
**Base commit:** 9683acb8
**Review artifacts:** rpf-cycle-1-code-reviewer.md, rpf-cycle-1-security-reviewer.md, rpf-cycle-1-perf-reviewer.md, rpf-cycle-1-architect.md, rpf-cycle-1-critic.md, rpf-cycle-1-debugger.md, rpf-cycle-1-verifier.md, rpf-cycle-1-test-engineer.md, rpf-cycle-1-tracer.md, rpf-cycle-1-designer.md, rpf-cycle-1-document-specialist.md

## Deduped Findings (sorted by severity then signal)

### AGG-1: Clipboard copy logic duplicated in 7+ components — no shared utility, inconsistent fallback pattern [MEDIUM/HIGH]

**Flagged by:** code-reviewer (CR-1), security-reviewer (SEC-1), architect (ARCH-1), critic (CRI-1), debugger (DBG-1), verifier (V-1), tracer (TR-1)
**Files:**
- `src/components/code/copy-code-button.tsx:18-40` — has full fallback
- `src/app/(dashboard)/dashboard/admin/api-keys/api-keys-client.tsx:210-240` — has full fallback
- `src/components/contest/access-code-manager.tsx:60-67` — no fallback
- `src/app/(dashboard)/dashboard/admin/workers/workers-client.tsx:157-165` — no fallback
- `src/app/(dashboard)/dashboard/admin/files/file-management-client.tsx:98` — no fallback
- `src/components/contest/recruiting-invitations-panel.tsx:183` — has catch but no fallback
- `src/components/contest/recruiting-invitations-panel.tsx:208,311` — NO catch, NO fallback (unhandled rejection)
- `src/app/(dashboard)/dashboard/admin/api-keys/api-keys-client.tsx:197` — no fallback

**Description:** The clipboard copy pattern (navigator.clipboard -> execCommand fallback -> error toast) is implemented correctly in 2 places but partially in 5+ others. Two call sites in `recruiting-invitations-panel.tsx` (lines 208, 311) have no error handling at all, causing unhandled promise rejections on failure. This is the highest-signal issue this cycle -- flagged by 7 of 11 review perspectives.

**Concrete failure scenario:** On a restricted browser (no clipboard API), clicking "Copy invitation link" causes an unhandled promise rejection. The user sees no feedback and assumes the link was copied.

**Fix:** Create a shared `copyToClipboard(text)` utility in `src/lib/clipboard.ts` based on the `copy-code-button.tsx` pattern, and replace all ad-hoc clipboard calls.

---

### AGG-2: Contest layout forces full page reload for ALL internal links -- destroys SPA navigation [MEDIUM/HIGH]

**Flagged by:** architect (ARCH-2), perf-reviewer (PERF-4), critic (CRI-2), designer (DES-1), tracer (TR-2), verifier (V-4)
**Files:** `src/app/(dashboard)/dashboard/contests/layout.tsx:20-31`

**Description:** The contest layout intercepts ALL `<a>` clicks within `#main-content` and `[data-slot='sidebar']` and forces `window.location.href = href`, causing full page reloads. This defeats Next.js App Router's prefetching, client-side navigation, and shared layout features. It impacts LCP, CLS, and INP metrics, and makes every in-contest navigation feel slow.

**Concrete failure scenario:** A contest participant clicks "Problems" from the sidebar -- instead of instant client-side navigation, the entire page reloads, losing all React state and prefetched data.

**Fix:** Replace the blanket approach with selective `forceNavigate` calls. Add a `data-full-navigate` attribute to links that genuinely need hard navigation, and only intercept those.

---

### AGG-3: `use-source-draft.ts` localStorage.removeItem calls not wrapped in try/catch -- data loss risk [MEDIUM/MEDIUM]

**Flagged by:** debugger (DBG-2), tracer (TR-3)
**Files:** `src/hooks/use-source-draft.ts:188,205,409`

**Description:** In `readDraftPayload`, `window.localStorage.removeItem(storageKey)` is called on lines 188 and 205 without try/catch. The outer try/catch on line 213 WILL catch the throw, but it causes the function to return `createEmptyDraftState()` even when the draft data was valid -- just the cleanup of a stale key failed. Similarly, `clearAllDrafts` at line 409 calls `removeItem` without try/catch.

**Concrete failure scenario:** In private browsing mode where `removeItem` throws, a user's valid draft data is lost because the outer catch discards the entire payload when only the cleanup operation failed.

**Fix:** Wrap specific `removeItem` calls in their own try/catch, allowing the function to continue even if cleanup fails.

---

### AGG-4: `recruiting-invitations-panel.tsx` lines 208, 311 -- unhandled promise rejection on clipboard failure [MEDIUM/MEDIUM]

**Flagged by:** debugger (DBG-1), security-reviewer (SEC-1), tracer (TR-1)

**Description:** Two `navigator.clipboard.writeText()` calls have no `catch` block. If the clipboard API throws, the promise rejection is unhandled, showing no feedback to the user. (This will be fixed by AGG-1's shared clipboard utility.)

**Fix:** Add `catch` blocks showing `toast.error(t("copyError"))` matching the pattern at line 183. Or better, use the shared clipboard utility from AGG-1.

---

### AGG-5: `compiler-client.tsx` has 16 remaining `defaultValue` inline fallbacks -- i18n adoption incomplete [LOW/MEDIUM]

**Flagged by:** code-reviewer (CR-2), verifier (V-3), document-specialist (DOC-1)
**Files:** `src/components/code/compiler-client.tsx:377-536`

**Description:** The recent diff correctly removed `defaultValue` from 6 `t()` calls, but 16 remain. This is inconsistent -- the file should either use all `defaultValue` or none. The `next-intl` documentation recommends removing `defaultValue` from production code once translations are confirmed.

**Fix:** Remove all remaining `defaultValue` inline fallbacks after confirming all keys exist in locale JSON files.

---

### AGG-6: `submission-detail-client.tsx` score display uses inline `Math.round` instead of `formatScore` [LOW/MEDIUM]

**Flagged by:** code-reviewer (CR-5)
**Files:** `src/app/(dashboard)/dashboard/submissions/[id]/submission-detail-client.tsx:263`

**Description:** The score is formatted as `Math.round(submission.score * 100) / 100` inline, while `formatScore` from `@/lib/formatting` does the same thing with locale-aware digit grouping.

**Fix:** Import and use `formatScore(submission.score, locale)` instead of the inline calculation.

---

### AGG-7: `compiler-client.tsx` keyboard shortcut fires even when focus is in textarea/input [LOW/MEDIUM]

**Flagged by:** debugger (DBG-3), test-engineer (TE-2)
**Files:** `src/components/code/compiler-client.tsx:303-312`

**Description:** The `Ctrl/Cmd+Enter` shortcut fires `handleRun` regardless of whether the user is typing in the test case name input or the stdin textarea. If a user types Ctrl+Enter in the stdin textarea, it prevents the default (no newline) AND triggers code execution.

**Fix:** Check if the active element is a textarea or contenteditable, and only run the shortcut if focus is in the code editor or no specific input is focused.

---

### AGG-8: Practice page Path B progress filter still fetches all matching IDs + submissions into memory [MEDIUM/MEDIUM] (carried forward)

**Flagged by:** perf-reviewer (PERF-1)
**Files:** `src/app/(public)/practice/page.tsx:410-519`

**Description:** Carried forward from cycle 18 (AGG-3). When a progress filter is active, Path B fetches ALL matching problem IDs and ALL user submissions into memory, filters in JavaScript, and paginates. The code has a comment acknowledging this should be moved to SQL.

**Fix:** Move the progress filter logic into a SQL CTE or subquery. Scale concern, not an immediate bug.

---

### AGG-9: `SubmissionListAutoRefresh` lacks error-state backoff [LOW/LOW] (carried forward)

**Flagged by:** perf-reviewer (PERF-2)
**Files:** `src/components/submission-list-auto-refresh.tsx:24-28`

**Description:** The auto-refresh component polls at fixed intervals without error handling or backoff. During server overload, this could worsen the load.

**Fix:** Add error-state tracking and switch to longer intervals on consecutive failures.

---

### AGG-10: Anti-cheat privacy notice uses raw `<button>` instead of `<Button>` component [LOW/LOW]

**Flagged by:** designer (DES-3)
**Files:** `src/components/exam/anti-cheat-monitor.tsx:244-248`

**Description:** The privacy notice "Accept" button uses a raw `<button>` with inline Tailwind classes instead of the `Button` component, missing shared focus ring, disabled state, and animation styles.

**Fix:** Replace the raw `<button>` with `<Button variant="default" className="w-full">`.

---

### AGG-11: `access-code-manager.test.tsx` test name implies `execCommand` fallback exists but component doesn't have it [LOW/MEDIUM]

**Flagged by:** test-engineer (TE-3)
**Files:** `tests/component/access-code-manager.test.tsx:83`, `src/components/contest/access-code-manager.tsx:60-67`

**Description:** The test name says "shows an explicit error when clipboard access fails instead of using execCommand fallback", but the component doesn't actually attempt an `execCommand` fallback -- it just shows an error toast. The test name is misleading.

**Fix:** Either add the `execCommand` fallback to the component (per AGG-1) or update the test name to match the current behavior.

---

## Previously Deferred Items (Carried Forward)

From cycle-27 aggregate and prior cycles:
- DEFER-1: Migrate raw route handlers to `createApiHandler` (22 routes)
- DEFER-2: SSE connection tracking eviction optimization
- DEFER-3: SSE connection cleanup test coverage

From earlier cycles (still active):
- D1: JWT authenticatedAt clock skew with DB tokenInvalidatedAt (MEDIUM)
- D2: JWT callback DB query on every request -- add TTL cache (MEDIUM)
- A19: `new Date()` clock skew risk in remaining routes (LOW)

## Resolved Issues

- `formatNumber` placement in `datetime.ts` -- CONFIRMED RESOLVED. The utility is now correctly in `src/lib/formatting.ts`.

## Verified Safe / No Regression Found

- All recent localStorage try/catch additions are correct
- The `defaultValue` removals in compiler-client.tsx are safe
- `copy-code-button.tsx` and `api-keys-client.tsx` clipboard patterns are robust
- `formatting.ts` utilities are well-structured with locale support
- `dangerouslySetInnerHTML` uses are protected with DOMPurify
- No `as any`, `@ts-ignore`, `@ts-expect-error` in production code
- Only 2 eslint-disable directives in production code, both justified
- Auth flow uses Argon2id with timing-safe dummy hash and rate limiting
- CSRF protection consistent across mutation routes
- All `new Date()` in API routes migrated to `getDbNowUncached()`

## Agent Failures

None. All 11 review perspectives completed successfully.
