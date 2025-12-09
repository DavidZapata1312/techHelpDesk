import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User, UserRole } from "./entities/user.entity";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import {Client} from "../client/entities/client.entity";
import {Technician} from "../technician/entities/technician.entity";
import {CreateClientDto} from "../client/dto/create-client.dto";
import {CreateTechnicianDto} from "../technician/dto/create-technician.dto";

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(Client)
    private readonly clientRepository: Repository<Client>,

    @InjectRepository(Technician)
    private readonly technicianRepository: Repository<Technician>,
  ) {}

  // Obtener todos los usuarios
  findAll() {
    return this.userRepository.find();
  }

  // Buscar usuario por id
  async findOne(id: number) {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) throw new NotFoundException(`User ${id} doesn't exist.`);
    return user;
  }

  // Buscar usuario por email
  findByEmail(email: string) {
    return this.userRepository.findOne({ where: { email } });
  }

  // Crear un usuario simple
  async create(dto: CreateUserDto) {
    const user = this.userRepository.create(dto);
    return this.userRepository.save(user);
  }

  // Crear cliente con perfil
  async createClient(dto: CreateClientDto) {
    const { user: userDto, ...profileDto } = dto;

    // Verificar si email ya existe
    const existingUser = await this.findByEmail(userDto.email);
    if (existingUser)
      throw new BadRequestException("Email already registered.");

    // Crear user
    const user = this.userRepository.create({
      ...userDto,
      role: UserRole.CLIENT,
    });
    await this.userRepository.save(user);

    // Crear client vinculado al user
    const client = this.clientRepository.create({ ...profileDto, user });
    return this.clientRepository.save(client);
  }

  // Crear técnico con perfil
  async createTechnician(dto: CreateTechnicianDto) {
    const { user: userDto, ...profileDto } = dto;

    const existingUser = await this.findByEmail(userDto.email);
    if (existingUser)
      throw new BadRequestException("Email already registered.");

    const user = this.userRepository.create({
      ...userDto,
      role: UserRole.TECHNICIAN,
    });
    await this.userRepository.save(user);

    const technician = this.technicianRepository.create({
      ...profileDto,
      user,
    });
    return this.technicianRepository.save(technician);
  }

  // Actualizar usuario
  async update(id: number, dto: UpdateUserDto) {
    const user = await this.findOne(id);
    const updated = { ...user, ...dto };
    return this.userRepository.save(updated);
  }

  // Eliminar usuario
  async delete(id: number) {
    const user = await this.findOne(id);
    await this.userRepository.remove(user);
    return { message: `User ${id} deleted.` };
  }
}
