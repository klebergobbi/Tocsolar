import { IsNumber, IsString, MaxLength, Min } from "class-validator";

export class QuoteItemDto {
  @IsString()
  @MaxLength(200)
  descricao!: string;

  @IsNumber()
  @Min(0)
  quantidade!: number;

  @IsNumber()
  @Min(0)
  valorUnit!: number;
}
