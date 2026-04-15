ALTER TABLE "system_settings"
  ADD COLUMN IF NOT EXISTS "public_signup_enabled" boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS "signup_hcaptcha_enabled" boolean NOT NULL DEFAULT false;
