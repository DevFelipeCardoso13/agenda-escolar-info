import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Put,
  UseGuards,
} from '@nestjs/common';
import { Roles } from '../common/decorators/roles.decorator';
import { UserTipo } from '../common/enums/user-tipo.enum';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { UpdateEquipamentoDto } from './dto/update-equipamento.dto';
import { EquipamentosService } from './equipamentos.service';

@Controller('equipamentos')
@UseGuards(JwtAuthGuard, RolesGuard)
export class EquipamentosController {
  constructor(private readonly equipamentosService: EquipamentosService) {}

  @Get()
  findAll() {
    return this.equipamentosService.findAllDisponiveis();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.equipamentosService.findOne(id);
  }

  @Put(':id')
  @Roles(UserTipo.COORDENACAO, UserTipo.ADMIN)
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: UpdateEquipamentoDto,
  ) {
    return this.equipamentosService.update(id, updateDto);
  }
}
