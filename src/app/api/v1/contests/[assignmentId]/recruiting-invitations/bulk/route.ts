import { NextRequest } from "next/server";
import { createApiHandler, isAdmin } from "@/lib/api/handler";
import { apiSuccess, apiError } from "@/lib/api/responses";
import { bulkCreateRecruitingInvitations } from "@/lib/assignments/recruiting-invitations";
import { bulkCreateRecruitingInvitationsSchema } from "@/lib/validators/recruiting-invitations";
import { recordAuditEvent } from "@/lib/audit/events";

export const POST = createApiHandler({
  schema: bulkCreateRecruitingInvitationsSchema,
  handler: async (req: NextRequest, { user, params, body }) => {
    if (!isAdmin(user.role)) return apiError("forbidden", 403);

    const { assignmentId } = params;
    const created = await bulkCreateRecruitingInvitations({
      assignmentId,
      invitations: body.invitations.map((inv) => ({
        candidateName: inv.candidateName,
        candidateEmail: inv.candidateEmail,
        metadata: inv.metadata,
        expiresAt: inv.expiresAt ? new Date(inv.expiresAt) : null,
      })),
      createdBy: user.id,
    });

    recordAuditEvent({
      actorId: user.id,
      actorRole: user.role,
      action: "recruiting_invitation.bulk_created",
      resourceType: "recruiting_invitation",
      resourceId: assignmentId,
      resourceLabel: `${created.length} invitations`,
      summary: `Bulk created ${created.length} recruiting invitations`,
      details: { assignmentId, count: created.length },
      request: req,
    });

    return apiSuccess(created, { status: 201 });
  },
});
