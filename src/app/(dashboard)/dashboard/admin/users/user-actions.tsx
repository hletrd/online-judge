"use client";

import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { toggleUserActive } from "@/lib/actions/user-management";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

export default function UserActions({ userId, isActive, isSelf, userRole }: { userId: string; isActive: boolean; isSelf: boolean; userRole: string }) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const t = useTranslations("admin.users");
  function handleToggle() {
    startTransition(async () => {
      const result = await toggleUserActive(userId, !isActive);
      if (result.success) {
        toast.success(t(isActive ? "deactivatedSuccess" : "activatedSuccess"));
        router.refresh();
      } else {
        toast.error(t(result.error));
      }
    });
  }

  if (isSelf || userRole === "super_admin") return null;

  return (
    <Button 
      variant={isActive ? "destructive" : "default"} 
      size="sm" 
      onClick={handleToggle}
      disabled={isPending}
    >
      {isActive ? t("deactivate") : t("activate")}
    </Button>
  );
}
