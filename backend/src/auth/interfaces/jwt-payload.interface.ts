import { UserTipo } from '../../common/enums/user-tipo.enum';

export class JwtPayload {
  sub: number;
  email: string;
  tipo: UserTipo;
}
