# Debugger Review — RPF Cycle 28 (Fresh)

**Date:** 2026-04-23
**Reviewer:** debugger
**Base commit:** 63557cc2

## Previously Fixed Items (Verified)

- localStorage crash in compiler-client: Fixed (try/catch at line 188)
- localStorage crash in submission-detail-client: Fixed (try/catch at line 94)
- Double `.json()` latent bug in 3 files: Fixed
- admin-config double `.json()`: Fixed
- handleResetAccountPassword missing fetchAll: Fixed
- quick-stats redundant `!` assertions: Fixed

## DBG-1: `contest-replay.tsx` setInterval drift — carried from cycle 26 [LOW/LOW]

**File:** `src/components/contest/contest-replay.tsx:77-87`

The auto-play uses `setInterval` which can accumulate drift. The callback increments `currentIndex` by 1 each tick, and the interval is `1400 / speed` ms. With `setInterval`, if a callback takes longer than expected (e.g., due to tab throttling), the next callback fires immediately after the previous one completes, causing "catch-up" behavior. With recursive `setTimeout`, each tick is spaced consistently from the end of the previous one.

**Failure mode:** At 8x speed, the interval is 175ms. If the browser throttles the tab (e.g., it's in the background), multiple intervals may fire in rapid succession when the tab regains focus, causing the replay to jump forward.

**Fix:** Replace `setInterval` with recursive `setTimeout`.

---

## Verified Safe / No Issue

- Error boundary console.error gating confirmed
- use-unsaved-changes-guard handles all navigation interception scenarios
- use-source-draft handles all localStorage access with try/catch
- anti-cheat-monitor handles localStorage with try/catch and retry logic
- SSE polling in use-submission-polling properly falls back to fetch polling
- AbortController properly used in recruiting-invitations-panel and contest-quick-stats
