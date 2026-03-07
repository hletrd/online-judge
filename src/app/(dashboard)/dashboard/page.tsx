import { getTranslations } from "next-intl/server";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Cpu, HardDrive, Clock, MemoryStick } from "lucide-react";
import { db } from "@/lib/db";
import { languageConfigs } from "@/lib/db/schema";
import {
  getJudgeLanguageDefinition,
  JUDGE_LANGUAGE_CONFIGS,
  serializeJudgeCommand,
} from "@/lib/judge/languages";
import { getResolvedSystemSettings } from "@/lib/system-settings";
import { getRuntimeSystemInfo } from "@/lib/system-info";
import { eq } from "drizzle-orm";

export default async function DashboardPage() {
  const t = await getTranslations("dashboard");
  const tCommon = await getTranslations("common");
  const tJudge = await getTranslations("judge");
  const tLangs = await getTranslations("languages");
  const settings = await getResolvedSystemSettings({
    siteTitle: tCommon("appName"),
    siteDescription: tCommon("appDescription"),
  });

  const langs = await db.select().from(languageConfigs).where(eq(languageConfigs.isEnabled, true));
  const enabledLanguages = langs.flatMap((language) => {
    const definition = getJudgeLanguageDefinition(language.language);

    if (!definition) {
      return [];
    }

    return [{ id: language.id, definition }];
  });
  const runtimeSystemInfo = await getRuntimeSystemInfo();
  const pythonRuntime = JUDGE_LANGUAGE_CONFIGS.python.compiler;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">{t("title")}</h2>

      <Card>
        <CardHeader>
          <CardTitle>{t("welcome", { siteTitle: settings.siteTitle })}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">{t("welcomeDescription")}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{tJudge("title")}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-5">
            <div className="flex items-center gap-3 rounded-lg border p-3">
              <Cpu className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">{tJudge("cpuLabel")}</p>
                <p className="text-sm font-medium">{runtimeSystemInfo.cpu}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-lg border p-3">
              <HardDrive className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">{tJudge("osLabel")}</p>
                <p className="text-sm font-medium">{runtimeSystemInfo.os}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-lg border p-3">
              <MemoryStick className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">{tJudge("pythonLabel")}</p>
                <p className="text-sm font-medium">{pythonRuntime ?? tCommon("unknown")}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-lg border p-3">
              <Clock className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">{tJudge("timeLimitLabel")}</p>
                <p className="text-sm font-medium">{tJudge("defaultTimeLimit")}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-lg border p-3">
              <MemoryStick className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">{tJudge("memoryLimitLabel")}</p>
                <p className="text-sm font-medium">{tJudge("defaultMemoryLimit")}</p>
              </div>
            </div>
          </div>
          <p className="text-sm text-muted-foreground mb-4">{tJudge("limitsNote")}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{tLangs("title")}</CardTitle>
          <CardDescription>{runtimeSystemInfo.architecture}</CardDescription>
        </CardHeader>
        <CardContent className="min-w-0">
          <Table className="min-w-max">
            <TableHeader>
              <TableRow>
                <TableHead>{tLangs("language")}</TableHead>
                <TableHead>{tLangs("compiler")}</TableHead>
                <TableHead>{tLangs("compileOptions")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {enabledLanguages.map(({ id, definition }) => (
                <TableRow key={id}>
                  <TableCell>
                    <Badge variant="secondary">
                      {definition.displayName} {definition.standard ? `(${definition.standard})` : ""}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-mono text-sm">{definition.compiler || "-"}</TableCell>
                  <TableCell className="font-mono text-sm">
                    {serializeJudgeCommand(definition.compileCommand) || "-"}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
