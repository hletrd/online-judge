# Tracer

**Date:** 2026-04-20
**Base commit:** 52d81f9d
**Angle:** Causal tracing of suspicious flows and competing hypotheses

## Inventory
- Traced the live failures from browser symptoms back through the shared public route tree
- Compared competing hypotheses across `/practice`, `/rankings`, and the home-page header

## F1: Best-fit causal chain for `/practice` + `/rankings` outages points to `PaginationControls`
- **File:** `src/components/pagination-controls.tsx:1-60`
- **Severity:** HIGH
- **Confidence:** HIGH
- **Status:** confirmed issue
- **Causal chain:**
  1. Live browser audit shows `/practice` and `/rankings` both fail with the same public server-error shell.
  2. The two pages otherwise use different data sources and rendering logic.
  3. Both pages share `PaginationControls`.
  4. `PaginationControls` is a client component that is declared async and awaits a server-only translation helper.
  5. That invalid boundary explains a shared render-time crash without needing a database-specific hypothesis.
- **Suggested fix:** Refactor `PaginationControls` to a synchronous client component using client-safe translations.

## F2: The workspace-label regression traces to entry-point drift, not missing translation keys at HEAD
- **File:** `src/app/page.tsx:98-103`, `src/app/not-found.tsx:55-60`, `src/app/(public)/layout.tsx:22-31`
- **Severity:** MEDIUM
- **Confidence:** HIGH
- **Status:** confirmed issue
- **Causal chain:**
  1. Live home shows `publicShell.nav.workspace`.
  2. The repo still hard-codes `nav.workspace` on the home and 404 pages.
  3. The normal public layout already uses `nav.dashboard`.
  4. Therefore the remaining regression is explained by duplicated, unsynchronized entry-point config.
- **Suggested fix:** Reuse the shared public-layout/nav path for those entry points.

## Final sweep
- Competing hypotheses involving the login flow or a missing translation key at HEAD were weaker than the confirmed shared-component and duplicated-config explanations.
