import {
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { UserTipo } from '../common/enums/user-tipo.enum';
import { Agendamento } from './agendamento.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'varchar',
    length: 255,
  })
  nome: string;

  @Column({
    type: 'varchar',
    length: 255,
    unique: true,
  })
  email: string;

  @Column({
    type: 'varchar',
    length: 255,
  })
  senha: string;

  @Column({
    type: 'enum',
    enum: UserTipo,
    default: UserTipo.PROFESSOR,
  })
  tipo: UserTipo;

  @Column({
    type: 'varchar',
    length: 20,
    nullable: true,
  })
  telefone?: string;

  @OneToMany(
    () => Agendamento,
    (agendamento) => agendamento.professor,
  )
  agendamentos: Agendamento[];
}