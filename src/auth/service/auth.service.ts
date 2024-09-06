import { User } from '@/user/model/user.model';
import { UsersService } from '@/user/service/user.service';
import { ErrorManager } from '@/utils/error.manager';
import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { PayloadToken } from '../interfaces/auth.interfaces';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UsersService) {}

  public async validateUser(username, password) {
    try {
      const userByUsername = await this.userService.searchBy({
        key: 'username',
        value: username,
      });

      const userByEmail = await this.userService.searchBy({
        key: 'email',
        value: username,
      });

      if (userByUsername) {
        const match = await bcrypt.compare(password, userByUsername.password);
        if (match) return userByUsername;
      }

      if (userByEmail) {
        const match = await bcrypt.compare(password, userByEmail.password);
        if (match) return userByEmail;
      }

      if (!userByUsername || !userByEmail) {
        throw new ErrorManager({
          message: 'Invalid credentials ',
          type: 'NOT_FOUND',
        });
      }
    } catch (Err) {
      throw ErrorManager.createSignatureError(Err.message);
    }
  }

  public async signJWT({
    payload,
    secret,
    expired,
  }: {
    payload: jwt.JwtPayload;
    secret: string;
    expired: number | string;
  }): Promise<string> {
    return jwt.sign(payload, secret, { expiresIn: expired });
  }

  public async generateJWT(user: User) {
    const payload: PayloadToken = {
      role: user.role,
      sub: user._id,
    };

    const accessToken = await this.signJWT({
      payload,
      secret: 'secret',
      expired: '1h',
    });
    return {
      AccessToken: accessToken,
    };
  }
}
