import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { auth } from "@/lib/auth";
import { getResolvedSystemSettings, getSystemSettings } from "@/lib/system-settings";
import { SystemSettingsForm } from "./system-settings-form";

export default async function AdminSettingsPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");
  if (session.user.role !== "admin" && session.user.role !== "super_admin") redirect("/dashboard");

  const t = await getTranslations("admin.settings");
  const tCommon = await getTranslations("common");
  const resolvedSettings = await getResolvedSystemSettings({
    siteTitle: tCommon("appName"),
    siteDescription: tCommon("appDescription"),
  });
  const storedSettings = await getSystemSettings();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">{t("title")}</h2>
        <p className="text-sm text-muted-foreground">{t("description")}</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t("siteCardTitle")}</CardTitle>
          <CardDescription>{t("siteCardDescription")}</CardDescription>
        </CardHeader>
        <CardContent>
          <SystemSettingsForm
            initialSiteTitle={storedSettings?.siteTitle ?? ""}
            initialSiteDescription={storedSettings?.siteDescription ?? ""}
            defaultSiteTitle={tCommon("appName")}
            defaultSiteDescription={tCommon("appDescription")}
            currentSiteTitle={resolvedSettings.siteTitle}
            currentSiteDescription={resolvedSettings.siteDescription}
          />
        </CardContent>
      </Card>
    </div>
  );
}
