import { ApiProperty } from "@nestjs/swagger";
import {
  IsString,
  IsNotEmpty,
  IsEnum,
  IsOptional,
  IsNumber,
} from "class-validator";
import { TicketStatus, TicketPriority } from "../entities/ticket.entity";

export class CreateTicketDto {
  @ApiProperty({
    example: "No enciende impresora",
    description: "Short title for the ticket",
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    example: "La impresora HP LJ no enciende desde ayer...",
    description: "Detailed description",
  })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ example: 1, description: "Category ID" })
  @IsNumber()
  @IsNotEmpty()
  categoryId: Number; // ID de la categoría

  @ApiProperty({
    example: "medium",
    enum: Object.values(TicketPriority),
    required: false,
  })
  @IsOptional()
  @IsEnum(TicketPriority)
  priority?: TicketPriority;
}
