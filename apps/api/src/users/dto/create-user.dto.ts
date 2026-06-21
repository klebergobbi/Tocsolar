import {
  IsEmail,
  IsIn,
  IsString,
  MaxLength,
  MinLength,
} from "class-validator";

export class CreateUserDto {
  @IsString()
  @MaxLength(120)
  nome!: string;

  @IsEmail({}, { message: "e-mail inválido" })
  email!: string;

  @IsString()
  @MinLength(6, { message: "a senha deve ter ao menos 6 caracteres" })
  @MaxLength(100)
  senha!: string;

  @IsIn(["admin", "comercial"], { message: "perfil inválido" })
  role!: "admin" | "comercial";
}
