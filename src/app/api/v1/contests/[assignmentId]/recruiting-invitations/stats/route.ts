import { NextRequest } from "next/server";
import { createApiHandler, isAdmin } from "@/lib/api/handler";
import { apiSuccess, apiError } from "@/lib/api/responses";
import { getInvitationStats } from "@/lib/assignments/recruiting-invitations";

export const GET = createApiHandler({
  handler: async (req: NextRequest, { user, params }) => {
    if (!isAdmin(user.role)) return apiError("forbidden", 403);
    const stats = await getInvitationStats(params.assignmentId);
    return apiSuccess(stats);
  },
});
