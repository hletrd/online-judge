import { getValidatedAuthSecret, getValidatedJudgeAuthToken } from "@/lib/security/env";
import { startRateLimitEviction } from "@/lib/security/rate-limit";
import { startAuditEventPruning } from "@/lib/audit/events";
import { syncLanguageConfigsOnStartup } from "@/lib/judge/sync-language-configs";

export async function register() {
  getValidatedAuthSecret();
  getValidatedJudgeAuthToken();

  // Insert any missing language configs into the database
  await syncLanguageConfigsOnStartup();

  // Start background maintenance jobs (only runs once per process)
  startRateLimitEviction();
  startAuditEventPruning();
}
