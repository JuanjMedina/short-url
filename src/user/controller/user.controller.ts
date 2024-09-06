import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { UserDto } from '../dto/user.dto';
import { UsersService } from '../service/user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UsersService) {}
  @Get()
  public async getAllUsers() {
    return await this.userService.findAll();
  }

  @Post('create')
  public async createUser(@Body() body: UserDto) {
    return await this.userService.createUser(body);
  }

  @Put('update/:userId')
  public async updateUser(
    @Body() body: UserDto,
    @Param('userId') userId: string,
  ) {
    return await this.userService.updateUser(userId, body);
  }

  @Delete('delete/:userId')
  public async deleteUser(@Param('userId') userId: string) {
    return await this.userService.deleteUser(userId);
  }
}
