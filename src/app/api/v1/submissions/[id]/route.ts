import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { submissions } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { getApiUser, unauthorized, forbidden, notFound, isAdmin } from "@/lib/api/auth";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getApiUser(request);
    if (!user) return unauthorized();

    const { id } = await params;
    const submission = await db.query.submissions.findFirst({
      where: eq(submissions.id, id),
      with: {
        results: {
          with: {
            testCase: true,
          },
        },
      },
    });

    if (!submission) return notFound("Submission");

    if (!isAdmin(user.role) && submission.userId !== user.id) {
      return forbidden();
    }

    return NextResponse.json({ data: submission });
  } catch (error) {
    console.error("GET /api/v1/submissions/[id] error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
