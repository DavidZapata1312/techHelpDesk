import { Entity, Column } from 'typeorm';
import {baseEntity} from '../../shared/base.entity';



@Entity({ name: 'users' })
export class User extends baseEntity {
  @Column({ type: 'varchar', length: 120 })
  name: string;

  @Column({ type: 'varchar', length: 150, unique: true })
  email: string;

  @Column({ type: 'varchar', length: 255 })
  password: string;

  @Column({ type: 'text', nullable: true })
  refreshToken: string | null;

}
