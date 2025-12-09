import { ApiProperty } from "@nestjs/swagger";
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
  IsEnum,
  IsOptional,
} from "class-validator";
import { UserRole } from "../entities/user.entity";

export class CreateUserDto {
  @ApiProperty({ example: 'Juan Perez', description: 'Full name of the user' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'juan.perez@example.com', description: 'User email' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: 'strongPassword123', description: 'Password (min 6 chars)' })
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty({ example: 'client', enum: Object.values(UserRole), required: false })
  @IsEnum(UserRole)
  @IsOptional()
  role?: UserRole;
}
