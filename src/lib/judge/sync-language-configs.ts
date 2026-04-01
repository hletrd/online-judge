import { db } from "@/lib/db";
import { languageConfigs } from "@/lib/db/schema";
import { nanoid } from "nanoid";
import { DEFAULT_JUDGE_LANGUAGES, serializeJudgeCommand } from "./languages";

const RETRY_DELAY_MS = 30_000;
const MAX_RETRIES = 3;

async function doSync(): Promise<boolean> {
  const existing = await db
    .select({ language: languageConfigs.language })
    .from(languageConfigs);

  const existingSet = new Set(existing.map((r) => r.language));
  let inserted = 0;

  for (const lang of DEFAULT_JUDGE_LANGUAGES) {
    if (existingSet.has(lang.language)) continue;

    const compileCmd = serializeJudgeCommand(lang.compileCommand);
    await db.insert(languageConfigs).values({
      id: nanoid(),
      language: lang.language,
      displayName: lang.displayName,
      extension: lang.extension,
      dockerImage: lang.dockerImage,
      compiler: lang.compiler ?? null,
      runCommand: lang.runCommand.join(" "),
      isEnabled: true,
      updatedAt: new Date(),
      ...(lang.standard ? { standard: lang.standard } : {}),
      ...(compileCmd ? { compileCommand: compileCmd } : {}),
    });
    inserted++;
  }

  if (inserted > 0) {
    console.log(`[language-sync] inserted ${inserted} new language configs`);
  }
  return true;
}

export async function syncLanguageConfigsOnStartup() {
  try {
    await doSync();
  } catch {
    // Table may not exist yet (pre-migration). Schedule retries.
    let retries = 0;
    const retry = () => {
      setTimeout(async () => {
        retries++;
        try {
          await doSync();
        } catch {
          if (retries < MAX_RETRIES) retry();
        }
      }, RETRY_DELAY_MS);
    };
    retry();
  }
}
