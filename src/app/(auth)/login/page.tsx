import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getResolvedSystemSettings } from "@/lib/system-settings";
import { LoginForm } from "./login-form";

export default async function LoginPage() {
  const t = await getTranslations("auth");
  const tCommon = await getTranslations("common");
  const settings = await getResolvedSystemSettings({
    siteTitle: tCommon("appName"),
    siteDescription: tCommon("appDescription"),
  });

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">{settings.siteTitle}</CardTitle>
        <CardDescription>{t("signInDescription")}</CardDescription>
      </CardHeader>
      <CardContent>
        <LoginForm />
        {settings.publicSignupEnabled ? (
          <p className="mt-4 text-center text-sm text-muted-foreground">
            {t("needAccount")}{" "}
            <Link href="/signup" className="font-medium text-primary hover:underline">
              {t("createAccount")}
            </Link>
          </p>
        ) : null}
      </CardContent>
    </Card>
  );
}
