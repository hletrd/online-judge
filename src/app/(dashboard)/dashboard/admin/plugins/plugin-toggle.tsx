"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { togglePlugin } from "@/lib/actions/plugins";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";

type PluginToggleProps = {
  pluginId: string;
  enabled: boolean;
};

export function PluginToggle({ pluginId, enabled }: PluginToggleProps) {
  const router = useRouter();
  const t = useTranslations("plugins");
  const [isEnabled, setIsEnabled] = useState(enabled);
  const [isLoading, setIsLoading] = useState(false);

  async function handleToggle(checked: boolean) {
    setIsLoading(true);
    const prev = isEnabled;
    setIsEnabled(checked);

    try {
      const result = await togglePlugin(pluginId, checked);

      if (!result.success) {
        setIsEnabled(prev);
        toast.error(t("toggleFailed"));
        return;
      }

      toast.success(checked ? t("enableSuccess") : t("disableSuccess"));
      router.refresh();
    } catch {
      setIsEnabled(prev);
      toast.error(t("toggleFailed"));
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex items-center gap-2">
      <Checkbox
        checked={isEnabled}
        onCheckedChange={handleToggle}
        disabled={isLoading}
        aria-label={isEnabled ? t("enabled") : t("disabled")}
      />
      <Badge variant={isEnabled ? "success" : "outline"}>
        {isEnabled ? t("enabled") : t("disabled")}
      </Badge>
    </div>
  );
}
