import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Agendamento } from '../entities/agendamento.entity';
import { EquipamentosModule } from '../equipamentos/equipamentos.module';
import { AgendamentosController } from './agendamentos.controller';
import { AgendamentosService } from './agendamentos.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Agendamento]),
    EquipamentosModule,
  ],
  controllers: [AgendamentosController],
  providers: [AgendamentosService],
})
export class AgendamentosModule {}
