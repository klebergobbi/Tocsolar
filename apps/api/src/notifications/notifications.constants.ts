/** Fila única de notificações de lead (BullMQ). */
export const LEAD_NOTIFICATIONS_QUEUE = "lead-notifications";

/** Nomes dos jobs processados pela fila. */
export const LeadNotificationJob = {
  WhatsApp: "whatsapp",
  Email: "email",
} as const;

export type LeadNotificationJobName =
  (typeof LeadNotificationJob)[keyof typeof LeadNotificationJob];

/** Payload enfileirado após persistir o lead. */
export type LeadNotificationData = {
  id: string;
  nome: string;
  whatsapp: string;
  tipo: string;
  cidade?: string | null;
  email?: string | null;
  valorConta?: number | null;
  origem?: string | null;
  campanha?: string | null;
  mensagem?: string | null;
};
