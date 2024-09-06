import { ROLES } from '@/constants/roles';

export interface PayloadToken {
  sub: string;
  role: ROLES;
}
