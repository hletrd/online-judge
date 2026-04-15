import type { MetadataRoute } from "next";
import { getAuthUrlObject } from "@/lib/security/env";
import { ROBOTS_DISALLOWED_PATHS } from "@/lib/public-route-seo";

export default function robots(): MetadataRoute.Robots {
  const siteUrl = getAuthUrlObject();

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [...ROBOTS_DISALLOWED_PATHS],
    },
    host: siteUrl?.origin,
    sitemap: siteUrl ? `${siteUrl.origin}/sitemap.xml` : undefined,
  };
}
