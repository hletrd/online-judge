import { z } from "zod";

export const chatWidgetConfigSchema = z.object({
  provider: z.enum(["openai", "claude", "gemini"]).default("openai"),
  openaiApiKey: z.string().max(200).default(""),
  openaiModel: z.string().max(100).default("gpt-4o-mini"),
  claudeApiKey: z.string().max(200).default(""),
  claudeModel: z.string().max(100).default("claude-sonnet-4-20250514"),
  geminiApiKey: z.string().max(200).default(""),
  geminiModel: z.string().max(100).default("gemini-2.0-flash"),
  systemPrompt: z.string().max(10000).default(""),
  knowledgeBase: z.string().max(50000).default(""),
  maxTokens: z.number().int().min(100).max(8192).default(2048),
  rateLimitPerMinute: z.number().int().min(1).max(100).default(10),
});

export type ChatWidgetConfig = z.infer<typeof chatWidgetConfigSchema>;
