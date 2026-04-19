import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { getTranslations } from "next-intl/server";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { PublicHeader } from "@/components/layout/public-header";
import { SkipToContent } from "@/components/layout/skip-to-content";
import { LectureModeProvider } from "@/components/lecture/lecture-mode-provider";
import { LectureModeToggle } from "@/components/layout/lecture-mode-toggle";
import { LectureToolbar } from "@/components/lecture/lecture-toolbar";
import { Breadcrumb } from "@/components/layout/breadcrumb";
import { updatePreferences } from "@/lib/actions/update-preferences";

import { Toaster } from "@/components/ui/sonner";

import { getResolvedSystemSettings, isAiAssistantEnabled } from "@/lib/system-settings";
import { ChatWidgetLoader } from "@/components/plugins/chat-widget-loader";
import { resolveCapabilities } from "@/lib/capabilities/cache";
import { isPluginEnabled } from "@/lib/plugins/data";
import { EditorContentProvider } from "@/contexts/editor-content-context";
import { getRecruitingAccessContext } from "@/lib/recruiting/access";
import { isInstructorOrAboveAsync } from "@/lib/auth/role-helpers";
import { getActiveTimedAssignmentsForSidebar } from "@/lib/assignments/active-timed-assignments";
import { NO_INDEX_METADATA } from "@/lib/seo";
import { buildLocalizedHref } from "@/lib/locale-paths";

export const metadata: Metadata = NO_INDEX_METADATA;

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const [{ effectivePlatformMode }, t, capabilities] = await Promise.all([
    getRecruitingAccessContext(session.user.id),
    getTranslations("common"),
    (async () => {
      const [caps, chatPluginOn, aiOn] = await Promise.all([
        resolveCapabilities(session.user.role),
        isPluginEnabled("chat-widget"),
        isAiAssistantEnabled(),
      ]);
      const arr = [...caps];
      return (!chatPluginOn || !aiOn) ? arr.filter(c => c !== "system.chat_logs") : arr;
    })(),
  ]);
  const capsSet = new Set(capabilities);
  const canBypassTimedAssignmentPanel =
    capsSet.has("groups.view_all")
    || capsSet.has("submissions.view_all")
    || capsSet.has("assignments.view_status");

  const [settings, canUseLectureMode, activeTimedAssignments] = await Promise.all([
    getResolvedSystemSettings({
      siteTitle: t("appName"),
      siteDescription: t("appDescription"),
    }),
    isInstructorOrAboveAsync(session.user.role),
    canBypassTimedAssignmentPanel
      ? Promise.resolve([])
      : getActiveTimedAssignmentsForSidebar(session.user.id, session.user.role),
  ]);

  return (
    <EditorContentProvider>
    <LectureModeProvider
      initialActive={canUseLectureMode && session.user.lectureMode === "on"}
      initialFontScale={session.user.lectureFontScale ?? "1.5"}
      initialColorScheme={session.user.lectureColorScheme ?? "dark"}
      persistAction={updatePreferences}
    >
      <PublicHeader
        siteTitle={settings.siteTitle}
        items={[
          { href: "/practice", label: t("practice") },
          { href: "/playground", label: t("playground") },
          { href: "/contests", label: t("contests") },
          { href: "/rankings", label: t("rankings") },
          { href: "/community", label: t("community") },
          { href: "/languages", label: t("languages") },
        ]}
        actions={[
          { href: "/login", label: t("signIn") },
          { href: "/signup", label: t("signUp") },
        ]}
        loggedInUser={{
          name: session.user.name || session.user.username || "",
          href: "/dashboard/profile",
          label: session.user.name || session.user.username || "",
          role: session.user.role,
          capabilities,
        }}
      />
      <SidebarProvider>
        <SkipToContent targetId="main-content" label={t("skipToContent")} />
        <AppSidebar
          user={session.user}
          siteTitle={settings.siteTitle}
          siteIconUrl={settings.siteIconUrl}
          platformMode={effectivePlatformMode}
          capabilities={capabilities}
          activeTimedAssignments={activeTimedAssignments}
        />
        <SidebarInset>
          <header className="flex h-10 items-center gap-2 border-b px-4">
            <SidebarTrigger />
            <div className="ml-auto flex shrink-0 items-center gap-1">
              {canUseLectureMode && <LectureModeToggle />}
            </div>
          </header>
          <main id="main-content" className="min-w-0 flex-1 p-6">
            <Breadcrumb className="mb-4" />
            {children}
          </main>
        </SidebarInset>
        <Toaster />
        <ChatWidgetLoader userId={session.user.id} />
        <LectureToolbar />
      </SidebarProvider>
    </LectureModeProvider>
    </EditorContentProvider>
  );
}
