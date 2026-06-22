import { Controller, Get, Header, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { Roles } from "../auth/roles.decorator";
import { RolesGuard } from "../auth/roles.guard";
import { ExportsService } from "./exports.service";

// CSV (text/csv). Financeiro restrito a admin; clientes liberado aos dois perfis.
// O frontend baixa via fetch autenticado + blob (o header bearer não vai em <a href>).
@Controller("exports")
@UseGuards(JwtAuthGuard, RolesGuard)
export class ExportsController {
  constructor(private readonly exports: ExportsService) {}

  @Get("clientes.csv")
  @Header("Content-Type", "text/csv; charset=utf-8")
  @Header("Content-Disposition", "attachment; filename=clientes.csv")
  clientes() {
    return this.exports.clientes();
  }

  @Get("recebiveis.csv")
  @Roles("admin")
  @Header("Content-Type", "text/csv; charset=utf-8")
  @Header("Content-Disposition", "attachment; filename=recebiveis.csv")
  recebiveis() {
    return this.exports.recebiveis();
  }

  @Get("despesas.csv")
  @Roles("admin")
  @Header("Content-Type", "text/csv; charset=utf-8")
  @Header("Content-Disposition", "attachment; filename=despesas.csv")
  despesas() {
    return this.exports.despesas();
  }

  @Get("fluxo.csv")
  @Roles("admin")
  @Header("Content-Type", "text/csv; charset=utf-8")
  @Header("Content-Disposition", "attachment; filename=fluxo-caixa.csv")
  fluxo() {
    return this.exports.fluxo();
  }
}
