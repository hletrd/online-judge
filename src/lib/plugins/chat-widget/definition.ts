import type { PluginDefinition } from "@/lib/plugins/types";
import { chatWidgetConfigSchema } from "./schema";

export const chatWidgetPlugin: PluginDefinition = {
  id: "chat-widget",
  nameKey: "chatWidget.name",
  descriptionKey: "chatWidget.description",
  configSchema: chatWidgetConfigSchema,
  defaultConfig: {
    provider: "openai",
    openaiApiKey: "",
    openaiModel: "gpt-4o-mini",
    claudeApiKey: "",
    claudeModel: "claude-sonnet-4-20250514",
    geminiApiKey: "",
    geminiModel: "gemini-2.0-flash",
    systemPrompt: "",
    knowledgeBase: "",
    maxTokens: 2048,
    rateLimitPerMinute: 10,
  },
  getAdminComponent: () => import("./admin-config"),
  getWidgetComponent: () => import("./chat-widget"),
};
