import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsOptional, IsBoolean, ValidateNested } from "class-validator";
import { Type } from "class-transformer";
import { CreateUserDto } from "../../users/dto/create-user.dto";

export class CreateTechnicianDto {
  @ApiProperty({ type: CreateUserDto, example: { name: 'Carlos Perez', email: 'carlos.perez@example.com', password: 'pass1234' } })
  @ValidateNested()
  @Type(() => CreateUserDto)
  user: CreateUserDto;

  @ApiProperty({ example: 'Redes', required: false })
  @IsString()
  @IsOptional()
  specialty?: string;

  @ApiProperty({ example: true, required: false })
  @IsBoolean()
  @IsOptional()
  availability?: boolean;
}
