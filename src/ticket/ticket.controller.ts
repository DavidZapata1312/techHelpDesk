import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from "@nestjs/common";
import { TicketService } from "./ticket.service";
import { CreateTicketDto } from "./dto/create-ticket.dto";
import { UpdateTicketDto } from "./dto/update-ticket.dto";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../auth/guards/roles.guard";
import { Roles } from "../auth/decorators/roles.decorator";
import { CurrentUser } from "../auth/decorators/current-user.decorator";
import { UserRole } from "../users/entities/user.entity";
import { User } from "../users/entities/user.entity";
import { ApiTags, ApiBearerAuth, ApiOperation, ApiBody } from "@nestjs/swagger";

@ApiTags("Tickets")
@ApiBearerAuth("Authorization")
@Controller("ticket")
export class TicketController {
  constructor(private readonly ticketService: TicketService) {}

  // Cliente crea ticket
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.CLIENT)
  @Post()
  @ApiOperation({ summary: "Create a ticket" })
  @ApiBody({ type: CreateTicketDto, description: "Ticket creation payload" })
  create(@Body() createTicketDto: CreateTicketDto, @CurrentUser() user: User) {
    return this.ticketService.create(createTicketDto, user);
  }

  // Admin ve todos los tickets
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Get()
  findAll(@CurrentUser() user: User) {
    return this.ticketService.findAll(user);
  }

  // Cliente ve solo su ticket, Admin puede ver cualquiera
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.CLIENT, UserRole.ADMIN)
  @Get(":id")
  findOne(@Param("id") id: string, @CurrentUser() user: User) {
    return this.ticketService.findOneFiltered(+id, user);
  }

  // Técnico actualiza estado de ticket asignado
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.TECHNICIAN)
  @Patch(":id/status")
  @ApiOperation({ summary: "Update ticket status (technician)" })
  @ApiBody({ type: UpdateTicketDto, description: "Payload to update ticket status" })
  updateStatus(
    @Param("id") id: string,
    @Body() updateTicketDto: UpdateTicketDto,
    @CurrentUser() user: User,
  ) {
    return this.ticketService.updateStatus(+id, updateTicketDto, user);
  }

  // Admin puede actualizar cualquier ticket
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Patch(":id")
  @ApiOperation({ summary: "Update ticket (admin)" })
  @ApiBody({ type: UpdateTicketDto, description: "Ticket update payload" })
  update(
    @Param("id") id: string,
    @Body() updateTicketDto: UpdateTicketDto,
    @CurrentUser() user: User,
  ) {
    return this.ticketService.update(+id, updateTicketDto, user);
  }

  // Solo Admin puede eliminar tickets
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Delete(":id")
  remove(@Param("id") id: string, @CurrentUser() user: User) {
    return this.ticketService.remove(+id, user);
  }
}
