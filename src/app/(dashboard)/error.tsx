"use client";

import { useEffect } from "react";
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
  // Next.js 16 + nginx proxy: Host/X-Forwarded-Host headers cause RSC
  // streaming to corrupt React hook state during client-side navigation.
  // Workaround: detect React hook errors (#300/#310) and do a full page
  // reload instead of showing the error page.
  useEffect(() => {
    const msg = error?.message ?? "";
    if (msg.includes("#300") || msg.includes("#310") || msg.includes("hook")) {
      window.location.reload();
    }
  }, [error]);

  const t = useTranslations("dashboardState");

  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 text-center">
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold">{t("errorTitle")}</h2>
        <p className="max-w-md text-sm text-muted-foreground">{t("errorDescription")}</p>
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
