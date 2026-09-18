// Copie src/ vers dist/. Point d'entree unique du build, quel que soit
// l'outillage Node ajoute plus tard (a adapter si un framework remplace
// cette simple copie, ex: Astro/Vite/Next export).
const fs = require("fs");
const path = require("path");

const SRC = path.join(__dirname, "..", "src");
const DIST = path.join(__dirname, "..", "dist");

fs.rmSync(DIST, { recursive: true, force: true });
fs.cpSync(SRC, DIST, { recursive: true });

console.log(`Build OK: ${SRC} -> ${DIST}`);
