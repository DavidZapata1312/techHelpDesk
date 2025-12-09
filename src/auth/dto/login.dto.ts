import { IsEmail, IsString, MinLength } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class LoginDto {
  @ApiProperty({
    description: "Email del usuario",
    example: "usuario@techhelpdesk.com",
  })
  @IsEmail({}, { message: "Debe ser un email válido" })
  email: string;

  @ApiProperty({
    description: "Contraseña del usuario",
    example: "123456",
  })
  @IsString({ message: "Debe ser un texto" })
  @MinLength(6, { message: "La contraseña debe tener mínimo 6 caracteres" })
  password: string;
}
