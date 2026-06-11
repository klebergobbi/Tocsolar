import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import type { LeadNotificationData } from "./notifications.constants";

/**
 * Envia notificação de lead ao comercial via Evolution API (WhatsApp).
 * <<CONFIRMAR>> endpoint, instância e formato exatos do payload da sua versão
 * da Evolution (v1 usa { number, textMessage: { text } }; v2 usa { number, text }).
 */
@Injectable()
export class EvolutionService {
  private readonly logger = new Logger(EvolutionService.name);

  constructor(private readonly config: ConfigService) {}

  private buildMessage(lead: LeadNotificationData): string {
    const linhas = [
      "🟠 *Novo lead TOCSOLAR*",
      `Nome: ${lead.nome}`,
      `WhatsApp: ${lead.whatsapp}`,
      `Tipo: ${lead.tipo}`,
    ];
    if (lead.cidade) linhas.push(`Cidade: ${lead.cidade}`);
    if (lead.valorConta) linhas.push(`Conta: R$ ${lead.valorConta}/mês`);
    if (lead.origem) linhas.push(`Origem: ${lead.origem}`);
    if (lead.campanha) linhas.push(`Campanha: ${lead.campanha}`);
    if (lead.mensagem) linhas.push(`Mensagem: ${lead.mensagem}`);
    return linhas.join("\n");
  }

  async notifyLead(lead: LeadNotificationData): Promise<void> {
    const baseUrl = this.config.get<string>("EVOLUTION_API_URL");
    const apiKey = this.config.get<string>("EVOLUTION_API_KEY");
    const instance = this.config.get<string>("EVOLUTION_INSTANCE");
    const to = this.config.get<string>("LEAD_NOTIFY_WHATSAPP");

    if (!baseUrl || !apiKey || !instance || !to) {
      this.logger.warn(
        "Evolution API não configurada — pulando notificação WhatsApp",
      );
      return;
    }

    const url = `${baseUrl.replace(/\/$/, "")}/message/sendText/${instance}`;
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: apiKey,
      },
      body: JSON.stringify({ number: to, text: this.buildMessage(lead) }),
    });

    if (!res.ok) {
      const body = await res.text();
      throw new Error(`Evolution API ${res.status}: ${body}`);
    }

    this.logger.log(`Notificação WhatsApp enviada para o comercial (lead ${lead.id})`);
  }
}
