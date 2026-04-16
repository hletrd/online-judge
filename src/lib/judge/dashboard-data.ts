import { asc, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { judgeWorkers, languageConfigs } from "@/lib/db/schema";
import { getConfiguredSettings } from "@/lib/system-settings-config";
import {
  buildJudgeLanguageCatalog,
  type EnabledJudgeLanguageRecord,
} from "@/lib/judge/dashboard-catalog";

export type JudgeSystemSnapshot = ReturnType<typeof buildJudgeLanguageCatalog> & {
  onlineWorkerCount: number;
  activeJudgeTasks: number;
  totalWorkerCapacity: number;
  architectureSummary: string | null;
  defaultTimeLimitMs: number;
  defaultMemoryLimitMb: number;
};

export async function getJudgeSystemSnapshot(): Promise<JudgeSystemSnapshot> {
  const [enabledLanguages, onlineWorkers] = await Promise.all([
    db
      .select({
        id: languageConfigs.id,
        language: languageConfigs.language,
        displayName: languageConfigs.displayName,
        standard: languageConfigs.standard,
        extension: languageConfigs.extension,
        dockerImage: languageConfigs.dockerImage,
        compiler: languageConfigs.compiler,
        compileCommand: languageConfigs.compileCommand,
        runCommand: languageConfigs.runCommand,
      })
      .from(languageConfigs)
      .where(eq(languageConfigs.isEnabled, true))
      .orderBy(asc(languageConfigs.displayName), asc(languageConfigs.standard), asc(languageConfigs.language)),
    db
      .select({
        concurrency: judgeWorkers.concurrency,
        activeTasks: judgeWorkers.activeTasks,
        architecture: judgeWorkers.architecture,
      })
      .from(judgeWorkers)
      .where(eq(judgeWorkers.status, "online")),
  ]);

  const settings = getConfiguredSettings();
  const catalog = buildJudgeLanguageCatalog(enabledLanguages as EnabledJudgeLanguageRecord[]);
  const totalWorkerCapacity = onlineWorkers.reduce((sum, worker) => sum + worker.concurrency, 0);
  const activeJudgeTasks = onlineWorkers.reduce((sum, worker) => sum + worker.activeTasks, 0);
  const architectures = [...new Set(onlineWorkers.map((worker) => worker.architecture).filter(Boolean))];

  return {
    ...catalog,
    onlineWorkerCount: onlineWorkers.length,
    activeJudgeTasks,
    totalWorkerCapacity,
    architectureSummary: architectures.length > 0 ? architectures.join(", ") : null,
    defaultTimeLimitMs: settings.defaultTimeLimitMs,
    defaultMemoryLimitMb: settings.defaultMemoryLimitMb,
  };
}
