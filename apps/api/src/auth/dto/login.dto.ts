import { IsEmail, IsString, MaxLength, MinLength } from "class-validator";

export class LoginDto {
  @IsEmail({}, { message: "e-mail inválido" })
  email!: string;

  @IsString()
  @MinLength(6, { message: "senha muito curta" })
  @MaxLength(100)
  senha!: string;
}
