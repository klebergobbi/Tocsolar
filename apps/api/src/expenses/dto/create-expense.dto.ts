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

export class CreateExpenseDto {
  @IsString()
  @MaxLength(200)
  descricao!: string;

  @IsIn(CATEGORIAS, { message: "categoria inválida" })
  categoria!: (typeof CATEGORIAS)[number];

  @IsNumber()
  @Min(0)
  valor!: number;

  @IsDateString()
  data!: string;

  @IsOptional()
  @IsIn(["pago", "pendente"])
  status?: "pago" | "pendente";

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
  quoteId?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  observacoes?: string;
}
