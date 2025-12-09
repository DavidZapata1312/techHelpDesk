import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  OneToMany,
} from "typeorm";
import {Ticket} from "../../ticket/entities/ticket.entity";

@Entity()
export class Client extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  name: string;

  @Column({ length: 100 })
  company: string;

  @Column({ length: 100 })
  contactEmail: string;

  // Relación con tickets
  @OneToMany(() => Ticket, (ticket) => ticket.client)
  tickets: Ticket[];
}
