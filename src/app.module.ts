import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";

import { AppController } from "./app.controller";
import { AppService } from "./app.service";

import { CategoryModule } from "./category/category.module";
import { UsersModule } from "./users/users.module";
import { TicketModule } from "./ticket/ticket.module";
import { ClientModule } from "./client/client.module";
import { TechnicianModule } from "./technician/technician.module";
import { AuthModule } from "./auth/auth.module";

import { typeOrmConfig } from "./database/config";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ".env",
    }),
    // Usamos la configuración centralizada del data source
    TypeOrmModule.forRoot(typeOrmConfig),
    UsersModule,
    CategoryModule,
    TicketModule,
    ClientModule,
    TechnicianModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
