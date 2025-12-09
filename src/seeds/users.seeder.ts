import { DataSource } from "typeorm";
import { User, UserRole } from "../users/entities/user.entity";
import * as bcrypt from "bcrypt";

export async function seedUsers(dataSource: DataSource) {
  const repo = dataSource.getRepository(User);

  const users = [
    {
      name: "Admin User",
      email: "admin@techhelp.com",
      password: "admin123",
      role: UserRole.ADMIN,
    },
    {
      name: "Tech User",
      email: "tech@techhelp.com",
      password: "tech123",
      role: UserRole.TECHNICIAN,
    },
    {
      name: "Client User",
      email: "client@techhelp.com",
      password: "client123",
      role: UserRole.CLIENT,
    },
  ];

  for (const u of users) {
    const userExists = await repo.findOne({ where: { email: u.email } });
    if (!userExists) {
      const hashed = await bcrypt.hash(u.password, 10);
      const user = repo.create({ ...u, password: hashed });
      await repo.save(user);
    }
  }

  console.log("✅ Users seeded");
}
