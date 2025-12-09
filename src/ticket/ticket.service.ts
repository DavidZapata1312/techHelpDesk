import {
  Injectable,
  ForbiddenException,
  NotFoundException,
  BadRequestException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Equal, Repository } from "typeorm";
import { CreateTicketDto } from "./dto/create-ticket.dto";
import { UpdateTicketDto } from "./dto/update-ticket.dto";
import { Ticket, TicketStatus } from "./entities/ticket.entity";
import { User, UserRole } from "src/users/entities/user.entity";
import { Client } from "src/client/entities/client.entity";

@Injectable()
export class TicketService {
  constructor(
    @InjectRepository(Ticket)
    private readonly ticketRepository: Repository<Ticket>,

    @InjectRepository(Client)
    private readonly clientRepository: Repository<Client>,
  ) {}

  // Crear ticket: solo cliente
  async create(createTicketDto: CreateTicketDto, user: User) {
    if (user.role !== UserRole.CLIENT) {
      throw new ForbiddenException("Only clients can create tickets");
    }

    const client = await this.clientRepository.findOne({
      where: { id: Number(user.id) },
    });
    if (!client) throw new NotFoundException("Client not found");

    const ticket = this.ticketRepository.create({
      ...createTicketDto,
      client,
      status: TicketStatus.OPEN,
    });

    return this.ticketRepository.save(ticket);
  }

  // Ver todos los tickets: solo Admin
  async findAll(user: User) {
    if (user.role !== UserRole.ADMIN) {
      throw new ForbiddenException("Only admins can view all tickets");
    }

    return this.ticketRepository.find({
      relations: ["client", "technician", "category"],
    });
  }

  // Ver ticket filtrado por rol
  async findOneFiltered(id: number, user: User) {
    const ticket = await this.ticketRepository.findOne({
      where: { id },
      relations: ["client", "technician", "category"],
    });

    if (!ticket) throw new NotFoundException("Ticket not found");

    if (user.role === UserRole.CLIENT && ticket.client.id !== user.id) {
      throw new ForbiddenException("Access denied");
    }

    if (
      user.role === UserRole.TECHNICIAN &&
      (!ticket.technician || ticket.technician.id !== user.id)
    ) {
      throw new ForbiddenException("Access denied");
    }

    return ticket;
  }

  // Actualizar ticket completo: solo Admin
  async update(id: number, updateTicketDto: UpdateTicketDto, user: User) {
    if (user.role !== UserRole.ADMIN) {
      throw new ForbiddenException("Only admins can update tickets");
    }

    const ticket = await this.ticketRepository.preload({
      id,
      ...updateTicketDto,
    });

    if (!ticket) throw new NotFoundException("Ticket not found");

    return this.ticketRepository.save(ticket);
  }

  // Actualizar estado: solo técnico asignado
  async updateStatus(id: number, updateTicketDto: UpdateTicketDto, user: User) {
    if (user.role !== UserRole.TECHNICIAN) {
      throw new ForbiddenException("Only technicians can update status");
    }

    const ticket = await this.ticketRepository.findOne({
      where: { id },
      relations: ["technician"],
    });

    if (!ticket) throw new NotFoundException("Ticket not found");

    if (!ticket.technician || ticket.technician.id !== user.id) {
      throw new ForbiddenException("Access denied");
    }

    const newStatus = updateTicketDto.status as TicketStatus | undefined;
    if (newStatus === undefined || newStatus === null) {
      throw new BadRequestException("Status is required");
    }

    // Validar que el nuevo estado pertenece al enum
    if (!Object.values(TicketStatus).includes(newStatus)) {
      throw new BadRequestException("Invalid status value");
    }

    const currentStatus = ticket.status;
    if (currentStatus === undefined || currentStatus === null) {
      throw new BadRequestException("Current ticket status is missing");
    }

    const validTransitions: Record<TicketStatus, TicketStatus[]> = {
      [TicketStatus.OPEN]: [TicketStatus.IN_PROGRESS],
      [TicketStatus.IN_PROGRESS]: [TicketStatus.RESOLVED],
      [TicketStatus.RESOLVED]: [TicketStatus.CLOSED],
      [TicketStatus.CLOSED]: [],
    };

    if (!validTransitions[currentStatus].includes(newStatus)) {
      throw new BadRequestException(
        `Invalid status transition from ${currentStatus} to ${newStatus}`,
      );
    }

    if (newStatus === TicketStatus.IN_PROGRESS) {
      const inProgressCount = await this.ticketRepository.count({
        where: {
          technician: { id: Equal(Number(user.id)) },
          status: TicketStatus.IN_PROGRESS,
        },
      });

      if (inProgressCount >= 5) {
        throw new BadRequestException(
          "Technician already has 5 tickets in progress",
        );
      }
    }

    ticket.status = newStatus;
    return this.ticketRepository.save(ticket);
  }

  // Eliminar ticket: solo Admin
  async remove(id: number, user: User) {
    if (user.role !== UserRole.ADMIN) {
      throw new ForbiddenException("Only admins can delete tickets");
    }

    const ticket = await this.ticketRepository.findOne({ where: { id } });
    if (!ticket) throw new NotFoundException("Ticket not found");

    return this.ticketRepository.remove(ticket);
  }
}
