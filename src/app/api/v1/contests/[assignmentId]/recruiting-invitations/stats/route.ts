import { NextRequest } from "next/server";
import { createApiHandler } from "@/lib/api/handler";
import { apiSuccess } from "@/lib/api/responses";
import { getInvitationStats } from "@/lib/assignments/recruiting-invitations";

export const GET = createApiHandler({
  auth: { capabilities: ["recruiting.manage_invitations"] },
  handler: async (_req: NextRequest, { params }) => {
    const stats = await getInvitationStats(params.assignmentId);
    return apiSuccess(stats);
  },
});
