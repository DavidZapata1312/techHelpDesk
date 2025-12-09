import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TechnicianService } from './technician.service';
import { TechnicianController } from './technician.controller';
import { Technician } from './entities/technician.entity';
import { User } from '../users/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Technician, User])],
  controllers: [TechnicianController],
  providers: [TechnicianService],
  exports: [TechnicianService],
})
export class TechnicianModule {}
