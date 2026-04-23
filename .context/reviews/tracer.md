# Tracer Review — RPF Cycle 26

**Date:** 2026-04-22
**Reviewer:** tracer
**Base commit:** f55836d0

## TR-1: Causal trace of double `.json()` anti-pattern in `assignment-form-dialog.tsx` [MEDIUM/HIGH]

**File:** `src/app/(dashboard)/dashboard/groups/[id]/assignment-form-dialog.tsx:270-278`

**Trace:**
1. User clicks "Create Assignment" button
2. `handleSubmit` fires, calls `apiFetch(...)` which returns a `Response`
3. `if (!response.ok)` — suppose the server returns 400 with JSON body `{ error: "assignmentTitleRequired" }`
4. Line 273: `const errorBody = await response.json().catch(() => ({}))` — parses body successfully
5. Line 274: `throw new Error(errorBody.error || "assignmentCreateFailed")` — throws with "assignmentTitleRequired"
6. The catch block catches this, calls `getErrorMessage`, shows localized toast
7. **Key observation:** Line 277 (`const payload = await response.json()...`) is never reached because of the throw. But if the throw were removed, `.json()` would throw "body already consumed" since the body was already read on line 273.

**Hypothesis:** This code works correctly today but is fragile. The pattern should be "parse once, then branch" to eliminate the possibility of the body-already-consumed error.

---

## TR-2: Causal trace of `compiler-client.tsx` catch block error display [LOW/MEDIUM]

**File:** `src/components/code/compiler-client.tsx:288-298`

**Trace:**
1. User clicks "Run" button
2. `handleRun` fires, calls `apiFetch(...)` which fails with a network error
3. The catch block catches `err` (a `TypeError: Failed to fetch`)
4. Line 289: `err.name === "AbortError"` — false for network errors
5. Line 292: `errorMessage = "Failed to fetch"` — raw error message
6. Line 293-296: `updateTestCase` sets `error: "Failed to fetch"` — shown in inline error panel
7. Line 298: `toast.error(t("networkError"))` — correctly shows localized message

**Competing hypotheses:**
- H1: The raw `error.message` in the inline display is intentional (compiler context where users need to see the specific error)
- H2: This is an oversight from the AGG-2 fix that only addressed toasts

**Assessment:** H2 is more likely. The cycle-25 fix explicitly targeted "never leak raw error messages", but only the toast was fixed. The inline display should also use the i18n key.
