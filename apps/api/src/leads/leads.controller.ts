import { Body, Controller, HttpCode, Logger, Post } from "@nestjs/common";
import { CreateLeadDto } from "./dto/create-lead.dto";
import { LeadsService } from "./leads.service";

type CreateLeadResponse = { ok: true; id?: string };

@Controller("leads")
export class LeadsController {
  private readonly logger = new Logger(LeadsController.name);

  constructor(private readonly leadsService: LeadsService) {}

  @Post()
  @HttpCode(201)
  async create(@Body() dto: CreateLeadDto): Promise<CreateLeadResponse> {
    // Honeypot preenchido → bot. Responde 201 sem persistir (não sinaliza rejeição).
    if (dto.website && dto.website.trim().length > 0) {
      this.logger.warn("Lead descartado pelo honeypot");
      return { ok: true };
    }

    const lead = await this.leadsService.create(dto);
    return { ok: true, id: lead.id };
  }
}
