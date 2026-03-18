import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createApiHandler } from "@/lib/api/handler";
import { apiSuccess } from "@/lib/api/responses";
import { listDockerImages, pullDockerImage } from "@/lib/docker/client";

export const GET = createApiHandler({
  auth: { roles: ["admin", "super_admin"] },
  handler: async (req: NextRequest) => {
    const filter = req.nextUrl.searchParams.get("filter") ?? "judge-*";
    const images = await listDockerImages(filter);
    return apiSuccess(images);
  },
});

const pullSchema = z.object({
  imageTag: z.string().min(1).max(256),
});

export const POST = createApiHandler({
  auth: { roles: ["admin", "super_admin"] },
  schema: pullSchema,
  handler: async (_req: NextRequest, { body }) => {
    const result = await pullDockerImage(body.imageTag);
    if (!result.success) {
      return NextResponse.json(
        { error: result.error ?? "pullFailed" },
        { status: 500 }
      );
    }
    return apiSuccess({ pulled: body.imageTag });
  },
});
