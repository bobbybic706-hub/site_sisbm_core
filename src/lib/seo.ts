// ============================================================
// SEO — helper centralisé pour les métadonnées Next.js
// Garantit que chaque page fournit un OG complet (le merge Next
// étant superficiel, un openGraph partiel écraserait celui du layout).
// ============================================================

import type { Metadata } from "next";
import { siteConfig } from "@/data/site";

type SeoInput = {
  title: string;
  description: string;
  /** Chemin de la page ("/", "/offres", ...) — sert au canonical et og:url */
  path: string;
  /** true quand le titre fourni est déjà complet (ne pas appliquer le template du layout) */
  absoluteTitle?: boolean;
};

export function buildMetadata({
  title,
  description,
  path,
  absoluteTitle = false,
}: SeoInput): Metadata {
  // Export statique : trailingSlash -> URLs canoniques avec slash final
  const canonicalPath = path === "/" ? "/" : `${path.replace(/\/+$/, "")}/`;
  const url = `${siteConfig.websiteUrl}${canonicalPath}`;

  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    alternates: {
      canonical: canonicalPath,
    },
    openGraph: {
      title,
      description,
      url,
      siteName: siteConfig.name,
      locale: "fr_FR",
      type: "website",
      // Image générée au build par src/app/opengraph-image.tsx (1200x630)
      images: [
        {
          url: "/opengraph-image",
          width: 1200,
          height: 630,
          alt: `${siteConfig.name} — ${siteConfig.subtitle}`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

/** Titre complet par défaut de l'accueil (identique au layout) */
export const homeTitle = `${siteConfig.name} — ${siteConfig.subtitle}`;