// Gerador de imagens ILUSTRATIVAS dos projetos (SVG vetorial, leve p/ LCP).
// Saída: apps/web/public/projetos/<id>.svg
// <<SUBSTITUIR antes de produção>> por fotos reais dos projetos (autorização LGPD).
import { writeFileSync, mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const OUT = join(dirname(fileURLToPath(import.meta.url)), "..", "public", "projetos");
mkdirSync(OUT, { recursive: true });

const PALETAS = {
  warm: { skyTop: "#FFEDD5", skyBot: "#FDBA74", sun: "#F59E0B", ground: "#FB923C" },
  blue: { skyTop: "#E0F2FE", skyBot: "#7DD3FC", sun: "#FBBF24", ground: "#38BDF8" },
  green: { skyTop: "#DCFCE7", skyBot: "#86EFAC", sun: "#F59E0B", ground: "#4ADE80" },
  dusk: { skyTop: "#FDBA74", skyBot: "#9A3412", sun: "#FCD34D", ground: "#7C2D12" },
};

// Grade de painéis solares: parallelogramo inclinado (sugere o telhado).
function paineis(x, y, cols, rows, cw, ch, skew) {
  const cells = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const px = x + c * (cw + 3);
      const py = y + r * (ch + 3);
      cells.push(
        `<rect x="${px}" y="${py}" width="${cw}" height="${ch}" rx="1.5" fill="#1E3A5F" stroke="#0F172A" stroke-width="0.8"/>`
      );
    }
  }
  return `<g transform="skewX(${skew})">${cells.join("")}</g>`;
}

function sol(cx, cy, r, color) {
  const raios = Array.from({ length: 8 }, (_, i) => {
    const a = (i * Math.PI) / 4;
    const x1 = cx + Math.cos(a) * (r + 4);
    const y1 = cy + Math.sin(a) * (r + 4);
    const x2 = cx + Math.cos(a) * (r + 12);
    const y2 = cy + Math.sin(a) * (r + 12);
    return `<line x1="${x1.toFixed(1)}" y1="${y1.toFixed(1)}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}" stroke="${color}" stroke-width="2.5" stroke-linecap="round"/>`;
  }).join("");
  return `${raios}<circle cx="${cx}" cy="${cy}" r="${r}" fill="${color}"/>`;
}

// Silhuetas de edificação por tipo.
function casa() {
  return `
    <polygon points="80,150 200,95 320,150" fill="#7F1D1D"/>
    <rect x="100" y="150" width="200" height="90" fill="#F8FAFC"/>
    <rect x="180" y="190" width="40" height="50" fill="#7F1D1D"/>
    <rect x="125" y="170" width="30" height="28" fill="#BAE6FD"/>
    <rect x="245" y="170" width="30" height="28" fill="#BAE6FD"/>
    ${paineis(115, 108, 5, 2, 22, 14, -18)}`;
}
function casa2() {
  return `
    <polygon points="70,160 160,110 250,160" fill="#7F1D1D"/>
    <rect x="95" y="160" width="160" height="80" fill="#F8FAFC"/>
    <rect x="255" y="120" width="90" height="120" fill="#E2E8F0"/>
    <rect x="160" y="200" width="34" height="40" fill="#7F1D1D"/>
    ${paineis(100, 120, 4, 2, 20, 13, -16)}
    ${paineis(270, 135, 3, 3, 18, 13, 0)}`;
}
function comercial() {
  return `
    <rect x="80" y="110" width="240" height="130" fill="#E2E8F0"/>
    <rect x="80" y="110" width="240" height="14" fill="#94A3B8"/>
    <rect x="100" y="140" width="40" height="40" fill="#BAE6FD"/>
    <rect x="160" y="140" width="40" height="40" fill="#BAE6FD"/>
    <rect x="220" y="140" width="40" height="40" fill="#BAE6FD"/>
    <rect x="280" y="140" width="20" height="100" fill="#CBD5E1"/>
    ${paineis(95, 96, 7, 1, 28, 14, 0)}`;
}
function industrial() {
  return `
    <rect x="50" y="130" width="300" height="110" fill="#CBD5E1"/>
    <polygon points="50,130 110,108 170,130" fill="#94A3B8"/>
    <polygon points="170,130 230,108 290,130" fill="#94A3B8"/>
    <polygon points="290,130 350,108 350,130" fill="#94A3B8"/>
    ${paineis(60, 116, 4, 1, 24, 12, -22)}
    ${paineis(180, 116, 4, 1, 24, 12, -22)}`;
}
function celeiro() {
  return `
    <polygon points="90,160 110,120 290,120 310,160" fill="#92400E"/>
    <polygon points="110,120 140,100 260,100 290,120" fill="#B45309"/>
    <rect x="110" y="160" width="180" height="80" fill="#FEF3C7"/>
    <rect x="175" y="195" width="50" height="45" fill="#92400E"/>
    ${paineis(120, 128, 5, 2, 26, 12, -12)}`;
}

const TIPOS = { casa, casa2, comercial, industrial, celeiro };

function svg({ tipo, paleta }) {
  const p = PALETAS[paleta];
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300" width="400" height="300" role="img">
  <defs>
    <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="${p.skyTop}"/>
      <stop offset="1" stop-color="${p.skyBot}"/>
    </linearGradient>
  </defs>
  <rect width="400" height="300" fill="url(#sky)"/>
  ${sol(330, 60, 26, p.sun)}
  <rect y="240" width="400" height="60" fill="${p.ground}"/>
  ${TIPOS[tipo]()}
</svg>`;
}

const PROJETOS = [
  { id: "res-01", tipo: "casa", paleta: "warm" },
  { id: "com-01", tipo: "comercial", paleta: "blue" },
  { id: "res-02", tipo: "casa2", paleta: "blue" },
  { id: "rur-01", tipo: "celeiro", paleta: "green" },
  { id: "com-02", tipo: "industrial", paleta: "warm" },
  { id: "res-03", tipo: "casa2", paleta: "dusk" },
];

for (const proj of PROJETOS) {
  writeFileSync(join(OUT, `${proj.id}.svg`), svg(proj).trim() + "\n");
  console.log("gerado:", `${proj.id}.svg`);
}
