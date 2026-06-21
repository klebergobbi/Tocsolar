import {
  IsDateString,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  Min,
} from "class-validator";

export class CreateReceivableDto {
  @IsString()
  clientId!: string;

  @IsOptional()
  @IsString()
  quoteId?: string;

  @IsString()
  @MaxLength(200)
  descricao!: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  parcela?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  totalParcelas?: number;

  @IsNumber()
  @Min(0)
  valor!: number;

  @IsDateString()
  vencimento!: string;

  @IsOptional()
  @IsString()
  @MaxLength(60)
  formaPagamento?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  observacoes?: string;
}
