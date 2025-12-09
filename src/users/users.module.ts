import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UsersService } from "./users.service";
import { UsersController } from "./users.controller";
import { User } from "./entities/user.entity";
import { Client } from "../client/entities/client.entity";
import { Technician } from "../technician/entities/technician.entity";

@Module({
  imports: [TypeOrmModule.forFeature([User, Client, Technician])],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
