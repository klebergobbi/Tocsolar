import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from "@nestjs/common";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { CreateReceivableDto } from "./dto/create-receivable.dto";
import { GenerateReceivablesDto } from "./dto/generate-receivables.dto";
import { UpdateReceivableDto } from "./dto/update-receivable.dto";
import { ReceivablesService } from "./receivables.service";

@Controller("receivables")
@UseGuards(JwtAuthGuard)
export class ReceivablesController {
  constructor(private readonly receivables: ReceivablesService) {}

  @Get()
  list(@Query("status") status?: string, @Query("clientId") clientId?: string) {
    return this.receivables.list({ status, clientId });
  }

  @Get(":id")
  get(@Param("id") id: string) {
    return this.receivables.get(id);
  }

  @Post()
  create(@Body() dto: CreateReceivableDto) {
    return this.receivables.create(dto);
  }

  @Post("generate-from-quote/:quoteId")
  generate(
    @Param("quoteId") quoteId: string,
    @Body() dto: GenerateReceivablesDto,
  ) {
    return this.receivables.generateFromQuote(quoteId, dto);
  }

  @Patch(":id")
  update(@Param("id") id: string, @Body() dto: UpdateReceivableDto) {
    return this.receivables.update(id, dto);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.receivables.remove(id);
  }
}
