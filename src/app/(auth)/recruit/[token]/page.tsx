import { getTranslations } from "next-intl/server";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getRecruitingInvitationByToken } from "@/lib/assignments/recruiting-invitations";
import { db } from "@/lib/db";
import { assignmentProblems, assignments } from "@/lib/db/schema";
import { eq, sql } from "drizzle-orm";
import { RecruitStartForm } from "./recruit-start-form";

export default async function RecruitPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const t = await getTranslations("recruit");

  const invitation = await getRecruitingInvitationByToken(token);

  if (!invitation) {
    return (
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">{t("invalidToken")}</CardTitle>
          <CardDescription>{t("invalidTokenDescription")}</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  if (invitation.status === "revoked") {
    return (
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">{t("invalidToken")}</CardTitle>
          <CardDescription>{t("invalidTokenDescription")}</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  if (invitation.expiresAt && invitation.expiresAt < new Date()) {
    return (
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">{t("expired")}</CardTitle>
          <CardDescription>{t("expiredDescription")}</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const [assignment] = await db
    .select({
      id: assignments.id,
      title: assignments.title,
      description: assignments.description,
      examDurationMinutes: assignments.examDurationMinutes,
      deadline: assignments.deadline,
    })
    .from(assignments)
    .where(eq(assignments.id, invitation.assignmentId))
    .limit(1);

  if (!assignment) {
    return (
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">{t("invalidToken")}</CardTitle>
          <CardDescription>{t("invalidTokenDescription")}</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  if (assignment.deadline && assignment.deadline < new Date()) {
    return (
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">{t("contestClosed")}</CardTitle>
          <CardDescription>{t("contestClosedDescription")}</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const isRedeemed = invitation.status === "redeemed" && invitation.userId;

  const [problemCountRow] = await db
    .select({ count: sql<number>`count(*)` })
    .from(assignmentProblems)
    .where(eq(assignmentProblems.assignmentId, assignment.id));
  const problemCount = Number(problemCountRow?.count ?? 0);

  return (
    <Card className="w-full max-w-lg">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">{t("title")}</CardTitle>
        <CardDescription>
          {t("welcome", { name: invitation.candidateName })}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <p className="font-semibold text-foreground text-lg text-center">{assignment.title}</p>
          {assignment.description && (
            <p className="text-sm text-muted-foreground">{assignment.description}</p>
          )}
          <div className="rounded-lg bg-muted/50 p-3 space-y-1.5 text-sm">
            {problemCount > 0 && (
              <p>{t("problemCount", { count: problemCount })}</p>
            )}
            {assignment.examDurationMinutes && (
              <p>{t("durationDetail", { minutes: assignment.examDurationMinutes })}</p>
            )}
            {assignment.deadline && (
              <p>{t("deadlineInfo", { date: new Date(assignment.deadline).toLocaleString() })}</p>
            )}
          </div>
          <div className="rounded-lg border border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-950/30 p-3 space-y-1 text-sm">
            <p className="font-medium text-amber-800 dark:text-amber-200">{t("importantNotes")}</p>
            <ul className="list-disc list-inside text-xs text-amber-700 dark:text-amber-300 space-y-0.5">
              <li>{t("noteTimer")}</li>
              <li>{t("noteSubmissions")}</li>
              <li>{t("noteCompletion")}</li>
            </ul>
          </div>
        </div>
        <RecruitStartForm
          token={token}
          assignmentId={assignment.id}
          isReentry={!!isRedeemed}
        />
      </CardContent>
    </Card>
  );
}
