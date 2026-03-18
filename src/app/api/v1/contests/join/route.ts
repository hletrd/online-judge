import { NextRequest } from "next/server";
import { getApiUser, unauthorized, csrfForbidden } from "@/lib/api/auth";
import { apiSuccess, apiError } from "@/lib/api/responses";
import { redeemAccessCode } from "@/lib/assignments/access-codes";
import { redeemAccessCodeSchema } from "@/lib/validators/access-codes";
import { consumeApiRateLimit } from "@/lib/security/api-rate-limit";
import { logger } from "@/lib/logger";

export async function POST(request: NextRequest) {
  try {
    const csrfError = csrfForbidden(request);
    if (csrfError) return csrfError;

    const rateLimitResponse = consumeApiRateLimit(request, "contest:join");
    if (rateLimitResponse) return rateLimitResponse;

    const user = await getApiUser(request);
    if (!user) return unauthorized();

    const parsed = redeemAccessCodeSchema.safeParse(await request.json());
    if (!parsed.success) {
      return apiError(parsed.error.issues[0]?.message ?? "invalidAccessCode", 400);
    }

    const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? null;
    const result = redeemAccessCode(parsed.data.code, user.id, ip ?? undefined);

    if (!result.ok) {
      return apiError(result.error, 400);
    }

    return apiSuccess({
      assignmentId: result.assignmentId,
      groupId: result.groupId,
      alreadyEnrolled: result.alreadyEnrolled ?? false,
    });
  } catch (error) {
    logger.error({ err: error }, "POST /api/v1/contests/join error");
    return apiError("joinFailed", 500);
  }
}
