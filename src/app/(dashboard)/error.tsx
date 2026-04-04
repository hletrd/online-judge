"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const t = useTranslations("dashboardState");
  const tCommon = useTranslations("common");

  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 text-center">
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold">{t("errorTitle")}</h2>
        <p className="max-w-md text-sm text-muted-foreground">{t("errorDescription")}</p>
        {error.digest && (
          <p className="text-xs text-muted-foreground/70 font-mono">
            {tCommon("errorId", { digest: error.digest })}
          </p>
        )}
      </div>

      <div className="flex flex-wrap items-center justify-center gap-2">
        <Button type="button" onClick={reset}>
          {t("tryAgain")}
        </Button>
        <Link href="/dashboard">
          <Button variant="outline">{t("backToDashboard")}</Button>
        </Link>
      </div>
    </div>
  );
}
