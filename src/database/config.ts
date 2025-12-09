import { DataSource } from "typeorm";
import { User } from "../users/entities/user.entity";
import {Category} from "../category/entities/category.entity";
import {Ticket} from "../ticket/entities/ticket.entity";
import {Client} from "../client/entities/client.entity";
import {Technician} from "../technician/entities/technician.entity";
import "dotenv/config";
import { join } from 'path';

// Determine migration glob that works both in ts-node (dev) and compiled (dist)
const migrationsGlob = [
  // when running with ts-node / nest start --watch
  join(__dirname, "..", "migrations", "*.ts"),
  // when running compiled (production) from dist
  join(__dirname, "..", "migrations", "*.js"),
];

// Exportamos una configuración compatible con TypeOrmModule.forRoot
export const typeOrmConfig = {
  type: "postgres",
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT) || 5432,
  username: process.env.DB_USER,
  password: process.env.DB_PASS || "postgres",
  database: process.env.DB_NAME,
  entities: [User, Category, Ticket, Client, Technician],
  migrations: migrationsGlob,
  synchronize: false,
} as any;

export const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT) || 5432,
  username: process.env.DB_USER,
  password: process.env.DB_PASS || "postgres",
  database: process.env.DB_NAME,
  entities: [User, Category, Ticket, Client, Technician],
  migrations: migrationsGlob,
  synchronize: false,
});
