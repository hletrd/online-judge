"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { changePassword } from "@/lib/actions/change-password";

export function ChangePasswordForm() {
  const router = useRouter();
  const { update } = useSession();
  const t = useTranslations("changePassword");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const currentPassword = formData.get("currentPassword") as string;
    const newPassword = formData.get("newPassword") as string;
    const confirmPassword = formData.get("confirmPassword") as string;

    if (newPassword !== confirmPassword) {
      setError(t("passwordMismatch"));
      setLoading(false);
      return;
    }

    if (newPassword.length < 8) {
      setError(t("passwordTooShort"));
      setLoading(false);
      return;
    }

    const result = await changePassword(currentPassword, newPassword);

    if (!result.success) {
      setError(t(result.error ?? "error"));
      setLoading(false);
    } else {
      // Trigger session update to clear mustChangePassword from JWT
      await update();
      router.push("/dashboard");
      router.refresh();
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="currentPassword">{t("currentPassword")}</Label>
        <Input
          id="currentPassword"
          name="currentPassword"
          type="password"
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="newPassword">{t("newPassword")}</Label>
        <Input
          id="newPassword"
          name="newPassword"
          type="password"
          minLength={8}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="confirmPassword">{t("confirmPassword")}</Label>
        <Input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          minLength={8}
          required
        />
      </div>
      {error && (
        <p className="text-sm text-destructive">{error}</p>
      )}
      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? t("changing") : t("changeButton")}
      </Button>
    </form>
  );
}
