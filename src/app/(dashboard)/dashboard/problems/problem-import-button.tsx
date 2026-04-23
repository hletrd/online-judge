"use client";

import { useRef } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { apiFetch } from "@/lib/api/client";

export function ProblemImportButton() {
  const t = useTranslations("problems");
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);

  async function handleImport(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    event.target.value = "";

    try {
      if (file.size > 10 * 1024 * 1024) {
        toast.error(t("fileTooLarge"));
        return;
      }

      const text = await file.text();
      const data = JSON.parse(text);

      const res = await apiFetch("/api/v1/problems/import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        toast.error((err as { error?: string }).error ?? t("importFailed"));
        return;
      }

      const result = await res.json().catch(() => ({ data: {} }));
      toast.success(t("importSuccess"));
      router.push(`/dashboard/problems/${result.data.id}`);
    } catch {
      toast.error(t("importFailed"));
    }
  }

  return (
    <>
      <input
        ref={fileRef}
        type="file"
        accept=".json"
        className="sr-only"
        onChange={(e) => { void handleImport(e); }}
      />
      <Button variant="outline" onClick={() => fileRef.current?.click()}>
        <Upload className="mr-1 size-4" />
        {t("importProblem")}
      </Button>
    </>
  );
}
