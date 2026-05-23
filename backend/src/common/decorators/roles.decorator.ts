import { SetMetadata } from '@nestjs/common';
import { UserTipo } from '../enums/user-tipo.enum';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: UserTipo[]) => SetMetadata(ROLES_KEY, roles);
