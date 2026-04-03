import { z } from "zod";

export const fileDeleteSchema = z.object({
  ids: z.array(z.string().min(1)).min(1).max(100),
});

export type FileDeleteInput = z.infer<typeof fileDeleteSchema>;

export const fileListQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  category: z.enum(["all", "image", "attachment"]).default("all"),
  search: z.string().max(200).default(""),
});

export type FileListQuery = z.infer<typeof fileListQuerySchema>;
