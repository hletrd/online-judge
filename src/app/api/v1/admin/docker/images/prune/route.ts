import { NextRequest } from "next/server";
import { z } from "zod";
import { createApiHandler } from "@/lib/api/handler";
import { apiSuccess } from "@/lib/api/responses";
import { pruneStaleDockerImages } from "@/lib/docker/client";
import { recordAuditEvent } from "@/lib/audit/events";
import { db } from "@/lib/db";
import { languageConfigs } from "@/lib/db/schema";

const pruneSchema = z.object({
  maxAgeDays: z.number().int().min(1).max(365).default(30),
});

export const POST = createApiHandler({
  auth: { roles: ["super_admin"] },
  schema: pruneSchema,
  handler: async (req: NextRequest, { body, user }) => {
    // Get in-use images from DB
    const configs = await db.select({ dockerImage: languageConfigs.dockerImage }).from(languageConfigs);
    const inUseSet = new Set(configs.map((c) => c.dockerImage));

    const result = await pruneStaleDockerImages(body.maxAgeDays, inUseSet);

    if (result.removed.length > 0) {
      recordAuditEvent({
        actorId: user.id,
        actorRole: user.role,
        action: "docker_image.pruned",
        resourceType: "docker_image",
        resourceId: "bulk_prune",
        summary: `Pruned ${result.removed.length} stale Docker images (>${body.maxAgeDays} days): ${result.removed.join(", ")}`,
        request: req,
      });
    }

    return apiSuccess({
      removed: result.removed,
      errors: result.errors,
      removedCount: result.removed.length,
    });
  },
});
