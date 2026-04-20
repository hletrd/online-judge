# Cycle 23 Performance Review

**Date:** 2026-04-20
**Reviewer:** perf-reviewer
**Base commit:** 86e7caf7

## Findings

### PERF-1: Control layout makes sequential await calls that could be parallelized [LOW/MEDIUM]

**File:** `src/app/(control)/layout.tsx:32-40`
**Description:** The control layout first awaits `auth()`, then `resolveCapabilities()`, then in a separate `Promise.all` awaits `getTranslations("common")`, `getTranslations("nav")`, `getTranslations("controlShell")`, and finally `getResolvedSystemSettings()`. The capabilities and translations could be fetched in parallel since they don't depend on each other (the translations don't need capabilities, and vice versa). The dashboard layout already parallelizes these correctly.
**Concrete failure scenario:** Serial awaits add unnecessary latency to the control layout's server rendering, adding roughly 20-50ms on a cold cache compared to the dashboard layout's parallel approach.
**Confidence:** Low
**Fix:** When merging control into dashboard, this becomes moot since the dashboard layout already parallelizes correctly. No standalone fix needed.

### PERF-2: Control home page makes redundant auth() call [LOW/LOW]

**File:** `src/app/(control)/control/page.tsx:8-11`
**Description:** The control home page calls `auth()` and `resolveCapabilities()` independently, even though the parent layout already called both and checked capabilities. This is a redundant database query per request.
**Concrete failure scenario:** Minor latency increase from duplicate auth lookups on every `/control` page load.
**Confidence:** Low
**Fix:** When merging control into dashboard, use the dashboard layout's session context instead. No standalone fix needed since the control group will be removed.

## Verified Safe

- Dashboard layout correctly parallelizes data fetching with `Promise.all`.
- Public layout correctly parallelizes translations and session resolution.
- Proxy auth cache uses FIFO eviction with 2-second TTL, appropriate for the security/performance tradeoff.
