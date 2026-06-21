import { Injectable, Logger } from "@nestjs/common";
import { Cron } from "@nestjs/schedule";
import { PrismaService } from "../prisma/prisma.service";
import { EvolutionService } from "../notifications/evolution.service";
import { MailService } from "../notifications/mail.service";

const DIAS_ANTECEDENCIA = 3;

type ReceivableRow = {
  id: string;
  descricao: string;
  valor: number;
  vencimento: Date;
  client: { nome: string };
};

type Coletado = {
  vencidas: ReceivableRow[];
  aVencer: ReceivableRow[];
  totalVencido: number;
  totalAVencer: number;
};

@Injectable()
export class RemindersService {
  private readonly logger = new Logger(RemindersService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly evolution: EvolutionService,
    private readonly mail: MailService,
  ) {}

  private fmtBRL(n: number): string {
    return n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
  }
  private fmtDate(d: Date): string {
    return d.toLocaleDateString("pt-BR", { timeZone: "UTC" });
  }

  async collect(dias = DIAS_ANTECEDENCIA): Promise<Coletado> {
    const now = new Date();
    const limite = new Date(now);
    limite.setUTCDate(limite.getUTCDate() + dias);

    const pendentes = (await this.prisma.receivable.findMany({
      where: { status: "pendente", vencimento: { lte: limite } },
      orderBy: { vencimento: "asc" },
      include: { client: { select: { nome: true } } },
    })) as ReceivableRow[];

    const t = now.getTime();
    const vencidas = pendentes.filter((r) => r.vencimento.getTime() < t);
    const aVencer = pendentes.filter((r) => r.vencimento.getTime() >= t);
    return {
      vencidas,
      aVencer,
      totalVencido: vencidas.reduce((s, r) => s + r.valor, 0),
      totalAVencer: aVencer.reduce((s, r) => s + r.valor, 0),
    };
  }

  private buildText(d: Coletado): string {
    const linhas = ["🟠 *TOCSOLAR — Contas a receber*"];
    if (d.vencidas.length) {
      linhas.push(
        "",
        `*Vencidas (${d.vencidas.length}) — ${this.fmtBRL(d.totalVencido)}*`,
      );
      d.vencidas.forEach((r) =>
        linhas.push(
          `• ${r.client.nome} — ${r.descricao} — ${this.fmtBRL(r.valor)} (venceu ${this.fmtDate(r.vencimento)})`,
        ),
      );
    }
    if (d.aVencer.length) {
      linhas.push(
        "",
        `*A vencer em ${DIAS_ANTECEDENCIA} dias (${d.aVencer.length}) — ${this.fmtBRL(d.totalAVencer)}*`,
      );
      d.aVencer.forEach((r) =>
        linhas.push(
          `• ${r.client.nome} — ${r.descricao} — ${this.fmtBRL(r.valor)} (vence ${this.fmtDate(r.vencimento)})`,
        ),
      );
    }
    return linhas.join("\n");
  }

  private buildHtml(d: Coletado): string {
    const row = (r: ReceivableRow) =>
      `<tr><td>${r.client.nome}</td><td>${r.descricao}</td><td>${this.fmtBRL(r.valor)}</td><td>${this.fmtDate(r.vencimento)}</td></tr>`;
    const tabela = (titulo: string, itens: ReceivableRow[], total: number) =>
      itens.length
        ? `<h3>${titulo} (${itens.length}) — ${this.fmtBRL(total)}</h3>
           <table cellpadding="6" border="1" style="border-collapse:collapse">
             <tr><th>Cliente</th><th>Parcela</th><th>Valor</th><th>Vencimento</th></tr>
             ${itens.map(row).join("")}
           </table>`
        : "";
    return `<h2>TOCSOLAR — Contas a receber</h2>
      ${tabela("Vencidas", d.vencidas, d.totalVencido)}
      ${tabela(`A vencer em ${DIAS_ANTECEDENCIA} dias`, d.aVencer, d.totalAVencer)}`;
  }

  async run() {
    const d = await this.collect();
    if (!d.vencidas.length && !d.aVencer.length) {
      return {
        enviado: false,
        motivo: "Nenhuma parcela vencida ou a vencer",
        vencidas: 0,
        aVencer: 0,
      };
    }
    const whatsapp = await this.evolution.sendText(
      this.buildText(d),
      "(lembrete de vencimentos)",
    );
    const email = await this.mail.sendInternal(
      "TOCSOLAR — contas a receber (vencimentos)",
      this.buildHtml(d),
    );
    return {
      enviado: whatsapp || email,
      whatsapp,
      email,
      vencidas: d.vencidas.length,
      aVencer: d.aVencer.length,
      totalVencido: d.totalVencido,
      totalAVencer: d.totalAVencer,
    };
  }

  async preview() {
    const d = await this.collect();
    const toItem = (r: ReceivableRow) => ({
      id: r.id,
      cliente: r.client.nome,
      descricao: r.descricao,
      valor: r.valor,
      vencimento: r.vencimento,
    });
    return {
      vencidas: d.vencidas.map(toItem),
      aVencer: d.aVencer.map(toItem),
      totalVencido: d.totalVencido,
      totalAVencer: d.totalAVencer,
    };
  }

  // 11:00 UTC ≈ 08:00 em Brasília (o droplet roda em UTC).
  @Cron("0 11 * * *")
  async daily(): Promise<void> {
    this.logger.log("Lembrete diário de vencimentos");
    await this.run();
  }
}
