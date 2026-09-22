// ============================================================
// Build d'export statique pour l'hebergement mutualise LWS.
// Force NEXT_STATIC_EXPORT=1 (lu par next.config.ts) puis lance
// `next build` avec le binaire local du projet.
//
// Usage : npm run build:static
// Sortie : dossier `out/` a transferer tel quel via FTP.
// ============================================================

import { spawnSync } from "node:child_process";
import { existsSync } from "node:fs";
import { join } from "node:path";

// On lance le CLI Next via `node <chemin du CLI>` plutôt que via `next.cmd` :
// évite tout problème de chemin contenant des espaces (shell Windows).
const nextCli = join(process.cwd(), "node_modules", "next", "dist", "bin", "next");

if (!existsSync(nextCli)) {
  console.error(
    `[build-static] CLI Next introuvable : ${nextCli}\n` +
      "[build-static] Lancez `npm install` puis réessayez."
  );
  process.exit(1);
}

console.log("[build-static] Export statique activé (NEXT_STATIC_EXPORT=1)…");

const result = spawnSync(process.execPath, [nextCli, "build"], {
  stdio: "inherit",
  env: { ...process.env, NEXT_STATIC_EXPORT: "1" },
  cwd: process.cwd(),
});

if (result.error) {
  console.error("[build-static] Échec du lancement :", result.error.message);
  process.exit(1);
}

if (result.status !== 0) {
  console.error(`[build-static] Build échoué (code ${result.status}).`);
  process.exit(result.status ?? 1);
}

console.log("[build-static] Build terminé — dossier `out/` prêt pour le transfert FTP.");
