import { DataSource } from "typeorm";
import {Technician} from "../technician/entities/technician.entity";
import { User, UserRole } from "../users/entities/user.entity";
import * as bcrypt from "bcrypt";

export async function seedTechnicians(dataSource: DataSource) {
  const techRepo = dataSource.getRepository(Technician);
  const userRepo = dataSource.getRepository(User);

  const techs = [
    {
      name: "John Doe",
      email: "john.tech@techhelp.com",
      password: "tech123",
      specialty: "Hardware",
      availability: true,
    },
    {
      name: "Jane Smith",
      email: "jane.tech@techhelp.com",
      password: "tech123",
      specialty: "Software",
      availability: true,
    },
  ];

  for (const t of techs) {
    // Verificar si el usuario ya existe
    let user = await userRepo.findOne({ where: { email: t.email } });
    if (!user) {
      const hashed = await bcrypt.hash(t.password, 10);
      user = userRepo.create({
        name: t.name,
        email: t.email,
        password: hashed,
        role: UserRole.TECHNICIAN,
      });
      await userRepo.save(user);
    }

    // Verificar si el técnico ya existe
    const existingTech = await techRepo.findOne({
      where: { user: { id: user.id } },
      relations: ["user"],
    });
    if (!existingTech) {
      const technician = techRepo.create({
        user,
        specialty: t.specialty,
        availability: t.availability,
      });
      await techRepo.save(technician);
    }
  }

  console.log("✅ Technicians seeded");
}
