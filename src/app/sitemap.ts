// ============================================================
// sitemap.xml généré — https://sisbmcore.sisbm-ci.com/sitemap.xml
// ============================================================

import type { MetadataRoute } from "next";
import { offers, siteConfig } from "@/data/site";

// Export statique : généré une seule fois au build
export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteConfig.websiteUrl;
  const lastModified = new Date();

  // trailingSlash: true (export statique) -> URLs canoniques avec slash final
  return [
    {
      url: `${base}/`,
      lastModified,
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: `${base}/offres/`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    ...offers.map((offer) => ({
      url: `${base}/offres/${offer.slug}/`,
      lastModified,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    {
      url: `${base}/a-propos/`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${base}/faq/`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${base}/contact/`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${base}/mentions-legales/`,
      lastModified,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${base}/politique-de-confidentialite/`,
      lastModified,
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];
}