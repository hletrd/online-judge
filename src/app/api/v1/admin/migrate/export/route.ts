import { NextRequest, NextResponse } from "next/server";
import { getApiUser, unauthorized, forbidden } from "@/lib/api/auth";
import { consumeApiRateLimit } from "@/lib/security/api-rate-limit";
import { exportDatabase } from "@/lib/db/export";
import { recordAuditEvent } from "@/lib/audit/events";
import { logger } from "@/lib/logger";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const user = await getApiUser(request);
    if (!user) return unauthorized();
    if (user.role !== "super_admin") return forbidden();

    const rateLimitResponse = consumeApiRateLimit(request, "admin:migrate-export");
    if (rateLimitResponse) return rateLimitResponse;

    const data = await exportDatabase();

    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    const filename = `judgekit-export-${timestamp}.json`;

    recordAuditEvent({
      actorId: user.id,
      actorRole: user.role,
      action: "system_settings.data_exported",
      resourceType: "system_settings",
      resourceId: "database",
      resourceLabel: "Database export",
      summary: `Exported database (${Object.keys(data.tables).length} tables, ${Object.values(data.tables).reduce((sum, t) => sum + t.rowCount, 0)} rows)`,
      request,
    });

    const json = JSON.stringify(data, null, 2);

    return new Response(json, {
      headers: {
        "Content-Type": "application/json",
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    logger.error({ err: error }, "Database export error");
    return NextResponse.json({ error: "exportFailed" }, { status: 500 });
  }
}
