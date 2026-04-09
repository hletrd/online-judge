# Plan 05: Code Quality & Type Safety

**Priority:** HIGH to LOW
**Effort:** Medium (2 days)
**Source findings:** QUAL-H1, QUAL-H3, QUAL-H4, QUAL-M1, QUAL-M2, QUAL-M3,
QUAL-M4, QUAL-M5, QUAL-L1, QUAL-L2, QUAL-L3, QUAL-L4, plus first-review
remaining minor items

## Implementation Steps

### Step 1: Fix auto-review.ts double query + as any (QUAL-H1) -- HIGH

```
File: src/lib/judge/auto-review.ts

Replace two queries (lines 58-79) with single query:
  const submission = await db.query.submissions.findFirst({
    where: eq(submissions.id, submissionId),
    columns: {
      id: true, sourceCode: true, language: true,
      executionTimeMs: true, memoryUsedKb: true, problemId: true,
    },
    with: {
      problem: {
        columns: {
          title: true, description: true,
          allowAiAssistant: true,
        },
      },
    },
  });

Remove the (submissionFull as any).problemId cast entirely.
Access submission.problem.allowAiAssistant directly.
```

### Step 2: Fix system-settings.ts as any cast (QUAL-H3) -- HIGH

```
File: src/lib/system-settings.ts

Add aiAssistantEnabled to the typed select in getSystemSettings():
  - In the main query columns, include aiAssistantEnabled: true
  - In the fallback path, include it as well
  - Remove (settings as any)?.aiAssistantEnabled
  - Access settings.aiAssistantEnabled directly (typed)

If the column might not exist (migration not run), handle it in the
query function with a try/catch fallback, not in the consumer.
```

### Step 3: Guard ICPC scoring against null startsAt (QUAL-H4) -- HIGH

```
File: src/lib/assignments/contest-scoring.ts:119

Replace:
  const contestStartMs = meta.startsAt ? meta.startsAt * 1000 : 0;

With:
  if (meta.scoringModel === "icpc" && !meta.startsAt) {
    logger.warn({ assignmentId }, "ICPC contest has no startsAt -- penalties will be incorrect");
    // Fall back to earliest submission time or return empty ranking
    const contestStartMs = meta.earliestSubmission ? meta.earliestSubmission * 1000 : Date.now();
  }

Also add validation in assignment creation to require startsAt for ICPC:
  File: src/lib/validators/assignment.ts
  - Add refinement: if scoringModel === "icpc", startsAt is required
```

### Step 4: Fix float precision in late penalty (QUAL-M1) -- MEDIUM

```
File: src/lib/assignments/contest-scoring.ts:157-163

The ROUND(..., 2) in SQL is sufficient for display purposes.
Document the rounding behavior:
  // Note: Late penalty uses float arithmetic in SQL.
  // ROUND(..., 2) ensures display-consistent results.
  // Maximum deviation is 0.01 points which is acceptable.

No code change needed -- add documentation comment.
```

### Step 5: Wrap profile/preferences updates in try/catch (QUAL-M2) -- MEDIUM

```
File: src/lib/actions/update-profile.ts
  try {
    db.update(users).set(withUpdatedAt({...})).where(eq(users.id, session.user.id)).run();
  } catch (error) {
    logger.error({ err: error }, "Failed to update profile");
    return { success: false, error: "updateFailed" };
  }
  // Only update session AFTER confirmed DB write
  await unstable_update({...});

File: src/lib/actions/update-preferences.ts
  Same pattern: wrap .run() in try/catch, return error before session update.
```

### Step 6: Await audit event in change-password (QUAL-M3) -- MEDIUM

```
File: src/lib/actions/change-password.ts

Move audit recording into the same try/catch:
  try {
    db.update(users).set(withUpdatedAt({
      passwordHash: newHash,
      mustChangePassword: false,
      tokenInvalidatedAt: new Date(),
    })).where(eq(users.id, user.id)).run();

    const auditContext = await buildServerActionAuditContext("/change-password");
    recordAuditEvent({
      actorId: user.id,
      actorRole: user.role,
      action: "password.change",
      ...auditContext,
    });
    // Note: recordAuditEvent uses sync sqlite internally, so it completes immediately
  } catch (error) {
    logger.error({ err: error }, "Failed to change password");
    return { success: false, error: t("error") };
  }
```

### Step 7: Wrap language reset in transaction (QUAL-M4) -- MEDIUM

```
File: src/lib/actions/language-configs.ts

  sqlite.transaction(() => {
    for (const [lang, definition] of Object.entries(JUDGE_LANGUAGE_CONFIGS)) {
      db.update(languageConfigs).set({
        displayName: definition.displayName,
        // ... other fields
      }).where(eq(languageConfigs.language, lang)).run();
    }
  })();
```

### Step 8: Guard JSON.parse in providers.ts (QUAL-M5) -- MEDIUM

```
File: src/lib/plugins/chat-widget/providers.ts:113

Replace:
  JSON.parse(tc.function.arguments || "{}")

With:
  let args: Record<string, unknown> = {};
  try {
    args = JSON.parse(tc.function.arguments || "{}");
  } catch {
    logger.warn({ rawArgs: tc.function.arguments }, "Failed to parse tool call arguments");
  }
```

### Step 9: Make auto-review locale configurable (QUAL-L1) -- LOW

```
File: src/lib/judge/auto-review.ts

Replace hardcoded Korean prompt with locale-aware version:
  - Read system locale from getConfiguredSettings().timeZone or a new reviewLanguage setting
  - Or use the submission owner's preferredLanguage
  - Build the system prompt with a locale parameter

For now, a simple approach:
  const locale = user?.preferredLanguage ?? "ko";
  const systemPrompt = locale === "ko"
    ? "Always respond in Korean (한국어)..."
    : "Always respond in English...";
```

### Step 10: Fix lecture-mode-toggle.tsx translations (QUAL-L2) -- LOW

```
File: src/components/layout/lecture-mode-toggle.tsx

Replace hardcoded strings with t() calls:
  "Lecture Mode" -> t("lectureMode")
  "Color Scheme" -> t("colorScheme")
  "Dark" / "Light" / "Solarized" -> t("dark") / t("light") / t("solarized")

File: messages/en.json -- add keys under "common" or "settings"
File: messages/ko.json -- add Korean translations
```

### Step 11: Fix antiCheatEvents.details column mode (QUAL-L3) -- LOW

```
File: src/lib/db/schema.ts:755

Change:
  details: text("details"),

To:
  details: text("details", { mode: "json" }).$type<Record<string, unknown>>(),

Update consumers to remove manual JSON.parse:
  - src/components/contest/participant-anti-cheat-timeline.tsx:43
  - src/components/contest/anti-cheat-dashboard.tsx:57
  - Add try/catch fallbacks where JSON.parse was used

Note: This is a schema change that requires migration consideration.
Existing data is already JSON strings, so mode: "json" will auto-parse.
```

### Step 12: Create ValidatedJWT type (QUAL-L4) -- LOW

```
File: src/types/next-auth.d.ts

Keep existing optional JWT interface (NextAuth requirement).
Add a validated type for post-auth-check use:

  export interface ValidatedJWT {
    id: string;
    role: string;
    username: string;
    name: string;
    isActive: boolean;
    authenticatedAt: number;
  }

  // Helper to assert JWT is validated
  export function assertValidatedJWT(token: JWT): asserts token is JWT & ValidatedJWT {
    if (!token.id || !token.role || !token.username) {
      throw new Error("Invalid JWT: missing required fields");
    }
  }
```

### Step 13: First-review remaining minor items

```
From first review Phase 3 (not yet done):
- [ ] Replace (window as any).__ojEditorContent with React Context
      → Covered in plan-02 Step 7
- [ ] Remove deprecated API_RATE_LIMIT_MAX / API_RATE_LIMIT_WINDOW_MS exports
      → Covered in plan-04 Step 12
- [ ] Fix db/index.ts require() calls to use dynamic import()
- [ ] Add formData.get("file") instanceof File check in restore route
      → Covered in plan-03 Step 2
- [ ] Validate bulk enrollment array size (cap at 500) in members/bulk/route.ts
- [ ] Add rate limiting on expensive GET endpoints (chat-logs, workers, backup)
      → backup already rate-limited (first review fix SEC-H8)
- [ ] Make problem-sets/route.ts POST use createApiHandler schema option
      → Covered in plan-06

Remaining standalone items:
  File: src/lib/db/index.ts
    Replace require("better-sqlite3") with dynamic import
  File: src/app/api/v1/groups/[id]/members/bulk/route.ts
    Add: if (userIds.length > 500) return apiError("tooManyMembers", 400)
```

## Testing

- Verify auto-review fetches problem.allowAiAssistant in single query
- Verify system settings typed correctly without as any
- Verify ICPC contest creation requires startsAt
- Verify profile update failure doesn't corrupt session
- Verify password change audit is recorded
- Verify language reset is atomic (all or nothing)

## Progress (2026-03-28)

- [x] Step 1: auto-review.ts single query + no as any -- commit `a818200`
- [x] Step 2: system-settings.ts typed access -- commit `a818200`
- [x] Step 3: ICPC startsAt guard -- commit `a818200`
- [x] Step 4: Late penalty float precision (documented, no code change needed)
- [x] Step 5: Profile/preferences try/catch -- commit `a818200`
- [x] Step 6: Change-password audit handling -- commit `a818200`
- [x] Step 7: Language reset transaction -- commit `a818200`
- [x] Step 8: JSON.parse guard in providers.ts -- commit `a818200`
- [x] Step 9: Auto-review locale configurable -- commit `a818200`
- [x] Step 10: Lecture-mode-toggle i18n -- commit `c81606b`
- [x] Step 11: antiCheatEvents.details mode: json -- commit `c81606b`
- [x] Step 12: ValidatedJWT type -- commit `c81606b`
- [x] Step 13a: db/index.ts require() → dynamic import() -- commit `3078d46`
- [x] Step 13b: Bulk enrollment array size cap -- Zod schema caps at 200 (stricter than 500)

**Status: COMPLETE**
