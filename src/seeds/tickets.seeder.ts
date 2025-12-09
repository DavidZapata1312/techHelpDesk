import { DataSource } from "typeorm";
import {Ticket, TicketStatus, TicketPriority} from "../ticket/entities/ticket.entity";
import { Client } from "../client/entities/client.entity";
import {Technician} from "../technician/entities/technician.entity";
import {Category} from "../category/entities/category.entity";

export default async function seedTickets(dataSource: DataSource) {
  const repo = dataSource.getRepository(Ticket);
  const clientRepo = dataSource.getRepository(Client);
  const techRepo = dataSource.getRepository(Technician);
  const catRepo = dataSource.getRepository(Category);

  // Obtener una referencia válida: usamos findOneBy({}) para obtener la primera fila si existe
  const client = await clientRepo.findOneBy({});
  const tech = await techRepo.findOneBy({});
  const category = await catRepo.findOneBy({});

  if (!client || !tech || !category)
    return console.log("⚠️ Missing references for tickets");

  const tickets = [
    {
      title: "Computer not turning on",
      description: "The PC in office 3 does not power on.",
      status: TicketStatus.OPEN,
      client,
      technician: tech,
      category,
      priority: TicketPriority.MEDIUM,
    },
  ];

  for (const t of tickets) {
    const exists = await repo.findOneBy({ title: t.title });
    if (!exists) {
      const ticket = repo.create(t);
      await repo.save(ticket);
    }
  }

  console.log("✅ Tickets seeded");
}
