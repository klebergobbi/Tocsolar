import {
  IsEmail,
  IsIn,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  Min,
} from "class-validator";

const TIPOS = ["residencial", "empresarial", "rural"] as const;
const STATUS = ["novo", "em_contato", "proposta", "fechado", "perdido"] as const;

// Atualização parcial — todos os campos opcionais (inclui transição de status do funil).
export class UpdateClientDto {
  @IsOptional() @IsString() @MaxLength(120) nome?: string;
  @IsOptional() @IsString() @MaxLength(20) whatsapp?: string;
  @IsOptional() @IsEmail() email?: string;
  @IsOptional() @IsString() @MaxLength(20) documento?: string;
  @IsOptional() @IsString() @MaxLength(120) cidade?: string;
  @IsOptional() @IsString() @MaxLength(200) endereco?: string;
  @IsOptional() @IsIn(TIPOS) tipo?: (typeof TIPOS)[number];
  @IsOptional() @IsIn(STATUS, { message: "status inválido" }) status?: (typeof STATUS)[number];
  @IsOptional() @IsNumber() @Min(0) valorConta?: number;
  @IsOptional() @IsString() @MaxLength(2000) observacoes?: string;
}
