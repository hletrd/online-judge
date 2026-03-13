import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { auth } from "@/lib/auth";
import { isInstructorOrAbove } from "@/lib/auth/role-helpers";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { problems } from "@/lib/db/schema";
import ProblemSetForm from "../_components/problem-set-form";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("problemSets");
  return { title: t("createTitle") };
}

export default async function NewProblemSetPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");
  if (!isInstructorOrAbove(session.user.role)) redirect("/dashboard");

  const allProblems = await db
    .select({ id: problems.id, title: problems.title })
    .from(problems);

  const allGroups = await db.query.groups.findMany({
    columns: { id: true, name: true },
  });

  return (
    <ProblemSetForm
      availableProblems={allProblems}
      availableGroups={allGroups}
    />
  );
}
