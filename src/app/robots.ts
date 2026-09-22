// ============================================================
// robots.txt généré — https://sisbmcore.sisbm-ci.com/robots.txt
// ============================================================

import type { MetadataRoute } from "next";
import { siteConfig } from "@/data/site";

// Export statique : généré une seule fois au build
export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: `${siteConfig.websiteUrl}/sitemap.xml`,
  };
}