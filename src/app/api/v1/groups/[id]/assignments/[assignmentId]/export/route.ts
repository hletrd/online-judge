import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { assignments, groups } from "@/lib/db/schema";
import { forbidden, notFound } from "@/lib/api/handler";
import { canManageGroupResourcesAsync } from "@/lib/assignments/management";
import { getAssignmentStatusRows } from "@/lib/assignments/submissions";
import { contentDispositionAttachment } from "@/lib/http/content-disposition";
import { escapeCsvField } from "@/lib/csv/escape-field";
import { createApiHandler } from "@/lib/api/handler";

/** Hard cap to prevent OOM on large groups — matches the CSV-01 limit applied to
 *  contest export, audit-logs, login-logs, and submissions exports in prior cycles. */
const MAX_EXPORT_ROWS = 10_000;

export const GET = createApiHandler({
  rateLimit: "export",
  handler: async (req: NextRequest, { user, params }) => {
    const { id, assignmentId } = params;

    const group = await db.query.groups.findFirst({
      where: eq(groups.id, id),
      columns: { id: true, instructorId: true },
    });

    if (!group) return notFound("Group");

    const canManage = await canManageGroupResourcesAsync(
      group.instructorId,
      user.id,
      user.role,
      id
    );

    if (!canManage) {
      return forbidden();
    }

    const assignment = await db.query.assignments.findFirst({
      where: eq(assignments.id, assignmentId),
      columns: { id: true, groupId: true, title: true },
    });

    if (!assignment || assignment.groupId !== id) {
      return notFound("Assignment");
    }

    const statusData = await getAssignmentStatusRows(assignmentId);

    if (!statusData) {
      return notFound("Assignment");
    }

    // Truncate to prevent OOM on very large groups
    const truncated = statusData.rows.length > MAX_EXPORT_ROWS;
    const rows = truncated ? statusData.rows.slice(0, MAX_EXPORT_ROWS) : statusData.rows;

    // BOM for Excel UTF-8 compatibility
    const BOM = "\uFEFF";

    const header = ["Student Name", "Username", "Class", "Status", "Score", "Submitted At"]
      .map(escapeCsvField)
      .join(",");

    const dataRows = rows.map((row) => {
      const submittedAt = row.latestSubmittedAt
        ? row.latestSubmittedAt.toISOString()
        : "";
      const status = row.latestStatus ?? "";
      const score = row.bestTotalScore ?? "";

      return [row.name, row.username, row.className, status, String(score), submittedAt]
        .map(escapeCsvField)
        .join(",");
    });

    const csv = BOM + [header, ...dataRows, ...(truncated ? [`# Truncated: showing ${MAX_EXPORT_ROWS} of ${statusData.rows.length} entries`] : [])].join("\r\n") + "\r\n";

    return new NextResponse(csv, {
      status: 200,
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": contentDispositionAttachment(`assignment-${assignment.title}-grades`, ".csv"),
      },
    });
  },
});
