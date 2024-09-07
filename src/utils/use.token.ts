import { AuthTokenResult, IUseToken } from '@/auth/interfaces/auth.interfaces';
import * as jwt from 'jsonwebtoken';
export const useToken = (token: string): IUseToken => {
  try {
    const decode = jwt.decode(token) as unknown as AuthTokenResult;
    const currentDate = new Date();
    const expiredDate = new Date(decode.exp);
    const exExpired = Number(expiredDate) <= Number(currentDate) / 1000;
    return { exExpired, sub: decode.sub, role: decode.role };
  } catch (Err) {}
};
