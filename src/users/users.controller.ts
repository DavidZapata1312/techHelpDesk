// typescript
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  ParseIntPipe,
  UseGuards,
} from "@nestjs/common";
import { UsersService } from "./users.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { CreateClientDto } from "../client/dto/create-client.dto";
import { CreateTechnicianDto } from "../technician/dto/create-technician.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { User } from "./entities/user.entity";
import { Client } from "../client/entities/client.entity";
import { Technician } from "../technician/entities/technician.entity";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../auth/guards/roles.guard";
import { Roles } from "../auth/decorators/roles.decorator";
import { UserRole } from "./entities/user.entity";
import { ApiTags, ApiBearerAuth, ApiOperation, ApiBody } from "@nestjs/swagger";

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
@ApiTags("Users")
@ApiBearerAuth("Authorization")
@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // GET /users
  @Get()
  findAll(): Promise<User[]> {
    return this.usersService.findAll();
  }

  // GET /users/:id
  @Get(":id")
  findOne(@Param("id", ParseIntPipe) id: number): Promise<User> {
    return this.usersService.findOne(id);
  }

  // POST /users -> crear usuario genérico (sin perfil)
  @Post()
  @ApiOperation({ summary: "Create a user" })
  @ApiBody({ type: CreateUserDto, description: "User creation payload" })
  create(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.usersService.create(createUserDto);
  }

  // POST /users/client -> crear cliente con perfil
  @Post("client")
  @ApiOperation({ summary: "Create a client (user + client profile)" })
  @ApiBody({ type: CreateClientDto, description: "Client creation payload" })
  createClient(@Body() createClientDto: CreateClientDto): Promise<Client> {
    return this.usersService.createClient(createClientDto);
  }

  // POST /users/technician -> crear técnico con perfil
  @Post("technician")
  @ApiOperation({ summary: "Create a technician (user + technician profile)" })
  @ApiBody({ type: CreateTechnicianDto, description: "Technician creation payload" })
  createTechnician(
    @Body() createTechnicianDto: CreateTechnicianDto,
  ): Promise<Technician> {
    return this.usersService.createTechnician(createTechnicianDto);
  }

  // PATCH /users/:id -> actualizar usuario
  @Patch(":id")
  update(
    @Param("id", ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<User> {
    return this.usersService.update(id, updateUserDto);
  }

  // DELETE /users/:id -> eliminar usuario
  @Delete(":id")
  delete(@Param("id", ParseIntPipe) id: number) {
    return this.usersService.delete(id);
  }
}
