import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User } from "./entities/user.entity";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  findAll() {
    return this.userRepository.find();
  }

  async findOne(id: number) {
    const user = await this.userRepository.findOne({ where: { id } });

    if (!user) {
      throw new NotFoundException(`User ${id} don't exist.`);
    }

    return user;
  }

  findByEmail(email: string) {
    return this.userRepository.findOne({ where: { email } });
  }

  create(dto: CreateUserDto) {
    const user = this.userRepository.create(dto);
    return this.userRepository.save(user);
  }

  async update(id: number, dto: UpdateUserDto) {
    const user = await this.findOne(id);

    const updated = { ...user, ...dto };

    return this.userRepository.save(updated);
  }

  async delete(id: number) {
    const user = await this.findOne(id);
    await this.userRepository.remove(user);
    return { message: `user ${id} delete.` };
  }
}
