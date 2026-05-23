import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EquipamentoStatus } from '../common/enums/equipamento-status.enum';
import { Equipamento } from '../entities/equipamento.entity';
import { UpdateEquipamentoDto } from './dto/update-equipamento.dto';

@Injectable()
export class EquipamentosService {
  constructor(
    @InjectRepository(Equipamento)
    private readonly equipamentosRepository: Repository<Equipamento>,
  ) {}

  async findAllDisponiveis(): Promise<Equipamento[]> {
    return this.equipamentosRepository
      .createQueryBuilder('e')
      .where('e.status = :status', { status: EquipamentoStatus.DISPONIVEL })
      .andWhere('(e.qtd_total - e.qtd_em_uso - e.qtd_reparo) > 0')
      .orderBy('e.nome', 'ASC')
      .getMany();
  }

  async findOne(id: number): Promise<Equipamento> {
    const equipamento = await this.equipamentosRepository.findOne({
      where: { id },
    });
    if (!equipamento) {
      throw new NotFoundException('Equipamento não encontrado');
    }
    return equipamento;
  }

  async update(id: number, updateDto: UpdateEquipamentoDto): Promise<Equipamento> {
    const equipamento = await this.findOne(id);
    Object.assign(equipamento, updateDto);
    return this.equipamentosRepository.save(equipamento);
  }
}
