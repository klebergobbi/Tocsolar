/**
 * Camada de analytics — empurra eventos para o dataLayer do GTM (GA4 + Google Ads).
 * Eventos de conversão do projeto: lead_form_submit, whatsapp_click, simulator_complete.
 */
type GtmEvent = Record<string, unknown> & { event: string };

declare global {
  interface Window {
    dataLayer?: GtmEvent[];
  }
}

export function pushDataLayer(payload: GtmEvent): void {
  if (typeof window === "undefined") return;
  window.dataLayer = window.dataLayer ?? [];
  window.dataLayer.push(payload);
}

export type LeadEventParams = {
  tipo?: string;
  origem?: string;
  campanha?: string;
};

export function trackLeadFormSubmit(params: LeadEventParams = {}): void {
  pushDataLayer({ event: "lead_form_submit", ...params });
}

export function trackSimulatorComplete(params: LeadEventParams = {}): void {
  pushDataLayer({ event: "simulator_complete", ...params });
}

export function trackWhatsAppClick(params: LeadEventParams = {}): void {
  pushDataLayer({ event: "whatsapp_click", ...params });
}
