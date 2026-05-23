import { IsDateString, IsInt, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class FilterAgendamentoDto {
  @IsOptional()
  @IsDateString()
  data?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  equipamento_id?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  professor_id?: number;
}
