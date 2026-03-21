"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { updateProfile } from "@/lib/actions/update-profile";
import { useRouter } from "next/navigation";

type LanguageOption = {
  value: string;
  label: string;
};

export default function ProfileForm({
  initialName,
  initialClassName,
  initialPreferredLanguage,
  initialPreferredTheme,
  languages,
}: {
  initialName: string;
  initialClassName: string;
  initialPreferredLanguage: string;
  initialPreferredTheme: string;
  languages: LanguageOption[];
}) {
  const t = useTranslations("profile");
  const tCommon = useTranslations("common");
  const router = useRouter();
  const { setTheme } = useTheme();

  const [name, setName] = useState(initialName);
  const [className, setClassName] = useState(initialClassName);
  const [preferredLanguage, setPreferredLanguage] = useState(initialPreferredLanguage);
  const languageLabelMap = Object.fromEntries(languages.map((l) => [l.value, l.label]));
  const [preferredTheme, setPreferredTheme] = useState(initialPreferredTheme);
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);

    try {
      const result = await updateProfile({
        name,
        className,
        preferredLanguage: preferredLanguage || undefined,
        preferredTheme: (preferredTheme as "light" | "dark" | "system") || undefined,
      });
      if (result.success) {
        if (preferredTheme) {
          setTheme(preferredTheme);
        }
        toast.success(t("updateSuccess"));
        router.refresh();
      } else {
        toast.error(t(result.error ?? "updateError"));
      }
    } catch {
      toast.error(tCommon("error"));
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">{t("name")}</Label>
        <Input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder={t("namePlaceholder")}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="className">{t("className")}</Label>
        <Input
          id="className"
          value={className}
          onChange={(e) => setClassName(e.target.value)}
          placeholder={t("classNamePlaceholder")}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="preferredLanguage">{t("preferredLanguage")}</Label>
        <Select value={preferredLanguage} onValueChange={(v) => setPreferredLanguage(v ?? "")}>
          <SelectTrigger id="preferredLanguage">
            <SelectValue placeholder={t("preferredLanguagePlaceholder")}>
              {(value: string) => languageLabelMap[value] ?? value}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {languages.map((lang) => (
              <SelectItem key={lang.value} value={lang.value} label={lang.label}>
                {lang.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="preferredTheme">{t("preferredTheme")}</Label>
        <Select value={preferredTheme} onValueChange={(v) => setPreferredTheme(v ?? "")}>
          <SelectTrigger id="preferredTheme">
            <SelectValue placeholder={t("preferredThemePlaceholder")}>
              {(value: string) => {
                const labels: Record<string, string> = { light: t("themeLight"), dark: t("themeDark"), system: t("themeSystem") };
                return labels[value] ?? value;
              }}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="light">{t("themeLight")}</SelectItem>
            <SelectItem value="dark">{t("themeDark")}</SelectItem>
            <SelectItem value="system">{t("themeSystem")}</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <Button type="submit" disabled={isLoading}>
        {isLoading ? tCommon("loading") : tCommon("save")}
      </Button>
    </form>
  );
}
