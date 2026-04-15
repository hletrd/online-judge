export const LOCALE_COOKIE_NAME = "locale";
export const LOCALE_QUERY_PARAM = "locale";
export const SUPPORTED_LOCALES = ["en", "ko"] as const;
export const DEFAULT_LOCALE = "en";
export type SupportedLocale = (typeof SUPPORTED_LOCALES)[number];
