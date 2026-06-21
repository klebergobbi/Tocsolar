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

export class CreateClientDto {
  @IsString()
  @MaxLength(120)
  nome!: string;

  @IsString()
  @MaxLength(20)
  whatsapp!: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  documento?: string;

  @IsOptional()
  @IsString()
  @MaxLength(120)
  cidade?: string;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  endereco?: string;

  @IsIn(TIPOS, { message: "tipo deve ser residencial, empresarial ou rural" })
  tipo!: (typeof TIPOS)[number];

  @IsOptional()
  @IsNumber()
  @Min(0)
  valorConta?: number;

  @IsOptional()
  @IsString()
  @MaxLength(2000)
  observacoes?: string;

  @IsOptional()
  @IsString()
  leadId?: string;
}
