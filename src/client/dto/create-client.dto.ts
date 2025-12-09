import { ApiProperty } from "@nestjs/swagger";
import {
  IsString,
  IsOptional,
  ValidateNested,
} from "class-validator";
import { Type } from "class-transformer";
import { CreateUserDto } from "../../users/dto/create-user.dto";

export class CreateClientDto {
  @ApiProperty({ type: CreateUserDto, description: 'User data for client', example: { name: 'Empresa S.A.', email: 'contact@empresa.com', password: 'pass1234' } })
  @ValidateNested()
  @Type(() => CreateUserDto)
  user: CreateUserDto;

  // campos del perfil client
  @ApiProperty({ example: 'Calle Falsa 123', required: false })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiProperty({ example: '+34 600 123 456', required: false })
  @IsOptional()
  @IsString()
  phone?: string;
}
