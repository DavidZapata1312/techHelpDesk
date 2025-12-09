import { DataSource } from "typeorm";
import {Category} from "../category/entities/category.entity";

export async function seedCategories(dataSource: DataSource) {
  const repo = dataSource.getRepository(Category);

  const categories = [
    { name: "Software Issue", description: "Problemas con software" },
    { name: "Hardware Issue", description: "Problemas con hardware" },
    { name: "Request", description: "Solicitudes varias" },
  ];

  for (const c of categories) {
    const catExists = await repo.findOne({ where: { name: c.name } });
    if (!catExists) {
      const category = repo.create(c);
      await repo.save(category);
    }
  }

  console.log("✅ Categories seeded");
}
