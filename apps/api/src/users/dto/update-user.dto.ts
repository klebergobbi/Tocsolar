import {
  IsBoolean,
  IsIn,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from "class-validator";

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  @MaxLength(120)
  nome?: string;

  @IsOptional()
  @IsIn(["admin", "comercial"], { message: "perfil inválido" })
  role?: "admin" | "comercial";

  @IsOptional()
  @IsBoolean()
  ativo?: boolean;

  @IsOptional()
  @IsString()
  @MinLength(6, { message: "a senha deve ter ao menos 6 caracteres" })
  @MaxLength(100)
  senha?: string;
}
