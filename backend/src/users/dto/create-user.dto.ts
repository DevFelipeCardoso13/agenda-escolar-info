import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { UserTipo } from '../../common/enums/user-tipo.enum';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  nome: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  senha: string;

  @IsEnum(UserTipo)
  tipo: UserTipo;

  @IsOptional()
  @IsString()
  telefone?: string;
}
