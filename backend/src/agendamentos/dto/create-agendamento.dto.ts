import {
  IsDateString,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class CreateAgendamentoDto {
  @IsInt()
  @Min(1)
  equipamento_id: number;

  @IsInt()
  @Min(1)
  quantidade: number;

  @IsDateString()
  data_hora_inicio: string;

  @IsDateString()
  data_hora_fim: string;

  @IsOptional()
  @IsString()
  observacao?: string;
}
