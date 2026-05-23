import {
  IsDateString,
  IsInt,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';

export class CreateAgendamentoDto {
  @IsInt({
    message: 'Selecione um equipamento válido',
  })
  @Min(1, {
    message: 'Equipamento inválido',
  })
  equipamento_id: number;

  @IsInt({
    message: 'Quantidade inválida',
  })
  @Min(1, {
    message: 'Quantidade mínima é 1',
  })
  @Max(50, {
    message: 'Quantidade máxima é 50',
  })
  quantidade: number;

  @IsDateString(
    {},
    {
      message: 'Data de início inválida',
    },
  )
  data_hora_inicio: string;

  @IsDateString(
    {},
    {
      message: 'Data de fim inválida',
    },
  )
  data_hora_fim: string;

  @IsOptional()
  @IsString({
    message: 'Observação inválida',
  })
  observacao?: string;
}