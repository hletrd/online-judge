import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { SkipToContent } from "@/components/layout/skip-to-content";
import { NO_INDEX_METADATA } from "@/lib/seo";

export const metadata: Metadata = NO_INDEX_METADATA;

export default async function AuthLayout({ children }: { children: React.ReactNode }) {
  const t = await getTranslations("common");

  return (
    <div className="relative flex min-h-dvh items-center justify-center bg-muted/50 px-4 py-8">
      <SkipToContent targetId="main-content" label={t("skipToContent")} />
      <div className="absolute top-4 end-4">
        <ThemeToggle className="bg-background/80 shadow-sm ring-1 ring-border/70 backdrop-blur" />
      </div>
      <main id="main-content">{children}</main>
    </div>
  );
}
