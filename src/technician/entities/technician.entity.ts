import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  OneToMany,
} from "typeorm";
import {Ticket} from "../../ticket/entities/ticket.entity";

@Entity()
export class Technician extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  name: string;

  @Column({ length: 100 })
  specialty: string;

  @Column({ default: true })
  availability: boolean;

  // tickets relation
  @OneToMany(() => Ticket, (ticket) => ticket.technician)
  tickets: Ticket[];
}
