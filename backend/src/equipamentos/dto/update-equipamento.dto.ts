import { IsEnum, IsInt, IsOptional, IsString, Min } from 'class-validator';
import { EquipamentoStatus } from '../../common/enums/equipamento-status.enum';

export class UpdateEquipamentoDto {
  @IsOptional()
  @IsString()
  nome?: string;

  @IsOptional()
  @IsString()
  tipo?: string;

  @IsOptional()
  @IsString()
  local?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  qtd_total?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  qtd_em_uso?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  qtd_reparo?: number;

  @IsOptional()
  @IsEnum(EquipamentoStatus)
  status?: EquipamentoStatus;
}
