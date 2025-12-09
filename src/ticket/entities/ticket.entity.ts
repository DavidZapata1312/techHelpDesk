import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  BaseEntity,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { Category } from "../../category/entities/category.entity";
import {Client} from "../../client/entities/client.entity";
import {Technician} from "../../technician/entities/technician.entity";

export enum TicketStatus {
  OPEN = "open",
  IN_PROGRESS = "in_progress",
  RESOLVED = "resolved",
  CLOSED = "closed",
}

export enum TicketPriority {
  LOW = "low",
  MEDIUM = "medium",
  HIGH = "high",
}

@Entity()
export class Ticket extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  title: string;

  @Column("text")
  description: string;

  @Column({ type: "enum", enum: TicketStatus, default: TicketStatus.OPEN })
  status: TicketStatus;

  @Column({
    type: "enum",
    enum: TicketPriority,
    default: TicketPriority.MEDIUM,
  })
  priority: TicketPriority;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relations
  @ManyToOne(() => Category, { nullable: false })
  @JoinColumn({ name: "categoryId" })
  category: Category;

  @ManyToOne(() => Client, { nullable: false })
  @JoinColumn({ name: "clientId" })
  client: Client;

  @ManyToOne(() => Technician, { nullable: true })
  @JoinColumn({ name: "technicianId" })
  technician?: Technician;
}
