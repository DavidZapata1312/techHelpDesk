import { PipeTransform, Injectable, BadRequestException } from "@nestjs/common";
import { DataSource } from "typeorm";
import { TicketStatus } from "../entities/ticket.entity";
import { Technician } from "../../technician/entities/technician.entity";
import { Client } from "../../client/entities/client.entity";
import { Category } from "../../category/entities/category.entity";

@Injectable()
export class TicketValidationPipe implements PipeTransform {
  constructor(private readonly dataSource: DataSource) {}

  async transform(value: any) {
    const clientRepo = this.dataSource.getRepository(Client);
    const techRepo = this.dataSource.getRepository(Technician);
    const catRepo = this.dataSource.getRepository(Category);
    // const ticketRepo = this.dataSource.getRepository(Ticket);

    // Validar que exista cliente
    const client = await clientRepo.findOne({ where: { id: value.clientId } });
    if (!client) throw new BadRequestException("Cliente inválido");

    // Validar que exista categoría
    const category = await catRepo.findOne({ where: { id: value.categoryId } });
    if (!category) throw new BadRequestException("Categoría inválida");

    // Validar que técnico no tenga más de 5 tickets en progreso
    if (value.technicianId) {
      const technician = await techRepo.findOne({
        where: { id: value.technicianId },
        relations: ["tickets"],
      });
      if (!technician) throw new BadRequestException("Técnico inválido");

      const inProgress = (technician.tickets || []).filter(
        (t) => t.status === TicketStatus.IN_PROGRESS,
      ).length;
      if (inProgress >= 5)
        throw new BadRequestException(
          "Técnico tiene 5 tickets en progreso, no puede asignar más",
        );
    }

    // Validar secuencia de estados
    if (value.status) {
      const allowedSequence = {
        [TicketStatus.OPEN]: [TicketStatus.IN_PROGRESS],
        [TicketStatus.IN_PROGRESS]: [TicketStatus.RESOLVED],
        [TicketStatus.RESOLVED]: [TicketStatus.CLOSED],
        [TicketStatus.CLOSED]: [],
      } as Record<TicketStatus, TicketStatus[]>;

      const prev = value.previousStatus as TicketStatus | undefined;
      const next = value.status as TicketStatus;

      if (prev && !allowedSequence[prev]?.includes(next)) {
        throw new BadRequestException(
          `Estado inválido. Debe seguir la secuencia: Abierto → En progreso → Resuelto → Cerrado`,
        );
      }
    }

    return value;
  }
}
