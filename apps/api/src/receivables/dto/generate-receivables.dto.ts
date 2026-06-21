import {
  IsDateString,
  IsInt,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
} from "class-validator";

// Gera N parcelas a partir do total de um orçamento.
export class GenerateReceivablesDto {
  @IsInt()
  @Min(1)
  @Max(120)
  parcelas!: number;

  @IsDateString()
  primeiroVencimento!: string;

  @IsOptional()
  @IsString()
  @MaxLength(60)
  formaPagamento?: string;
}
