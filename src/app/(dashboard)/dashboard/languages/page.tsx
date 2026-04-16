import Link from "next/link";
import { getLocale, getTranslations } from "next-intl/server";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getJudgeSystemSnapshot } from "@/lib/judge/dashboard-data";

function formatNumber(value: number, locale: string) {
  return new Intl.NumberFormat(locale).format(value);
}

export default async function DashboardLanguagesPage() {
  const [snapshot, locale, tDashboard, tLanguages] = await Promise.all([
    getJudgeSystemSnapshot(),
    getLocale(),
    getTranslations("dashboard"),
    getTranslations("languages"),
  ]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold tracking-tight">{tDashboard("supportedLanguages")}</h2>
          <p className="max-w-3xl text-sm text-muted-foreground">
            {tDashboard("supportedLanguagesCatalogDescription")}
          </p>
        </div>
        <Link href="/dashboard">
          <Button variant="outline">{tDashboard("viewDashboardOverview")}</Button>
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>{tDashboard("enabledLanguageCount")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold">{formatNumber(snapshot.allLanguages.length, locale)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>{tDashboard("featuredLanguageEnvironments")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold">{formatNumber(snapshot.featuredEnvironments.length, locale)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>{tDashboard("onlineWorkers")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold">{formatNumber(snapshot.onlineWorkerCount, locale)}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{tDashboard("featuredLanguageEnvironments")}</CardTitle>
          <CardDescription>{tDashboard("featuredLanguageEnvironmentsDescription")}</CardDescription>
        </CardHeader>
        <CardContent>
          {snapshot.featuredEnvironments.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {snapshot.featuredEnvironments.map((environment) => (
                <div key={environment.key} className="rounded-xl border p-4">
                  <p className="text-lg font-semibold tracking-tight">{environment.title}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{environment.runtime}</p>
                  {environment.compiler ? (
                    <p className="mt-3 text-sm font-medium">{environment.compiler}</p>
                  ) : null}
                  <div className="mt-3 flex flex-wrap gap-2">
                    {environment.variants.map((variant) => (
                      <Badge key={variant} variant="secondary">
                        {variant}
                      </Badge>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="rounded-xl border border-dashed p-4 text-sm text-muted-foreground">
              {tDashboard("noEnabledLanguages")}
            </p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{tDashboard("allEnabledLanguages")}</CardTitle>
          <CardDescription>{tDashboard("allEnabledLanguagesDescription")}</CardDescription>
        </CardHeader>
        <CardContent className="min-w-0">
          {snapshot.allLanguages.length > 0 ? (
            <div className="overflow-x-auto">
              <Table className="min-w-[720px]">
                <TableHeader>
                  <TableRow>
                    <TableHead>{tLanguages("language")}</TableHead>
                    <TableHead>{tDashboard("languageKey")}</TableHead>
                    <TableHead>{tLanguages("runtime")}</TableHead>
                    <TableHead>{tLanguages("compiler")}</TableHead>
                    <TableHead>{tDashboard("fileExtension")}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {snapshot.allLanguages.map((language) => (
                    <TableRow key={language.id}>
                      <TableCell>
                        <Badge variant="secondary">{language.label}</Badge>
                      </TableCell>
                      <TableCell className="font-mono text-sm">{language.language}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{language.runtime}</TableCell>
                      <TableCell className="text-sm">{language.compiler ?? "-"}</TableCell>
                      <TableCell className="font-mono text-sm">{language.extension}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <p className="rounded-xl border border-dashed p-4 text-sm text-muted-foreground">
              {tDashboard("noEnabledLanguages")}
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
