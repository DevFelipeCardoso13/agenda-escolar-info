import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AgendamentoStatus } from '../common/enums/agendamento-status.enum';
import { EquipamentoStatus } from '../common/enums/equipamento-status.enum';
import { UserTipo } from '../common/enums/user-tipo.enum';
import { Agendamento } from '../entities/agendamento.entity';
import { EquipamentosService } from '../equipamentos/equipamentos.service';
import { CreateAgendamentoDto } from './dto/create-agendamento.dto';
import { FilterAgendamentoDto } from './dto/filter-agendamento.dto';

@Injectable()
export class AgendamentosService {
  constructor(
    @InjectRepository(Agendamento)
    private readonly agendamentosRepository: Repository<Agendamento>,
    private readonly equipamentosService: EquipamentosService,
  ) {}

  async create(professorId: number, dto: CreateAgendamentoDto) {
    const inicio = new Date(dto.data_hora_inicio);
    const fim = new Date(dto.data_hora_fim);

    if (inicio >= fim) {
      throw new BadRequestException(
        'data_hora_fim deve ser posterior a data_hora_inicio',
      );
    }

    const equipamento = await this.equipamentosService.findOne(
      dto.equipamento_id,
    );

    if (equipamento.status !== EquipamentoStatus.DISPONIVEL) {
      throw new BadRequestException('Equipamento não está disponível');
    }

    const disponivel =
      equipamento.qtd_total - equipamento.qtd_em_uso - equipamento.qtd_reparo;
    if (dto.quantidade > disponivel) {
      throw new BadRequestException(
        `Quantidade solicitada excede o disponível (${disponivel})`,
      );
    }

    const conflito = await this.temConflitoHorario(
      dto.equipamento_id,
      inicio,
      fim,
    );
    if (conflito) {
      throw new ConflictException(
        'Horário já reservado para este equipamento',
      );
    }

    const agendamento = this.agendamentosRepository.create({
      professor_id: professorId,
      equipamento_id: dto.equipamento_id,
      quantidade: dto.quantidade,
      data_hora_inicio: inicio,
      data_hora_fim: fim,
      observacao: dto.observacao ?? null,
      status: AgendamentoStatus.CONFIRMADO,
    });

    return this.agendamentosRepository.save(agendamento);
  }

  async findAll(filters: FilterAgendamentoDto) {
    const qb = this.agendamentosRepository
      .createQueryBuilder('a')
      .leftJoinAndSelect('a.professor', 'professor')
      .leftJoinAndSelect('a.equipamento', 'equipamento')
      .orderBy('a.data_hora_inicio', 'DESC');

    if (filters.data) {
      qb.andWhere('DATE(a.data_hora_inicio) = :data', {
        data: filters.data,
      });
    }

    if (filters.equipamento_id) {
      qb.andWhere('a.equipamento_id = :equipamento_id', {
        equipamento_id: filters.equipamento_id,
      });
    }

    if (filters.professor_id) {
      qb.andWhere('a.professor_id = :professor_id', {
        professor_id: filters.professor_id,
      });
    }

    return qb.getMany();
  }

  async findMeus(professorId: number) {
    return this.agendamentosRepository.find({
      where: { professor_id: professorId },
      relations: { equipamento: true },
      order: { data_hora_inicio: 'DESC' },
    });
  }

  async cancelar(
    id: number,
    userId: number,
    userTipo: UserTipo,
  ): Promise<Agendamento> {
    const agendamento = await this.agendamentosRepository.findOne({
      where: { id },
    });

    if (!agendamento) {
      throw new NotFoundException('Agendamento não encontrado');
    }

    if (
      agendamento.professor_id !== userId &&
      userTipo !== UserTipo.COORDENACAO &&
      userTipo !== UserTipo.ADMIN
    ) {
      throw new ForbiddenException(
        'Você não tem permissão para cancelar este agendamento',
      );
    }

    if (agendamento.status === AgendamentoStatus.CANCELADO) {
      throw new BadRequestException('Agendamento já está cancelado');
    }

    if (agendamento.status === AgendamentoStatus.CONCLUIDO) {
      throw new BadRequestException(
        'Não é possível cancelar um agendamento concluído',
      );
    }

    agendamento.status = AgendamentoStatus.CANCELADO;
    return this.agendamentosRepository.save(agendamento);
  }

  private async temConflitoHorario(
    equipamentoId: number,
    inicio: Date,
    fim: Date,
  ): Promise<boolean> {
    const count = await this.agendamentosRepository
      .createQueryBuilder('a')
      .where('a.equipamento_id = :equipamentoId', { equipamentoId })
      .andWhere('a.status = :status', { status: AgendamentoStatus.CONFIRMADO })
      .andWhere('a.data_hora_inicio < :fim', { fim })
      .andWhere('a.data_hora_fim > :inicio', { inicio })
      .getCount();

    return count > 0;
  }
}
