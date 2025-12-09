import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  OneToMany,
  OneToOne,
  JoinColumn,
} from "typeorm";
import { Ticket } from "../../ticket/entities/ticket.entity";
import {User} from "../../users/entities/user.entity";

@Entity()
export class Technician extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  // Relación 1:1 con User
  @OneToOne(() => User, { cascade: true })
  @JoinColumn()
  user: User;

  @Column({ length: 100, nullable: true })
  specialty: string;

  @Column({ default: true })
  availability: boolean;

  // Relación con tickets
  @OneToMany(() => Ticket, (ticket) => ticket.technician)
  tickets: Ticket[];
}
