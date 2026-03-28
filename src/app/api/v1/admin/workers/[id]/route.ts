import { NextRequest } from "next/server";
import { apiSuccess, apiError } from "@/lib/api/responses";
import { db } from "@/lib/db";
import { judgeWorkers, submissions } from "@/lib/db/schema";
import { eq, and, inArray } from "drizzle-orm";
import { getApiUser, unauthorized, forbidden, csrfForbidden } from "@/lib/api/auth";
import { resolveCapabilities } from "@/lib/capabilities/cache";
import { recordAuditEvent } from "@/lib/audit/events";
import { logger } from "@/lib/logger";
import { z } from "zod";

const updateWorkerSchema = z.object({
  alias: z.string().max(100).nullable().optional(),
});

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const csrfError = csrfForbidden(request);
    if (csrfError) return csrfError;

    const user = await getApiUser(request);
    if (!user) return unauthorized();

    const caps = await resolveCapabilities(user.role);
    if (!caps.has("system.settings")) return forbidden();

    const { id } = await params;
    const parsed = updateWorkerSchema.safeParse(await request.json());
    if (!parsed.success) {
      return apiError("invalidRequest", 400);
    }

    const worker = await db.query.judgeWorkers.findFirst({
      where: eq(judgeWorkers.id, id),
    });

    if (!worker) {
      return apiError("workerNotFound", 404);
    }

    const updates: Record<string, unknown> = {};
    if (parsed.data.alias !== undefined) {
      updates.alias = parsed.data.alias;
    }

    if (Object.keys(updates).length > 0) {
      db.update(judgeWorkers).set(updates).where(eq(judgeWorkers.id, id)).run();
    }

    const updated = await db
      .select({
        id: judgeWorkers.id,
        hostname: judgeWorkers.hostname,
        alias: judgeWorkers.alias,
        ipAddress: judgeWorkers.ipAddress,
        concurrency: judgeWorkers.concurrency,
        activeTasks: judgeWorkers.activeTasks,
        version: judgeWorkers.version,
        labels: judgeWorkers.labels,
        status: judgeWorkers.status,
        registeredAt: judgeWorkers.registeredAt,
        lastHeartbeatAt: judgeWorkers.lastHeartbeatAt,
        deregisteredAt: judgeWorkers.deregisteredAt,
      })
      .from(judgeWorkers)
      .where(eq(judgeWorkers.id, id))
      .then((rows) => rows[0] ?? null);

    return apiSuccess(updated);
  } catch (error) {
    logger.error({ err: error }, "PATCH /api/v1/admin/workers/[id] error");
    return apiError("internalServerError", 500);
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const csrfError = csrfForbidden(request);
    if (csrfError) return csrfError;

    const user = await getApiUser(request);
    if (!user) return unauthorized();

    const caps = await resolveCapabilities(user.role);
    if (!caps.has("system.settings")) return forbidden();

    const { id } = await params;

    const worker = await db.query.judgeWorkers.findFirst({
      where: eq(judgeWorkers.id, id),
    });

    if (!worker) {
      return apiError("workerNotFound", 404);
    }

    // Reclaim any in-flight submissions from this worker
    db.update(submissions)
      .set({
        status: "pending",
        judgeClaimToken: null,
        judgeClaimedAt: null,
        judgeWorkerId: null,
      })
      .where(
        and(
          eq(submissions.judgeWorkerId, id),
          inArray(submissions.status, ["queued", "judging"])
        )
      )
      .run();

    // Remove the worker record
    db.delete(judgeWorkers).where(eq(judgeWorkers.id, id)).run();

    recordAuditEvent({
      action: "judge_worker.force_removed",
      actorId: user.id,
      actorRole: user.role,
      resourceType: "judge_worker",
      resourceId: id,
      resourceLabel: worker.hostname,
      summary: `Force-removed judge worker ${worker.hostname} (${id})`,
      request,
    });

    logger.info(
      { workerId: id, hostname: worker.hostname, removedBy: user.id },
      "[admin/workers] Worker force-removed"
    );

    return apiSuccess({ ok: true });
  } catch (error) {
    logger.error({ err: error }, "DELETE /api/v1/admin/workers/[id] error");
    return apiError("internalServerError", 500);
  }
}
