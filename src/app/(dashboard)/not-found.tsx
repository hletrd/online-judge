import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { Button } from "@/components/ui/button";

export default async function DashboardNotFound() {
  const t = await getTranslations("dashboardState");

  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 text-center">
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold">{t("notFoundTitle")}</h2>
        <p className="max-w-md text-sm text-muted-foreground">{t("notFoundDescription")}</p>
      </div>

      <Link href="/dashboard">
        <Button>{t("backToDashboard")}</Button>
      </Link>
    </div>
  );
}
