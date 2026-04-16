import { NextRequest } from "next/server";
import { and, asc, count, desc, eq, sql } from "drizzle-orm";
import { createApiHandler } from "@/lib/api/handler";
import { apiError, apiSuccess } from "@/lib/api/responses";
import { db } from "@/lib/db";
import { problems, submissions, users } from "@/lib/db/schema";
import { normalizePage, normalizePageSize } from "@/lib/pagination";

const DEFAULT_SORT = "newest";
const VALID_SORTS = new Set(["shortest", "fastest", "newest"]);

export const GET = createApiHandler({
  auth: false,
  rateLimit: "accepted-solutions",
  handler: async (req: NextRequest, { params }) => {
    const { id } = params;
    const problem = await db.query.problems.findFirst({
      where: eq(problems.id, id),
      columns: {
        id: true,
        visibility: true,
      },
    });

    if (!problem || problem.visibility !== "public") {
      return apiError("notFound", 404);
    }

    const rawSort = req.nextUrl.searchParams.get("sort")?.trim() ?? DEFAULT_SORT;
    const sort = VALID_SORTS.has(rawSort) ? rawSort : DEFAULT_SORT;
    const language = req.nextUrl.searchParams.get("language")?.trim() ?? "";
    const page = normalizePage(req.nextUrl.searchParams.get("page") ?? undefined);
    const pageSize = normalizePageSize(req.nextUrl.searchParams.get("pageSize") ?? undefined);
    const offset = (page - 1) * pageSize;

    const whereClause = and(
      eq(submissions.problemId, id),
      eq(submissions.status, "accepted"),
      language ? eq(submissions.language, language) : undefined,
    );

    const [countRow] = await db
      .select({ total: count() })
      .from(submissions)
      .where(whereClause);
    const total = Number(countRow?.total ?? 0);

    const orderByClause =
      sort === "shortest"
        ? [asc(sql<number>`octet_length(${submissions.sourceCode})`), desc(submissions.submittedAt)]
        : sort === "fastest"
          ? [asc(sql<number>`coalesce(${submissions.executionTimeMs}, 2147483647)`), desc(submissions.submittedAt)]
          : [desc(submissions.submittedAt)];

    const solutions = await db
      .select({
        submissionId: submissions.id,
        userId: submissions.userId,
        username: users.username,
        language: submissions.language,
        sourceCode: submissions.sourceCode,
        codeLength: sql<number>`octet_length(${submissions.sourceCode})`,
        executionTimeMs: submissions.executionTimeMs,
        memoryUsedKb: submissions.memoryUsedKb,
        submittedAt: submissions.submittedAt,
      })
      .from(submissions)
      .innerJoin(users, eq(submissions.userId, users.id))
      .where(whereClause)
      .orderBy(...orderByClause)
      .limit(pageSize)
      .offset(offset);

    return apiSuccess({
      solutions: solutions.map((solution) => ({
        ...solution,
        isAnonymous: false,
      })),
      total,
      page,
      pageSize,
    });
  },
});
