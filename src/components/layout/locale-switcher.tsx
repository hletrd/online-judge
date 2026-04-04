"use client";

import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Languages } from "lucide-react";
import { LOCALE_COOKIE_NAME } from "@/lib/i18n/constants";

export function LocaleSwitcher() {
  const t = useTranslations("common");
  const router = useRouter();
  const currentLocale = useLocale();

  function setLocale(locale: string) {
    document.cookie = `${LOCALE_COOKIE_NAME}=${locale}; Path=/; SameSite=Lax; ${location.protocol === "https:" ? "Secure; " : ""}Max-Age=${60 * 60 * 24 * 365}`;
    router.refresh();
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button variant="ghost" size="icon" aria-label={t("language")}>
            <Languages className="size-4" aria-hidden="true" />
            <span className="sr-only">{t("language")}</span>
          </Button>
        }
      />
      <DropdownMenuContent align="end">
        <DropdownMenuRadioGroup
          value={currentLocale}
          onValueChange={(value) => setLocale(value)}
        >
          <DropdownMenuRadioItem value="en">
            {t("english")}
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="ko">
            {t("korean")}
          </DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
