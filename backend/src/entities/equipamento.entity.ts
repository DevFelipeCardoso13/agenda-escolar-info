import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { EquipamentoStatus } from '../common/enums/equipamento-status.enum';
import { Agendamento } from './agendamento.entity';

@Entity('equipamentos')
export class Equipamento {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255 })
  nome: string;

  @Column({ length: 100 })
  tipo: string;

  @Column({ length: 255 })
  local: string;

  @Column({ type: 'int', default: 0 })
  qtd_total: number;

  @Column({ type: 'int', default: 0 })
  qtd_em_uso: number;

  @Column({ type: 'int', default: 0 })
  qtd_reparo: number;

  @Column({
    type: 'enum',
    enum: EquipamentoStatus,
    default: EquipamentoStatus.DISPONIVEL,
  })
  status: EquipamentoStatus;

  @OneToMany(() => Agendamento, (agendamento) => agendamento.equipamento)
  agendamentos: Agendamento[];
}
