import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/schema";

// Apenas rotas existentes e indexáveis (/, LPs, simulador, contato, privacidade).
// /obrigado fica de fora (página de conversão, não indexável).
const ROTAS: { path: string; priority: number }[] = [
  { path: "/", priority: 1.0 },
  { path: "/energia-solar-residencial", priority: 0.9 },
  { path: "/energia-solar-empresarial", priority: 0.9 },
  { path: "/simulador", priority: 0.8 },
  { path: "/como-funciona", priority: 0.7 },
  { path: "/projetos", priority: 0.6 },
  { path: "/contato", priority: 0.7 },
  { path: "/sobre", priority: 0.5 },
  { path: "/privacidade", priority: 0.3 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return ROTAS.map(({ path, priority }) => ({
    url: `${SITE_URL}${path}`,
    lastModified,
    changeFrequency: "monthly",
    priority,
  }));
}
