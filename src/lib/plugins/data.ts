import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { plugins } from "@/lib/db/schema";
import { getAllPluginDefinitions, getPluginDefinition } from "./registry";
import type { PluginState } from "./types";

export async function getPluginState(pluginId: string): Promise<PluginState | null> {
  const definition = getPluginDefinition(pluginId);
  if (!definition) return null;

  const row = await db.query.plugins.findFirst({
    where: eq(plugins.id, pluginId),
  });

  return {
    id: pluginId,
    enabled: row?.enabled ?? false,
    config: (row?.config as Record<string, unknown>) ?? { ...definition.defaultConfig },
    definition,
    updatedAt: row?.updatedAt ?? null,
  };
}

export async function getAllPluginStates(): Promise<PluginState[]> {
  const definitions = getAllPluginDefinitions();
  const rows = await db.select().from(plugins);
  const rowMap = new Map(rows.map((r) => [r.id, r]));

  return definitions.map((def) => {
    const row = rowMap.get(def.id);
    return {
      id: def.id,
      enabled: row?.enabled ?? false,
      config: (row?.config as Record<string, unknown>) ?? { ...def.defaultConfig },
      definition: def,
      updatedAt: row?.updatedAt ?? null,
    };
  });
}

export async function isPluginEnabled(pluginId: string): Promise<boolean> {
  const row = await db.query.plugins.findFirst({
    where: eq(plugins.id, pluginId),
    columns: { enabled: true },
  });
  return row?.enabled ?? false;
}
