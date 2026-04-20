# Document Specialist

**Date:** 2026-04-20
**Base commit:** 52d81f9d
**Angle:** Documentation-code mismatches against authoritative sources

## Inventory
- Repo rules: `AGENTS.md`, `CLAUDE.md`
- User-facing tests/specs: `tests/component/pagination-controls.test.tsx`, `tests/e2e/public-shell.spec.ts`
- Current public-shell implementation and live behavior

## F1: The component test suite documents the wrong rendering contract for `PaginationControls`
- **File:** `tests/component/pagination-controls.test.tsx:34-68`
- **Severity:** MEDIUM
- **Confidence:** HIGH
- **Status:** confirmed issue
- **Description:** The test suite treats `PaginationControls` as an awaitable async function with server-side translations. That is not the valid contract for a client component in the real app.
- **Concrete mismatch scenario:** Contributors reading the test file are taught to preserve the broken API shape that currently crashes live routes.
- **Suggested fix:** Update the test to match the real client-component contract after the component is fixed.

## F2: Repo intent says public nav is centralized, but the home / 404 pages still maintain their own divergent header wiring
- **File:** `src/lib/navigation/public-nav.ts:1-17`, `src/app/page.tsx:88-103`, `src/app/not-found.tsx:45-60`
- **Severity:** MEDIUM
- **Confidence:** HIGH
- **Status:** confirmed issue
- **Description:** The comment in `public-nav.ts` says the nav definitions are centralized so they stay in sync automatically, but the home and 404 pages still bypass that centralization.
- **Concrete mismatch scenario:** The comment promises one source of truth while the actual implementation has at least three.
- **Suggested fix:** Either fully centralize those entry points or narrow the comment so it matches reality.

## Final sweep
- The strongest doc/code mismatches this cycle are in executable documentation (tests/comments), not in README prose.
