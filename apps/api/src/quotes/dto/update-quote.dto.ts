import { Type } from "class-transformer";
import {
  IsArray,
  IsIn,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  Min,
  ValidateNested,
} from "class-validator";
import { QuoteItemDto } from "./quote-item.dto";

const STATUS = ["rascunho", "enviado", "aprovado", "recusado"] as const;

export class UpdateQuoteDto {
  @IsOptional()
  @IsNumber()
  @Min(0)
  systemKwp?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  validadeDias?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  desconto?: number;

  @IsOptional()
  @IsString()
  @MaxLength(2000)
  observacoes?: string;

  @IsOptional()
  @IsIn(STATUS, { message: "status inválido" })
  status?: (typeof STATUS)[number];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => QuoteItemDto)
  items?: QuoteItemDto[];
}
