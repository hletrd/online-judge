"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { apiFetch } from "@/lib/api/client";
import { toast } from "sonner";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  targets: { id: string; name: string }[];
  onComplete: () => void;
};

export function FileDeleteDialog({ open, onOpenChange, targets, onComplete }: Props) {
  const t = useTranslations("admin.files");
  const [isDeleting, setIsDeleting] = useState(false);

  async function handleDelete() {
    setIsDeleting(true);
    try {
      if (targets.length === 1) {
        const res = await apiFetch(`/api/v1/files/${targets[0].id}`, {
          method: "DELETE",
        });
        if (!res.ok) throw new Error("deleteFailed");
        toast.success(t("deleteSuccess"));
      } else {
        const res = await apiFetch("/api/v1/files/bulk-delete", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ids: targets.map((t) => t.id) }),
        });
        if (!res.ok) throw new Error("deleteFailed");
        toast.success(t("bulkDeleteSuccess", { count: targets.length }));
      }
      onComplete();
    } catch {
      toast.error(t("deleteError"));
    } finally {
      setIsDeleting(false);
    }
  }

  const isBulk = targets.length > 1;

  return (
    <Dialog open={open} onOpenChange={(v) => !isDeleting && onOpenChange(v)}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {isBulk
              ? t("bulkDeleteConfirmTitle", { count: targets.length })
              : t("deleteConfirmTitle")}
          </DialogTitle>
          <DialogDescription>
            {isBulk
              ? t("bulkDeleteConfirmDescription")
              : t("deleteConfirmDescription", { name: targets[0]?.name ?? "" })}
          </DialogDescription>
        </DialogHeader>

        {isBulk && targets.length <= 10 && (
          <div className="max-h-[150px] overflow-y-auto rounded-md border p-2">
            <ul className="space-y-1 text-sm">
              {targets.map((target) => (
                <li key={target.id} className="truncate text-muted-foreground">
                  {target.name}
                </li>
              ))}
            </ul>
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isDeleting}>
            {t("cancel")}
          </Button>
          <Button variant="destructive" onClick={handleDelete} disabled={isDeleting}>
            {isDeleting ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              t("confirmDelete")
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
