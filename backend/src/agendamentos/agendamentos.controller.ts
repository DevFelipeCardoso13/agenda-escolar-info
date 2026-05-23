import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Roles } from '../common/decorators/roles.decorator';
import { UserTipo } from '../common/enums/user-tipo.enum';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { JwtPayload } from '../auth/interfaces/jwt-payload.interface';
import { AgendamentosService } from './agendamentos.service';
import { CreateAgendamentoDto } from './dto/create-agendamento.dto';
import { FilterAgendamentoDto } from './dto/filter-agendamento.dto';

@Controller('agendamentos')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AgendamentosController {
  constructor(private readonly agendamentosService: AgendamentosService) {}

  @Get('meus')
  findMeus(@CurrentUser() user: JwtPayload) {
    return this.agendamentosService.findMeus(user.sub);
  }

  @Post()
  @Roles(UserTipo.PROFESSOR, UserTipo.COORDENACAO, UserTipo.ADMIN)
  create(
    @CurrentUser() user: JwtPayload,
    @Body() createDto: CreateAgendamentoDto,
  ) {
    return this.agendamentosService.create(user.sub, createDto);
  }

  @Get()
  @Roles(UserTipo.COORDENACAO, UserTipo.ADMIN)
  findAll(@Query() filters: FilterAgendamentoDto) {
    return this.agendamentosService.findAll(filters);
  }

  @Put(':id/cancelar')
  cancelar(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.agendamentosService.cancelar(id, user.sub, user.tipo);
  }
}
