import { NextRequest } from "next/server";
import { z } from "zod";
import { createApiHandler } from "@/lib/api/handler";
import { apiSuccess } from "@/lib/api/responses";
import { db } from "@/lib/db";
import { tags, problemTags } from "@/lib/db/schema";
import { asc, count, eq } from "drizzle-orm";
import { recordAuditEvent } from "@/lib/audit/events";

const createTagSchema = z.object({
  name: z.string().min(1).max(100).transform((s) => s.trim()),
  color: z.string().max(20).nullable().optional(),
});

export const GET = createApiHandler({
  auth: { capabilities: ["system.settings"] },
  handler: async () => {
    const tagList = await db
      .select({
        id: tags.id,
        name: tags.name,
        color: tags.color,
        createdBy: tags.createdBy,
        createdAt: tags.createdAt,
        problemCount: count(problemTags.id),
      })
      .from(tags)
      .leftJoin(problemTags, eq(tags.id, problemTags.tagId))
      .groupBy(tags.id)
      .orderBy(asc(tags.name));

    return apiSuccess(tagList);
  },
});

export const POST = createApiHandler({
  auth: { capabilities: ["system.settings"] },
  rateLimit: "tags:create",
  schema: createTagSchema,
  handler: async (req: NextRequest, { user, body }) => {
    const [created] = await db
      .insert(tags)
      .values({
        name: body.name,
        color: body.color ?? null,
        createdBy: user.id,
      })
      .returning({ id: tags.id, name: tags.name, color: tags.color });

    recordAuditEvent({
      actorId: user.id,
      actorRole: user.role,
      action: "tag.created",
      resourceType: "tag",
      resourceId: created.id,
      resourceLabel: created.name,
      summary: `Created tag "${created.name}"`,
      details: { name: body.name, color: body.color ?? null },
      request: req,
    });

    return apiSuccess(created, { status: 201 });
  },
});
