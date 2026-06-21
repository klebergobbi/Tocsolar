import { Type } from "class-transformer";
import {
  ArrayMinSize,
  IsArray,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  Min,
  ValidateNested,
} from "class-validator";
import { QuoteItemDto } from "./quote-item.dto";

export class CreateQuoteDto {
  @IsString()
  clientId!: string;

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

  @IsArray()
  @ArrayMinSize(1, { message: "inclua ao menos um item" })
  @ValidateNested({ each: true })
  @Type(() => QuoteItemDto)
  items!: QuoteItemDto[];
}
