import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from "@nestjs/common";
import { UsersService } from "../users/users.service";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcrypt";
import { User, UserRole } from "../users/entities/user.entity";
import { CreateUserDto } from "../users/dto/create-user.dto";
import { RegisterDto } from "./dto/register.dto";

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  // Validar credenciales
  async validateUser(email: string, password: string): Promise<User> {
    const user = await this.usersService.findByEmail(email);
    if (!user) throw new UnauthorizedException("Invalid credentials");

    const passwordValid = await bcrypt.compare(password, user.password);
    if (!passwordValid) throw new UnauthorizedException("Invalid credentials");

    return user;
  }

  // Login -> generar JWT
  async login(user: User) {
    const payload = { sub: user.id, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  // Registro -> crear usuario
  async register(registerDto: RegisterDto): Promise<User> {
    const { name, email, password, role } = registerDto;

    // Verificar si ya existe el usuario
    const existingUser = await this.usersService.findByEmail(email);
    if (existingUser) {
      throw new BadRequestException("User with this email already exists");
    }

    // Hash de la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    const createUserDto: CreateUserDto = {
      name,
      email,
      password: hashedPassword,
      role: role || UserRole.CLIENT, // default role
    };

    return this.usersService.create(createUserDto);
  }
}
