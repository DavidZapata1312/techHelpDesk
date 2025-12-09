import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import {UserRole} from "../../users/entities/user.entity";

export class RegisterDto {
  @ApiProperty({
    description: "Nombre completo del usuario",
    example: "Juan Pérez",
  })
  @IsString()
  @IsNotEmpty({ message: "El nombre es obligatorio" })
  name: string;

  @ApiProperty({
    description: "Correo electrónico del usuario",
    example: "usuario@techhelpdesk.com",
  })
  @IsEmail({}, { message: "Debe ser un email válido" })
  email: string;

  @ApiProperty({
    description: "Contraseña del usuario",
    example: "123456",
  })
  @IsString()
  @MinLength(6, { message: "La contraseña debe tener al menos 6 caracteres" })
  password: string;

  @ApiPropertyOptional({
    description: "Rol del usuario",
    enum: UserRole,
    example: UserRole.CLIENT,
  })
  @IsEnum(UserRole)
  @IsOptional()
  role?: UserRole;
}
