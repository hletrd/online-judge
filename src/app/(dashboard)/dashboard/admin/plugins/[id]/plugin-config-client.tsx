"use client";

import { lazy, Suspense, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { updatePluginConfig } from "@/lib/actions/plugins";
import { getPluginDefinition } from "@/lib/plugins/registry";

interface PluginConfigClientProps {
  pluginId: string;
  config: Record<string, unknown>;
}

export function PluginConfigClient({ pluginId, config }: PluginConfigClientProps) {
  const router = useRouter();
  const t = useTranslations("plugins");

  const definition = useMemo(() => getPluginDefinition(pluginId), [pluginId]);

  const AdminComponent = useMemo(() => {
    if (!definition) return null;
    return lazy(definition.getAdminComponent);
  }, [definition]);

  const handleSave = useCallback(async (newConfig: Record<string, unknown>) => {
    const result = await updatePluginConfig(pluginId, newConfig);
    if (result.success) {
      toast.success(t("chatWidget.configSaved"));
      router.refresh();
    } else {
      toast.error(t("chatWidget.configError"));
    }
    return result;
  }, [pluginId, router, t]);

  if (!AdminComponent) return null;

  return (
    <Suspense fallback={<div className="animate-pulse h-96 bg-muted rounded-lg" />}>
      <AdminComponent
        pluginId={pluginId}
        config={config}
        onSave={handleSave}
      />
    </Suspense>
  );
}
