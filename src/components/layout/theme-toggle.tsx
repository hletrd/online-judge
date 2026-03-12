"use client";

import { useSyncExternalStore } from "react";
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

function subscribeToHydration() {
  return () => {};
}

function isThemeOption(value: string | undefined): value is ThemeOption {
  return value === "light" || value === "dark" || value === "system";
}

function ThemeTriggerIcon({ className, theme }: { className?: string; theme: ThemeOption | undefined }) {
  switch (theme) {
    case "light":
      return <SunMedium className={className} />;
    case "dark":
      return <MoonStar className={className} />;
    case "system":
      return <Monitor className={className} />;
    default:
      return <SunMoon className={className} />;
  }
}

export function ThemeToggle({ className }: { className?: string }) {
  const t = useTranslations("common");
  const { theme, setTheme } = useTheme();
  const mounted = useSyncExternalStore(subscribeToHydration, () => true, () => false);
  const selectedTheme = mounted && isThemeOption(theme) ? theme : "system";

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
        <ThemeTriggerIcon className="size-4" theme={mounted ? selectedTheme : undefined} />
        <span className="sr-only">{t("theme")}</span>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40">
        <DropdownMenuGroup>
          <DropdownMenuLabel>{t("theme")}</DropdownMenuLabel>
          <DropdownMenuRadioGroup
            value={selectedTheme}
            onValueChange={(value) => {
              if (isThemeOption(value)) {
                setTheme(value);
              }
            }}
          >
            {themeOptions.map(({ value, icon: Icon, labelKey }) => (
              <DropdownMenuRadioItem key={value} value={value} className="gap-2">
                <Icon className="size-4 text-muted-foreground" />
                {t(labelKey)}
              </DropdownMenuRadioItem>
            ))}
          </DropdownMenuRadioGroup>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
