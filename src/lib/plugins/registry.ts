import type { PluginDefinition } from "./types";
import { chatWidgetPlugin } from "./chat-widget/definition";

const PLUGIN_REGISTRY = new Map<string, PluginDefinition>([
  ["chat-widget", chatWidgetPlugin],
]);

export function getPluginDefinition(id: string): PluginDefinition | undefined {
  return PLUGIN_REGISTRY.get(id);
}

export function getAllPluginDefinitions(): PluginDefinition[] {
  return Array.from(PLUGIN_REGISTRY.values());
}

export function getPluginIds(): string[] {
  return Array.from(PLUGIN_REGISTRY.keys());
}
