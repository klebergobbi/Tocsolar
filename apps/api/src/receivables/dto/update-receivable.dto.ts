import {
  IsDateString,
  IsIn,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  Min,
} from "class-validator";

const STATUS = ["pendente", "pago", "cancelado"] as const;

export class UpdateReceivableDto {
  @IsOptional()
  @IsString()
  @MaxLength(200)
  descricao?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  valor?: number;

  @IsOptional()
  @IsDateString()
  vencimento?: string;

  @IsOptional()
  @IsIn(STATUS, { message: "status inválido" })
  status?: (typeof STATUS)[number];

  @IsOptional()
  @IsDateString()
  pagoEm?: string;

  @IsOptional()
  @IsString()
  @MaxLength(60)
  formaPagamento?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  observacoes?: string;
}
