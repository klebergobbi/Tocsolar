import { Controller, Get, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { Roles } from "../auth/roles.decorator";
import { RolesGuard } from "../auth/roles.guard";
import { CashflowService } from "./cashflow.service";

@Controller("cashflow")
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles("admin")
export class CashflowController {
  constructor(private readonly cashflow: CashflowService) {}

  @Get()
  summary() {
    return this.cashflow.summary();
  }
}
