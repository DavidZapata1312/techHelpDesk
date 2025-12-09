import { DataSource } from "typeorm";
import {Client} from "../client/entities/client.entity";

export async function seedClients(dataSource: DataSource) {
  const repo = dataSource.getRepository(Client);

  const clients = [
    {
      name: "Company A",
      company: "Company A Inc",
      contactEmail: "contact@companya.com",
    },
    {
      name: "Company B",
      company: "Company B Ltd",
      contactEmail: "contact@companyb.com",
    },
  ];

  for (const c of clients) {
    const exists = await repo.findOne({ where: { company: c.company } });
    if (!exists) {
      const client = repo.create(c);
      await repo.save(client);
    }
  }

  console.log("✅ Clients seeded");
}
