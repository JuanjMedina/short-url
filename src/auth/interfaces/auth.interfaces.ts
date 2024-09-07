import { ROLES } from '@/constants/roles';
import { User } from '@/user/model/user.model';

export interface PayloadToken {
  sub: string;
  role: ROLES;
}

export interface AuthTokenResult {
  sub: string;
  role: string;
  iat: string;
  exp: string;
}

export interface IUseToken {
  role: string;
  sub: string;
  exExpired: boolean;
}

export interface IDeleteUser {
  message: string;
  user: User;
}
