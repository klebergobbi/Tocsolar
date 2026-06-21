import {
  IsDateString,
  IsIn,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  Min,
} from "class-validator";

const CATEGORIAS = [
  "equipamento",
  "mao_de_obra",
  "operacional",
  "marketing",
  "imposto",
  "outro",
] as const;

export class UpdateExpenseDto {
  @IsOptional()
  @IsString()
  @MaxLength(200)
  descricao?: string;

  @IsOptional()
  @IsIn(CATEGORIAS, { message: "categoria inválida" })
  categoria?: (typeof CATEGORIAS)[number];

  @IsOptional()
  @IsNumber()
  @Min(0)
  valor?: number;

  @IsOptional()
  @IsDateString()
  data?: string;

  @IsOptional()
  @IsIn(["pago", "pendente"])
  status?: "pago" | "pendente";

  @IsOptional()
  @IsDateString()
  pagoEm?: string;

  @IsOptional()
  @IsString()
  @MaxLength(120)
  fornecedor?: string;

  @IsOptional()
  @IsString()
  @MaxLength(60)
  formaPagamento?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  observacoes?: string;
}
