import { getTranslations } from "next-intl/server";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getRecruitingInvitationByToken } from "@/lib/assignments/recruiting-invitations";
import { db } from "@/lib/db";
import { assignments } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
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

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">{t("title")}</CardTitle>
        <CardDescription>
          {t("welcome", { name: invitation.candidateName })}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2 text-sm text-muted-foreground">
          <p className="font-medium text-foreground">{assignment.title}</p>
          {assignment.examDurationMinutes && (
            <p>{t("duration", { minutes: assignment.examDurationMinutes })}</p>
          )}
          <p className="text-xs">{t("instructions")}</p>
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
