import { isPluginEnabled } from "@/lib/plugins/data";
import { getPluginDefinition } from "@/lib/plugins/registry";
import { isAiAssistantEnabled } from "@/lib/system-settings";

export async function ChatWidgetLoader() {
  const [enabled, aiEnabled] = await Promise.all([
    isPluginEnabled("chat-widget"),
    isAiAssistantEnabled(),
  ]);

  if (!enabled || !aiEnabled) return null;

  const definition = getPluginDefinition("chat-widget");
  if (!definition?.getWidgetComponent) return null;

  const { default: ChatWidget } = await definition.getWidgetComponent();
  return <ChatWidget />;
}
