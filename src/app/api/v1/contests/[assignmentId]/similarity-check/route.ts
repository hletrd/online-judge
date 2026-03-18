import { NextRequest } from "next/server";
import { getApiUser, unauthorized, csrfForbidden, isAdmin, isInstructor } from "@/lib/api/auth";
import { apiSuccess, apiError } from "@/lib/api/responses";
import { runAndStoreSimilarityCheck } from "@/lib/assignments/code-similarity";
import { sqlite } from "@/lib/db";
import { logger } from "@/lib/logger";

type AssignmentRow = {
  groupId: string;
  instructorId: string | null;
  examMode: string;
};

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ assignmentId: string }> }
) {
  try {
    const csrfError = csrfForbidden(request);
    if (csrfError) return csrfError;

    const user = await getApiUser(request);
    if (!user) return unauthorized();

    const { assignmentId } = await params;

    const assignment = sqlite
      .prepare<[string], AssignmentRow>(
        `SELECT a.group_id AS groupId, g.instructor_id AS instructorId, a.exam_mode AS examMode
         FROM assignments a INNER JOIN groups g ON g.id = a.group_id WHERE a.id = ?`
      )
      .get(assignmentId);

    if (!assignment || assignment.examMode === "none") {
      return apiError("notFound", 404);
    }

    const canManage =
      isAdmin(user.role) ||
      (isInstructor(user.role) && assignment.instructorId === user.id);

    if (!canManage) {
      return apiError("forbidden", 403);
    }

    const flaggedCount = runAndStoreSimilarityCheck(assignmentId);

    return apiSuccess({ flaggedPairs: flaggedCount });
  } catch (error) {
    logger.error({ err: error }, "POST similarity-check error");
    return apiError("serverError", 500);
  }
}
