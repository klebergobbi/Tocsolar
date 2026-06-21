import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { createTransport, type Transporter } from "nodemailer";
import type { LeadNotificationData } from "./notifications.constants";

/**
 * Envia e-mail interno ao comercial quando um lead é criado.
 * Usa SMTP via URL (nodemailer) — compatível com Resend SMTP, etc. <<CONFIRMAR provedor>>.
 */
@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  private transporter: Transporter | null = null;

  constructor(private readonly config: ConfigService) {}

  private getTransporter(): Transporter | null {
    const smtpUrl = this.config.get<string>("SMTP_URL");
    if (!smtpUrl) return null;
    if (!this.transporter) {
      this.transporter = createTransport(smtpUrl);
    }
    return this.transporter;
  }

  private buildHtml(lead: LeadNotificationData): string {
    const row = (label: string, value?: string | number | null) =>
      value ? `<tr><td><strong>${label}</strong></td><td>${value}</td></tr>` : "";
    return `
      <h2>Novo lead TOCSOLAR</h2>
      <table cellpadding="6">
        ${row("Nome", lead.nome)}
        ${row("WhatsApp", lead.whatsapp)}
        ${row("E-mail", lead.email)}
        ${row("Tipo", lead.tipo)}
        ${row("Cidade", lead.cidade)}
        ${row("Conta (R$/mês)", lead.valorConta)}
        ${row("Origem", lead.origem)}
        ${row("Campanha", lead.campanha)}
        ${row("Mensagem", lead.mensagem)}
      </table>
      <p>Lead ID: ${lead.id}</p>
    `;
  }

  async notifyLead(lead: LeadNotificationData): Promise<void> {
    const transporter = this.getTransporter();
    const to = this.config.get<string>("LEAD_NOTIFY_EMAIL");
    const from = this.config.get<string>("SMTP_FROM");

    if (!transporter || !to || !from) {
      this.logger.warn("SMTP não configurado — pulando e-mail de notificação");
      return;
    }

    await transporter.sendMail({
      from,
      to,
      subject: `Novo lead: ${lead.nome} (${lead.tipo})`,
      html: this.buildHtml(lead),
    });

    this.logger.log(`E-mail de notificação enviado (lead ${lead.id})`);
  }

  // Envio genérico de e-mail interno ao escritório (LEAD_NOTIFY_EMAIL).
  // Retorna true se enviou; false se não configurado (degrada com warn).
  async sendInternal(subject: string, html: string): Promise<boolean> {
    const transporter = this.getTransporter();
    const to = this.config.get<string>("LEAD_NOTIFY_EMAIL");
    const from = this.config.get<string>("SMTP_FROM");

    if (!transporter || !to || !from) {
      this.logger.warn("SMTP não configurado — pulando e-mail interno");
      return false;
    }

    await transporter.sendMail({ from, to, subject, html });
    this.logger.log(`E-mail interno enviado: ${subject}`);
    return true;
  }
}
