# Transcript Access Policy

_Last updated: 2026-04-14_

Governs access to AI chat transcripts stored in JudgeKit. Implementation lives in `src/app/api/v1/admin/chat-logs/route.ts`.

---

## Who can access transcripts

Only users whose role grants the `system.chat_logs` capability. By default this is limited to `admin` and `super_admin` roles. No other role has this capability unless explicitly configured.

Access is enforced at the API layer:

```ts
const caps = await resolveCapabilities(user.role);
if (!caps.has("system.chat_logs")) return forbidden();
```

---

## How access is governed

Every access action is recorded via `recordAuditEvent` before the response is returned.

**Viewing the session list:**

```
action: "chat_log.list_viewed"
resourceType: "chat_log"
```

Logged whenever an admin loads the session index, optionally filtered by user.

**Viewing a transcript:**

```
action: "chat_log.session_viewed"
resourceType: "chat_session"
details: { sessionId, messageCount, accessType: "break-glass-transcript" }
```

Logged for every individual session transcript view. The `break-glass-transcript` access type marks this as a privileged action in the audit trail.

Both list and session-view events include the actor's user ID, role, request metadata, and a human-readable summary. All audit events are retained for 90 days by default (configurable via `AUDIT_EVENT_RETENTION_DAYS`).

---

## Operator recommendations

1. Keep the admin population as small as possible. `system.chat_logs` grants access to all users' chat history; grant it only to staff with a legitimate operational need.
2. Periodically review audit log entries with `action = "chat_log.list_viewed"` and `action = "chat_log.session_viewed"` to detect unexpected access.
3. Treat break-glass transcript access as a sensitive action equivalent to accessing personally identifiable data. Document the business reason when viewing a transcript.
4. If a transcript is accessed as part of a support investigation or integrity review, note the session ID and actor in your incident record.
