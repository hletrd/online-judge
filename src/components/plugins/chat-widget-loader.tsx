import { isPluginEnabled } from "@/lib/plugins/data";
import { getPluginDefinition } from "@/lib/plugins/registry";

export async function ChatWidgetLoader() {
  const enabled = await isPluginEnabled("chat-widget");
  if (!enabled) return null;

  const definition = getPluginDefinition("chat-widget");
  if (!definition?.getWidgetComponent) return null;

  const { default: ChatWidget } = await definition.getWidgetComponent();
  return <ChatWidget />;
}
