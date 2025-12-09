import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CategoryModule } from './category/category.module';
import { UsersModule } from './users/users.module';
import { TicketModule } from './ticket/ticket.module';
import { ClientModule } from './client/client.module';
import { TechnicianModule } from './technician/technician.module';

@Module({
  imports: [UsersModule, CategoryModule, CategoryModule, TicketModule, ClientModule, TechnicianModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
