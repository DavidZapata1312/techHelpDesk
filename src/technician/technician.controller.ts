import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from "@nestjs/common";
import { TechnicianService } from "./technician.service";
import { CreateTechnicianDto } from "./dto/create-technician.dto";
import { UpdateTechnicianDto } from "./dto/update-technician.dto";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../auth/guards/roles.guard";
import { Roles } from "../auth/decorators/roles.decorator";
import { UserRole } from "../users/entities/user.entity";

@Controller("technician")
export class TechnicianController {
  constructor(private readonly technicianService: TechnicianService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Post()
  create(@Body() createTechnicianDto: CreateTechnicianDto) {
    return this.technicianService.create(createTechnicianDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Get()
  findAll() {
    return this.technicianService.findAll();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.technicianService.findOne(+id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Patch(":id")
  update(
    @Param("id") id: string,
    @Body() updateTechnicianDto: UpdateTechnicianDto,
  ) {
    return this.technicianService.update(+id, updateTechnicianDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.technicianService.remove(+id);
  }
}
