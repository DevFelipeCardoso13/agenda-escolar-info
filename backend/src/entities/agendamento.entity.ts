import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { AgendamentoStatus } from '../common/enums/agendamento-status.enum';
import { Equipamento } from './equipamento.entity';
import { User } from './user.entity';

@Entity('agendamentos')
export class Agendamento {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  professor_id: number;

  @Column()
  equipamento_id: number;

  @Column({ type: 'int', default: 1 })
  quantidade: number;

  @Column({ type: 'datetime' })
  data_hora_inicio: Date;

  @Column({ type: 'datetime' })
  data_hora_fim: Date;

  @Column({ type: 'text', nullable: true })
  observacao: string | null;

  @Column({
    type: 'enum',
    enum: AgendamentoStatus,
    default: AgendamentoStatus.CONFIRMADO,
  })
  status: AgendamentoStatus;

  @ManyToOne(() => User, (user) => user.agendamentos)
  @JoinColumn({ name: 'professor_id' })
  professor: User;

  @ManyToOne(() => Equipamento, (equipamento) => equipamento.agendamentos)
  @JoinColumn({ name: 'equipamento_id' })
  equipamento: Equipamento;
}
