import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { db } from "@/lib/db";
import { desc } from "drizzle-orm";
import { problemSets } from "@/lib/db/schema";
import { auth } from "@/lib/auth";
import { isInstructorOrAbove } from "@/lib/auth/role-helpers";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("problemSets");
  return { title: t("title") };
}

export default async function ProblemSetsPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");
  if (!isInstructorOrAbove(session.user.role)) redirect("/dashboard");

  const t = await getTranslations("problemSets");
  const tCommon = await getTranslations("common");

  const allSets = await db.query.problemSets.findMany({
    orderBy: [desc(problemSets.createdAt)],
    with: {
      problems: {
        columns: { id: true },
      },
      groupAccess: {
        columns: { id: true },
      },
      creator: {
        columns: { id: true, name: true, username: true },
      },
    },
  });

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">{t("title")}</h2>
        <Link href="/dashboard/problem-sets/new">
          <Button size="sm">{t("create")}</Button>
        </Link>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>{t("description")}</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t("table.name")}</TableHead>
                <TableHead>{t("table.problems")}</TableHead>
                <TableHead>{t("table.groups")}</TableHead>
                <TableHead>{t("table.createdBy")}</TableHead>
                <TableHead>{t("table.action")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {allSets.map((ps) => (
                <TableRow key={ps.id}>
                  <TableCell className="font-medium">{ps.name}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">
                      {t("problemCount", { count: ps.problems.length })}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {t("groupCount", { count: ps.groupAccess.length })}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {ps.creator?.name ?? ps.creator?.username ?? tCommon("unknown")}
                  </TableCell>
                  <TableCell>
                    <Link href={`/dashboard/problem-sets/${ps.id}`}>
                      <Button variant="outline" size="sm">{tCommon("view")}</Button>
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
              {allSets.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-muted-foreground">
                    {t("noProblemSets")}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
