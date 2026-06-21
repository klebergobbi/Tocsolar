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
import { ClientsService } from "./clients.service";
import { CreateClientDto } from "./dto/create-client.dto";
import { UpdateClientDto } from "./dto/update-client.dto";

@Controller("clients")
@UseGuards(JwtAuthGuard)
export class ClientsController {
  constructor(private readonly clients: ClientsService) {}

  @Get()
  list(@Query("status") status?: string, @Query("search") search?: string) {
    return this.clients.list({ status, search });
  }

  @Get(":id")
  get(@Param("id") id: string) {
    return this.clients.get(id);
  }

  @Post()
  create(@Body() dto: CreateClientDto) {
    return this.clients.create(dto);
  }

  @Post("from-lead/:leadId")
  fromLead(@Param("leadId") leadId: string) {
    return this.clients.fromLead(leadId);
  }

  @Patch(":id")
  update(@Param("id") id: string, @Body() dto: UpdateClientDto) {
    return this.clients.update(id, dto);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.clients.remove(id);
  }
}
