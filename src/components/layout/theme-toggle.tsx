"use client";

import { useEffect, useState } from "react";
import { Monitor, MoonStar, SunMedium, SunMoon } from "lucide-react";
import { useTheme } from "next-themes";
import { useTranslations } from "next-intl";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

type ThemeOption = "light" | "dark" | "system";

const themeOptions: Array<{
  value: ThemeOption;
  icon: typeof SunMedium;
  labelKey: ThemeOption;
}> = [
  { value: "light", icon: SunMedium, labelKey: "light" },
  { value: "dark", icon: MoonStar, labelKey: "dark" },
  { value: "system", icon: Monitor, labelKey: "system" },
];

function getThemeIcon(theme: ThemeOption | undefined) {
  switch (theme) {
    case "light":
      return SunMedium;
    case "dark":
      return MoonStar;
    case "system":
      return Monitor;
    default:
      return SunMoon;
  }
}

export function ThemeToggle({ className }: { className?: string }) {
  const t = useTranslations("common");
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const selectedTheme = mounted ? ((theme as ThemeOption | undefined) ?? "system") : "system";
  const TriggerIcon = getThemeIcon(mounted ? selectedTheme : undefined);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label={t("theme")}
        className={cn(
          "inline-flex h-9 w-9 items-center justify-center rounded-md text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
          className,
        )}
        disabled={!mounted}
      >
        <TriggerIcon className="h-4 w-4" />
        <span className="sr-only">{t("theme")}</span>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40">
        <DropdownMenuGroup>
          <DropdownMenuLabel>{t("theme")}</DropdownMenuLabel>
          <DropdownMenuRadioGroup value={selectedTheme} onValueChange={setTheme}>
            {themeOptions.map(({ value, icon: Icon, labelKey }) => (
              <DropdownMenuRadioItem key={value} value={value} className="gap-2">
                <Icon className="h-4 w-4 text-muted-foreground" />
                {t(labelKey)}
              </DropdownMenuRadioItem>
            ))}
          </DropdownMenuRadioGroup>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
