import { Entity, Column } from "typeorm";
import {baseEntity} from "../../shared/base.entity";

@Entity("categories")
export class Category extends baseEntity {
  @Column({ type: "varchar", length: 100, unique: true })
  name: string;

  @Column({ type: "text", nullable: true })
  description: string;
}
