import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { IUseToken } from '../interfaces/auth.interfaces';
import { useToken } from '@/utils/use.token';
import { PUBLIC_KEY } from '@/constants/key.decorator';
import { UsersService } from '@/user/service/user.service';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly userService: UsersService,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const isPublic = this.reflector.get<boolean>(
        PUBLIC_KEY,
        context.getHandler(),
      );
      if (isPublic) return true;

      const req = context.switchToHttp().getRequest<Request>();
      const authorizationHeader = req.headers.authorization;
      if (!authorizationHeader)
        throw new UnauthorizedException('Authorization header is missing');

      const [bearer, token] = authorizationHeader.split(' ');
      if (bearer !== 'Bearer' || !token)
        throw new UnauthorizedException('Invalid Token format');

      const secretKey = 'secret';
      jwt.verify(token, secretKey);

      const manageToken: IUseToken | string = useToken(token);
      if (typeof manageToken === 'string')
        throw new UnauthorizedException(manageToken);

      if (manageToken.exExpired === true)
        throw new UnauthorizedException('Token Expired');

      const { sub } = manageToken;

      const user = await this.userService.findUserById(sub);
      if (!user) throw new UnauthorizedException('Invalid User');

      req.idUser = user._id;
      req.roleUser = user.role;
      return true;
    } catch (err) {
      if (err.name === 'TokenExpiredError') {
        throw new UnauthorizedException('Token has expired');
      }
      if (err.name === 'JsonWebTokenError') {
        throw new UnauthorizedException('Invalid Token');
      }
      throw new UnauthorizedException('Unauthorized');
    }
  }
}
