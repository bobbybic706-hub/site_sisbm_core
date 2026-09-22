import type { NextConfig } from "next";

// ============================================================
// Export statique (hebergement mutualise LWS) active uniquement
// via NEXT_STATIC_EXPORT=1 -> voir `npm run build:static`.
// Sans cette variable, la configuration reste celle d'un serveur
// Next classique (dev local + route API /api/contact).
// ============================================================
const isStaticExport = process.env.NEXT_STATIC_EXPORT === "1";

const nextConfig: NextConfig = {
  // Ne pas exposer la techno serveur (léger gain de surface)
  poweredByHeader: false,
  ...(isStaticExport
    ? {
        // Sortie 100% statique dans `out/` (dossier par défaut de l'export)
        output: "export" as const,
        // Génère page/index.html -> compatible Apache mutualisé (pas de rewrite)
        trailingSlash: true,
        // Pas d'optimiseur d'images côté serveur en statique
        images: { unoptimized: true },
        outputFileTracingExcludes: { "/opengraph-image": ["**"] },
      }
    : {
        images: {
          // Formats modernes (WebP / AVIF) servis automatiquement selon le navigateur
          formats: ["image/avif", "image/webp"],
          // Tailles generees par l`optimiseur (évite images surdimensionnees)
          deviceSizes: [384, 426, 500, 600, 768, 1024, 1366, 1600],
          imageSizes: [16, 32, 48, 64, 96, 128, 192, 256],
          // Cache navigateur des images optimisees
          minimumCacheTTL: 60,
        },
        // Compression GZIP/Brotli (améliore le LCP)
        compress: true,
        // nodemailer doit rester externe au bundle serveur (module natif & dynamic import)
        serverExternalPackages: ["nodemailer"],
      }),
};

export default nextConfig;

