import { fileURLToPath } from "url";
import path from "path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** @type {import("next").NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    // As imagens dos projetos são SVGs first-party (apps/web/public/projetos).
    // Permitir SVG no next/image com CSP restritiva (sem scripts, sandbox).
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  // Build standalone para Docker (server.js + node_modules mínimo).
  output: "standalone",
  // Em monorepo, rastreia deps a partir da raiz para o standalone funcionar.
  experimental: {
    outputFileTracingRoot: path.join(__dirname, "../../"),
  },
};

export default nextConfig;
