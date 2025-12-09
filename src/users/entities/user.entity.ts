import { Entity, Column } from "typeorm";
import { baseEntity } from "../../shared/base.entity";

export enum UserRole {
  ADMIN = "admin",
  TECHNICIAN = "technician",
  CLIENT = "client",
}

@Entity({ name: "users" })
export class User extends baseEntity {
  @Column({ type: "varchar", length: 120 })
  name: string;

  @Column({ type: "varchar", length: 150, unique: true })
  email: string;

  @Column({ type: "varchar", length: 255 })
  password: string;

  @Column({ type: "text", nullable: true })
  refreshToken: string | null;

  @Column({ type: "enum", enum: UserRole, default: UserRole.CLIENT })
  role: UserRole;
}
