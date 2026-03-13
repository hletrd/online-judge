import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { auth } from "@/lib/auth";
import { isInstructorOrAbove } from "@/lib/auth/role-helpers";
import { redirect, notFound } from "next/navigation";
import { db } from "@/lib/db";
import { eq } from "drizzle-orm";
import { problemSets, problems } from "@/lib/db/schema";
import ProblemSetForm from "../_components/problem-set-form";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("problemSets");
  return { title: t("editTitle") };
}

export default async function ProblemSetDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();
  if (!session?.user) redirect("/login");
  if (!isInstructorOrAbove(session.user.role)) redirect("/dashboard");

  const { id } = await params;

  const ps = await db.query.problemSets.findFirst({
    where: eq(problemSets.id, id),
    with: {
      problems: {
        with: {
          problem: {
            columns: { id: true, title: true },
          },
        },
      },
      groupAccess: {
        with: {
          group: {
            columns: { id: true, name: true },
          },
        },
      },
    },
  });

  if (!ps) notFound();

  const allProblems = await db
    .select({ id: problems.id, title: problems.title })
    .from(problems);

  const allGroups = await db.query.groups.findMany({
    columns: { id: true, name: true },
  });

  return (
    <ProblemSetForm
      problemSet={{
        id: ps.id,
        name: ps.name,
        description: ps.description ?? "",
        problemIds: ps.problems
          .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0))
          .map((p) => p.problemId),
        groupIds: ps.groupAccess.map((ga) => ga.groupId),
        assignedGroups: ps.groupAccess.map((ga) => ({
          id: ga.group.id,
          name: ga.group.name,
        })),
      }}
      availableProblems={allProblems}
      availableGroups={allGroups}
    />
  );
}
