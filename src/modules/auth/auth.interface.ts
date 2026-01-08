import { Role } from '@/modules/user/user.enum';

export interface JwtPayload {
  sub: string;
  email: string;
  role: Role;
}
