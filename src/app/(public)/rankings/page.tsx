import type { Metadata } from "next";
import { getLocale, getTranslations } from "next-intl/server";
import { rawQueryOne, rawQueryAll } from "@/lib/db/queries";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { formatRelativeTimeFromNow } from "@/lib/datetime";
import { PaginationControls } from "@/components/pagination-controls";
import { JsonLd } from "@/components/seo/json-ld";
import { buildAbsoluteUrl, buildLocalePath, buildPublicMetadata } from "@/lib/seo";
import { getResolvedSystemSettings } from "@/lib/system-settings";
import { getLocale as getLocaleServer } from "next-intl/server";

const PAGE_SIZE = 50;
const PAGE_PATH = "/rankings";

export async function generateMetadata({
  searchParams,
}: {
  searchParams?: Promise<{ page?: string }>;
} = {}): Promise<Metadata> {
  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const requestedPage = Math.max(1, Math.floor(Number(resolvedSearchParams?.page ?? "1")) || 1);

  const [tCommon, t, locale, countRow] = await Promise.all([
    getTranslations("common"),
    getTranslations("rankings"),
    getLocaleServer(),
    rawQueryOne<{ total: number }>(`
      WITH first_accepts AS (
        SELECT
          user_id,
          problem_id,
          MIN(submitted_at) as first_accepted_at
        FROM submissions
        WHERE status = 'accepted'
        GROUP BY user_id, problem_id
      )
      SELECT COUNT(DISTINCT fa.user_id)::int as total
      FROM first_accepts fa
      INNER JOIN users u ON u.id = fa.user_id
      WHERE u.is_active = true
    `),
  ]);
  const settings = await getResolvedSystemSettings({
    siteTitle: tCommon("appName"),
    siteDescription: tCommon("appDescription"),
  });
  const totalCount = countRow?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));
  const currentPage = Math.min(requestedPage, totalPages);

  const pageLabel = currentPage > 1 ? tCommon("paginationPage", { page: currentPage }) : null;
  const title = currentPage > 1 ? `${t("title")} · ${pageLabel}` : t("title");
  const description = currentPage > 1 ? `${t("description")} ${pageLabel}.` : t("description");

  return buildPublicMetadata({
    title,
    description,
    path: currentPage > 1 ? `${PAGE_PATH}?page=${currentPage}` : PAGE_PATH,
    siteTitle: settings.siteTitle,
    locale,
  });
}

export default async function RankingsPage({
  searchParams,
}: {
  searchParams?: Promise<{ page?: string }>;
}) {
  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const currentPage = Math.max(1, Math.floor(Number(resolvedSearchParams?.page ?? "1")) || 1);

  const t = await getTranslations("rankings");
  const locale = await getLocale();

  const countRow = await rawQueryOne<{ total: number }>(
    `
    WITH first_accepts AS (
      SELECT
        user_id,
        problem_id,
        MIN(submitted_at) as first_accepted_at
      FROM submissions
      WHERE status = 'accepted'
      GROUP BY user_id, problem_id
    )
    SELECT COUNT(DISTINCT fa.user_id)::int as total
    FROM first_accepts fa
    INNER JOIN users u ON u.id = fa.user_id
    WHERE u.is_active = true
    `
  );
  const totalCount = countRow?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));
  const clampedPage = Math.min(currentPage, totalPages);
  const clampedOffset = (clampedPage - 1) * PAGE_SIZE;

  const rankingRows = await rawQueryAll<{
    userId: string;
    username: string;
    name: string;
    className: string | null;
    solvedCount: number;
    lastSolveTime: Date;
  }>(
    `
    WITH first_accepts AS (
      SELECT
        user_id,
        problem_id,
        MIN(submitted_at) as first_accepted_at
      FROM submissions
      WHERE status = 'accepted'
      GROUP BY user_id, problem_id
    )
    SELECT
      u.id as "userId",
      u.username as username,
      u.name as name,
      u.class_name as "className",
      COUNT(fa.problem_id)::int as "solvedCount",
      MAX(fa.first_accepted_at) as "lastSolveTime"
    FROM users u
    INNER JOIN first_accepts fa ON fa.user_id = u.id
    WHERE u.is_active = true
    GROUP BY u.id, u.username, u.name, u.class_name
    ORDER BY "solvedCount" DESC, "lastSolveTime" ASC
    LIMIT @limit OFFSET @offset
    `,
    { limit: PAGE_SIZE, offset: clampedOffset }
  );
  const rankingsJsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: t("title"),
    description: t("description"),
    url: buildAbsoluteUrl(buildLocalePath(clampedPage > 1 ? `${PAGE_PATH}?page=${clampedPage}` : PAGE_PATH, locale)),
    inLanguage: locale,
    mainEntity: {
      "@type": "ItemList",
      itemListElement: rankingRows.map((row, index) => ({
        "@type": "ListItem",
        position: clampedOffset + index + 1,
        name: `${row.name} (${row.username})`,
      })),
    },
  };

  return (
    <div className="space-y-6">
      <JsonLd data={rankingsJsonLd} />
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">{t("title")}</h1>
        <p className="mt-2 text-sm text-muted-foreground">{t("description")}</p>
      </div>

      <Card>
        <CardContent className="p-0">
          {rankingRows.length === 0 ? (
            <p className="p-6 text-sm text-muted-foreground">
              {t("noRankings")}
            </p>
          ) : (
            <>
            {/* Desktop table */}
            <div className="hidden md:block overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-16">{t("rank")}</TableHead>
                    <TableHead>{t("username")}</TableHead>
                    <TableHead>{t("name")}</TableHead>
                    <TableHead>{t("className")}</TableHead>
                    <TableHead className="text-right">
                      {t("solvedCount")}
                    </TableHead>
                    <TableHead>{t("lastSolveTime")}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rankingRows.map((row, index) => (
                    <TableRow key={row.userId}>
                      <TableCell>
                        <Badge variant={clampedOffset + index < 3 ? "default" : "secondary"}>
                          {clampedOffset + index + 1}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-mono text-sm">
                        {row.username}
                      </TableCell>
                      <TableCell>{row.name}</TableCell>
                      <TableCell className="text-muted-foreground">
                        {row.className ?? "-"}
                      </TableCell>
                      <TableCell className="text-right font-semibold">
                        {row.solvedCount}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {formatRelativeTimeFromNow(
                          new Date(row.lastSolveTime),
                          locale
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            {/* Mobile cards */}
            <ul className="md:hidden divide-y" role="list">
              {rankingRows.map((row, index) => (
                <li key={row.userId} className="flex items-center gap-3 px-4 py-3">
                  <Badge variant={clampedOffset + index < 3 ? "default" : "secondary"} aria-label={`Rank ${clampedOffset + index + 1}`}>
                    {clampedOffset + index + 1}
                  </Badge>
                  <div className="min-w-0 flex-1">
                    <div className="truncate font-medium">{row.name}</div>
                    <div className="text-sm text-muted-foreground">
                      @{row.username}{row.className ? ` · ${row.className}` : ""}
                    </div>
                  </div>
                  <div className="shrink-0 text-right">
                    <div className="font-semibold" aria-label={`${row.solvedCount} solved`}>{row.solvedCount}</div>
                    <div className="text-xs text-muted-foreground">
                      {formatRelativeTimeFromNow(new Date(row.lastSolveTime), locale)}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
            </>
          )}
        </CardContent>
      </Card>
      <PaginationControls
        currentPage={clampedPage}
        totalPages={totalPages}
        buildHref={(page) => buildLocalePath(page > 1 ? `${PAGE_PATH}?page=${page}` : PAGE_PATH, locale)}
      />
    </div>
  );
}
