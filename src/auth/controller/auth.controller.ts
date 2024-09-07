import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from '../service/auth.service';
import { AuthDto } from '../dto/auth.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { Request } from 'express';
import { AuthGuard } from '../guards/auth.guard';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ApiOperation({ summary: 'User login' })
  @ApiBody({
    type: AuthDto,
    description: 'Username and password required for login',
  })
  @ApiResponse({
    status: 200,
    description: 'JWT Token generated successfully',
    schema: {
      example: {
        AccessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  async login(@Body() { username, password }: AuthDto) {
    const userValidate = await this.authService.validateUser(
      username,
      password,
    );
    const jwt = await this.authService.generateJWT(userValidate);
    return jwt;
  }

  @UseGuards(AuthGuard)
  @Get('refreshtoken')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Refresh JWT Token' })
  @ApiResponse({
    status: 200,
    description: 'new JWT refresh generate sucefully ',
    schema: {
      example: {
        RefreshToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
      },
    },
  })
  async updateJWT(@Req() res: Request) {
    const { idUser, roleUser } = res;
    const newJWT = await this.authService.refreshToken(idUser, roleUser);
    return newJWT;
  }
}
