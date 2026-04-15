"use client";

import Script from "next/script";
import Link from "next/link";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { useTranslations } from "next-intl";
import { registerPublicUser } from "@/lib/actions/public-signup";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

function getSafeRedirectUrl(callbackUrl: string | null): string {
  if (!callbackUrl) return "/dashboard";
  if (callbackUrl.startsWith("/") && !callbackUrl.startsWith("//")) {
    return callbackUrl;
  }
  return "/dashboard";
}

export function SignupForm({
  hcaptchaEnabled,
  hcaptchaSiteKey,
}: {
  hcaptchaEnabled: boolean;
  hcaptchaSiteKey: string | null;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const t = useTranslations("auth");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(event.currentTarget);
    const username = String(formData.get("username") ?? "");
    const name = String(formData.get("name") ?? "");
    const email = String(formData.get("email") ?? "").trim();
    const password = String(formData.get("password") ?? "");
    const confirmPassword = String(formData.get("confirmPassword") ?? "");
    const captchaToken = String(formData.get("h-captcha-response") ?? "").trim();
    const redirectTo = getSafeRedirectUrl(searchParams.get("callbackUrl"));

    if (password !== confirmPassword) {
      setError(t("passwordsDoNotMatch"));
      setLoading(false);
      return;
    }

    if (hcaptchaEnabled && !captchaToken) {
      setError(t("hcaptchaRequired"));
      setLoading(false);
      return;
    }

    const result = await registerPublicUser({
      username,
      name,
      email: email || undefined,
      password,
      confirmPassword,
      captchaToken: captchaToken || undefined,
    });

    if (!result.success) {
      const hcaptcha = (window as typeof window & { hcaptcha?: { reset?: () => void } }).hcaptcha;
      hcaptcha?.reset?.();
      setError(t(result.error ?? "createUserFailed"));
      setLoading(false);
      return;
    }

    try {
      const signInResult = await signIn("credentials", {
        username,
        password,
        redirect: false,
        redirectTo,
      });

      if (signInResult?.error || !signInResult?.ok) {
        router.push("/login");
        router.refresh();
        return;
      }

      if (signInResult.url) {
        const nextUrl = new URL(signInResult.url, window.location.origin);
        router.push(`${nextUrl.pathname}${nextUrl.search}${nextUrl.hash}`);
      } else {
        router.push(redirectTo);
      }
      router.refresh();
    } catch {
      router.push("/login");
      router.refresh();
    }
  }

  return (
    <>
      {hcaptchaEnabled && hcaptchaSiteKey ? (
        <Script src="https://js.hcaptcha.com/1/api.js" strategy="afterInteractive" />
      ) : null}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="username">{t("username")}</Label>
          <Input
            id="username"
            name="username"
            type="text"
            placeholder={t("usernamePlaceholder")}
            autoComplete="username"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="name">{t("name")}</Label>
          <Input
            id="name"
            name="name"
            type="text"
            placeholder={t("namePlaceholder")}
            autoComplete="name"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">{t("email")}</Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder={t("emailPlaceholder")}
            autoComplete="email"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">{t("password")}</Label>
          <Input
            id="password"
            name="password"
            type="password"
            autoComplete="new-password"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="confirmPassword">{t("confirmPassword")}</Label>
          <Input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            autoComplete="new-password"
            required
          />
        </div>
        {hcaptchaEnabled && hcaptchaSiteKey ? (
          <div className="space-y-2">
            <p className="text-sm font-medium">{t("hcaptchaPrompt")}</p>
            <div className="h-captcha" data-sitekey={hcaptchaSiteKey} />
          </div>
        ) : null}
        <p className="text-xs text-muted-foreground">{t("signUpNotice")}</p>
        {error ? (
          <p className="text-sm text-destructive" role="alert" aria-live="polite">
            {error}
          </p>
        ) : null}
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? t("signingUp") : t("createAccount")}
        </Button>
        <p className="text-center text-sm text-muted-foreground">
          {t("alreadyHaveAccount")}{" "}
          <Link href="/login" className="font-medium text-primary hover:underline">
            {t("signIn")}
          </Link>
        </p>
      </form>
    </>
  );
}
