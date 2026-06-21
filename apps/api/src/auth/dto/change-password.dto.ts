import { IsString, MaxLength, MinLength } from "class-validator";

export class ChangePasswordDto {
  @IsString()
  senhaAtual!: string;

  @IsString()
  @MinLength(6, { message: "a nova senha deve ter ao menos 6 caracteres" })
  @MaxLength(100)
  novaSenha!: string;
}
