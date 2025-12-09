import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional, IsString, MaxLength } from "class-validator";

export class CreateCategoryDto {
  @ApiProperty({ example: 'Hardware', description: 'Category name' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name: string;

  @ApiProperty({ example: 'Problemas relacionados con equipos y periféricos', required: false })
  @IsString()
  @IsOptional()
  description?: string;
}
