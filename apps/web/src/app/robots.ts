import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/schema";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Página de conversão não deve ser indexada.
      disallow: ["/obrigado"],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
