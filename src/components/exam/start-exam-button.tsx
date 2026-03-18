"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { apiFetch } from "@/lib/api/client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface StartExamButtonProps {
  groupId: string;
  assignmentId: string;
  durationMinutes: number;
}

export function StartExamButton({ groupId, assignmentId, durationMinutes }: StartExamButtonProps) {
  const router = useRouter();
  const t = useTranslations("groups");
  const tCommon = useTranslations("common");
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  async function handleStart() {
    setIsLoading(true);
    try {
      const response = await apiFetch(
        `/api/v1/groups/${groupId}/assignments/${assignmentId}/exam-session`,
        { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({}) }
      );

      if (!response.ok) {
        const payload = await response.json();
        throw new Error(payload.error || "examSessionStartFailed");
      }

      toast.success(t("examSessionStarted"));
      setOpen(false);
      router.refresh();
    } catch (error) {
      if (error instanceof Error && error.message === "assignmentClosed") {
        toast.error(t("examTimeExpired"));
      } else if (error instanceof Error && error.message === "assignmentNotStarted") {
        toast.error(t("examNotStarted"));
      } else {
        toast.error(t("examSessionStartFailed"));
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button size="lg">{t("examStartButton")}</Button>} />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("examStartConfirmTitle")}</DialogTitle>
          <DialogDescription>
            {t("examStartConfirmDescription", { duration: durationMinutes })}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)} disabled={isLoading}>
            {tCommon("cancel")}
          </Button>
          <Button onClick={handleStart} disabled={isLoading}>
            {isLoading ? tCommon("loading") : t("examStartConfirmAction")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
