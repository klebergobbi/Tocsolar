/**
 * Helper de WhatsApp — monta links wa.me com mensagem pré-preenchida e UTM,
 * para o comercial saber a origem do lead. Número oficial da TOCSOLAR.
 */
export const WHATSAPP_NUMBER = "5585991618044";

export type UtmParams = {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
};

const DEFAULT_MESSAGE =
  "Olá! Quero um orçamento de energia solar pela TOCSOLAR.";

export function buildWhatsAppUrl({
  message = DEFAULT_MESSAGE,
  utm,
}: { message?: string; utm?: UtmParams } = {}): string {
  const lines = [message];
  if (utm?.utm_source) lines.push(`Origem: ${utm.utm_source}`);
  if (utm?.utm_campaign) lines.push(`Campanha: ${utm.utm_campaign}`);

  const text = encodeURIComponent(lines.join("\n"));
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${text}`;
}

/** Lê UTM da URL atual (somente no client). Vazio no SSR. */
export function readUtmFromLocation(): UtmParams {
  if (typeof window === "undefined") return {};
  const p = new URLSearchParams(window.location.search);
  return {
    utm_source: p.get("utm_source") ?? undefined,
    utm_medium: p.get("utm_medium") ?? undefined,
    utm_campaign: p.get("utm_campaign") ?? undefined,
  };
}
