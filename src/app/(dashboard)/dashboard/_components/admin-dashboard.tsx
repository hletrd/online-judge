import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DashboardJudgeSystemSection } from "@/app/(dashboard)/dashboard/_components/dashboard-judge-system-section";

export async function AdminDashboard() {
  const [t, tNav] = await Promise.all([
    getTranslations("dashboard"),
    getTranslations("nav"),
  ]);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{t("adminQuickActions")}</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          <Link href="/dashboard/admin/workers">
            <Button size="sm" variant="outline">{tNav("judgeWorkers")}</Button>
          </Link>
          <Link href="/dashboard/admin/languages">
            <Button size="sm" variant="outline">{tNav("languages")}</Button>
          </Link>
          <Link href="/dashboard/admin/users">
            <Button size="sm" variant="outline">{tNav("userManagement")}</Button>
          </Link>
          <Link href="/dashboard/admin/audit-logs">
            <Button size="sm" variant="outline">{tNav("auditLogs")}</Button>
          </Link>
        </CardContent>
      </Card>

      <DashboardJudgeSystemSection />
    </div>
  );
}
