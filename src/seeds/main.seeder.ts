import {AppDataSource} from "../database/config";
import { seedUsers } from "./users.seeder";
import { seedCategories } from "./categories";
import { seedClients } from "./clients.seeder";
import { seedTechnicians } from "./technicians.seeder";
import seedTickets from "./tickets.seeder";

async function mainSeeder() {
  try {
    await AppDataSource.initialize();
    console.log("🟢 DataSource initialized");

    await seedUsers(AppDataSource);
    await seedCategories(AppDataSource);
    await seedClients(AppDataSource);
    await seedTechnicians(AppDataSource);
    await seedTickets(AppDataSource);

    console.log("🎉 Seeding completed!");
  } catch (error) {
    console.error("❌ Seeding failed", error);
    process.exitCode = 1;
  } finally {
    if (AppDataSource.isInitialized) await AppDataSource.destroy();
  }
}

mainSeeder();
