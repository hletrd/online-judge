import { redirect, notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { auth } from "@/lib/auth";
import { getPluginState } from "@/lib/plugins/data";
import { PluginConfigClient } from "./plugin-config-client";

export default async function PluginConfigPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user) redirect("/login");
  if (session.user.role !== "admin" && session.user.role !== "super_admin") redirect("/dashboard");

  const { id } = await params;
  const pluginState = await getPluginState(id);
  if (!pluginState) notFound();

  const t = await getTranslations("plugins");

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">{t(pluginState.definition.nameKey)}</h2>
        <p className="text-sm text-muted-foreground">{t(pluginState.definition.descriptionKey)}</p>
      </div>
      <PluginConfigClient
        pluginId={id}
        config={pluginState.config}
      />
    </div>
  );
}
