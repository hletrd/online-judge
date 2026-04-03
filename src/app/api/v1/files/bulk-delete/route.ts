import { inArray } from "drizzle-orm";
import { db } from "@/lib/db";
import { files } from "@/lib/db/schema";
import { createApiHandler, forbidden } from "@/lib/api/handler";
import { apiSuccess } from "@/lib/api/responses";
import { resolveCapabilities } from "@/lib/capabilities/cache";
import { recordAuditEvent } from "@/lib/audit/events";
import { deleteUploadedFile } from "@/lib/files/storage";
import { fileDeleteSchema } from "@/lib/validators/files";

export const POST = createApiHandler({
  rateLimit: "files:bulk_delete",
  schema: fileDeleteSchema,
  handler: async (req, { user, body }) => {
    const caps = await resolveCapabilities(user.role);
    if (!caps.has("files.manage")) return forbidden();

    const rows = await db
      .select({ id: files.id, storedName: files.storedName, originalName: files.originalName })
      .from(files)
      .where(inArray(files.id, body.ids));

    if (rows.length === 0) {
      return apiSuccess({ deleted: 0 });
    }

    // Delete from disk
    for (const row of rows) {
      deleteUploadedFile(row.storedName);
    }

    // Delete from DB
    const deletedIds = rows.map((r) => r.id);
    await db.delete(files).where(inArray(files.id, deletedIds));

    recordAuditEvent({
      actorId: user.id,
      actorRole: user.role,
      action: "file.bulk_deleted",
      resourceType: "file",
      resourceId: deletedIds.join(","),
      resourceLabel: `${rows.length} files`,
      summary: `Bulk deleted ${rows.length} files`,
      details: { count: rows.length, ids: deletedIds },
      request: req,
    });

    return apiSuccess({ deleted: rows.length });
  },
});
