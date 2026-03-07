import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { submissions, submissionResults, testCases } from "@/lib/db/schema";
import { eq, asc } from "drizzle-orm";
import { nanoid } from "nanoid";

function isJudgeAuthorized(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  if (!authHeader?.startsWith("Bearer ")) return false;
  return authHeader.slice(7) === process.env.JUDGE_AUTH_TOKEN;
}

export async function GET(request: NextRequest) {
  try {
    if (!isJudgeAuthorized(request)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Find the oldest pending submission
    const pending = await db.query.submissions.findFirst({
      where: eq(submissions.status, "pending"),
      orderBy: [asc(submissions.submittedAt)],
    });

    if (!pending) {
      return NextResponse.json({ data: null });
    }

    // Atomically claim it by updating status to "queued"
    await db
      .update(submissions)
      .set({ status: "queued" })
      .where(eq(submissions.id, pending.id));

    // Fetch test cases for the problem
    const cases = await db
      .select()
      .from(testCases)
      .where(eq(testCases.problemId, pending.problemId))
      .orderBy(asc(testCases.sortOrder));

    return NextResponse.json({ data: { ...pending, status: "queued", testCases: cases } });
  } catch (error) {
    console.error("GET /api/v1/judge/poll error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    if (!isJudgeAuthorized(request)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { submissionId, status, compileOutput, results } = body;

    if (!submissionId || typeof submissionId !== "string") {
      return NextResponse.json({ error: "submissionId is required" }, { status: 400 });
    }
    if (!status || typeof status !== "string") {
      return NextResponse.json({ error: "status is required" }, { status: 400 });
    }

    const submission = await db.query.submissions.findFirst({
      where: eq(submissions.id, submissionId),
    });

    if (!submission) {
      return NextResponse.json({ error: "Submission not found" }, { status: 404 });
    }

    // Calculate aggregate score and timing from results
    let score: number | null = null;
    let maxExecutionTimeMs: number | null = null;
    let maxMemoryUsedKb: number | null = null;

    if (Array.isArray(results) && results.length > 0) {
      const passed = results.filter((r: { status: string }) => r.status === "accepted").length;
      score = (passed / results.length) * 100;

      const times = results
        .map((r: { executionTimeMs?: number }) => r.executionTimeMs)
        .filter((t): t is number => typeof t === "number");
      if (times.length > 0) maxExecutionTimeMs = Math.max(...times);

      const mems = results
        .map((r: { memoryUsedKb?: number }) => r.memoryUsedKb)
        .filter((m): m is number => typeof m === "number");
      if (mems.length > 0) maxMemoryUsedKb = Math.max(...mems);
    }

    // Update submission
    await db
      .update(submissions)
      .set({
        status,
        compileOutput: compileOutput ?? null,
        score,
        executionTimeMs: maxExecutionTimeMs,
        memoryUsedKb: maxMemoryUsedKb,
        judgedAt: new Date(),
      })
      .where(eq(submissions.id, submissionId));

    // Insert per-test-case results
    if (Array.isArray(results) && results.length > 0) {
      const rows = results.map((r: {
        testCaseId: string;
        status: string;
        actualOutput?: string;
        executionTimeMs?: number;
        memoryUsedKb?: number;
      }) => ({
        id: nanoid(),
        submissionId,
        testCaseId: r.testCaseId,
        status: r.status,
        actualOutput: r.actualOutput ?? null,
        executionTimeMs: r.executionTimeMs ?? null,
        memoryUsedKb: r.memoryUsedKb ?? null,
      }));

      await db.insert(submissionResults).values(rows);
    }

    const updated = await db.query.submissions.findFirst({
      where: eq(submissions.id, submissionId),
    });

    return NextResponse.json({ data: updated });
  } catch (error) {
    console.error("POST /api/v1/judge/poll error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
