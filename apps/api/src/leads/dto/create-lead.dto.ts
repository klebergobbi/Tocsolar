import { Transform } from "class-transformer";
import {
  IsEmail,
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  Min,
} from "class-validator";

/**
 * Normaliza um WhatsApp BR para o formato "55" + DDD + número (somente dígitos).
 * Aceita máscaras como "(85) 99161-8044" e números com/sem código do país.
 */
export function normalizeBrWhatsApp(value: unknown): unknown {
  if (typeof value !== "string") return value;
  let digits = value.replace(/\D/g, "");
  // Remove o código do país só quando o tamanho indica que ele está presente
  // (12 = DDD+8, 13 = DDD+9), evitando confundir com o DDD 55.
  if ((digits.length === 12 || digits.length === 13) && digits.startsWith("55")) {
    digits = digits.slice(2);
  }
  return `55${digits}`;
}

const trim = ({ value }: { value: unknown }) =>
  typeof value === "string" ? value.trim() : value;

export class CreateLeadDto {
  @Transform(trim)
  @IsString()
  @IsNotEmpty({ message: "nome é obrigatório" })
  @MaxLength(120)
  nome!: string;

  @Transform(({ value }) => normalizeBrWhatsApp(value))
  @IsString()
  @Matches(/^55\d{10,11}$/, {
    message: "whatsapp inválido — informe DDD + número",
  })
  whatsapp!: string;

  @IsOptional()
  @Transform(trim)
  @IsEmail({}, { message: "email inválido" })
  @MaxLength(160)
  email?: string;

  @IsOptional()
  @Transform(trim)
  @IsString()
  @MaxLength(120)
  cidade?: string;

  @IsIn(["residencial", "empresarial", "rural"], {
    message: "tipo deve ser residencial, empresarial ou rural",
  })
  tipo!: "residencial" | "empresarial" | "rural";

  @IsOptional()
  @IsNumber()
  @Min(0)
  valorConta?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  economiaEstimada?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  systemKwp?: number;

  @IsOptional()
  @Transform(trim)
  @IsString()
  @MaxLength(80)
  origem?: string;

  @IsOptional()
  @Transform(trim)
  @IsString()
  @MaxLength(120)
  campanha?: string;

  @IsOptional()
  @Transform(trim)
  @IsString()
  @MaxLength(2000)
  mensagem?: string;

  /**
   * Honeypot anti-bot: campo oculto no formulário que humanos não preenchem.
   * Se vier preenchido, o controller descarta o lead silenciosamente (201 falso),
   * para não sinalizar ao bot que a submissão foi rejeitada.
   */
  @IsOptional()
  @IsString()
  @MaxLength(200)
  website?: string;
}
