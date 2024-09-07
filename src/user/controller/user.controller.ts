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
import {
  ApiOperation,
  ApiTags,
  ApiParam,
  ApiBody,
  ApiResponse,
} from '@nestjs/swagger';

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UsersService) {}

  @Get()
  @ApiOperation({ summary: 'Get all users in the database' })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved all users',
    schema: {
      example: [
        { id: 1, username: 'john', email: 'john@example.com' },
        { id: 2, username: 'jane', email: 'jane@example.com' },
      ],
    },
  })
  public async getAllUsers() {
    return await this.userService.findAll();
  }

  @Post('create')
  @ApiOperation({ summary: 'Create a User in the database' })
  @ApiBody({
    type: UserDto,
    description: 'Details of the user to be created',
  })
  @ApiResponse({
    status: 201,
    description: 'User created successfully',
    schema: {
      example: { id: 3, username: 'newuser', email: 'newuser@example.com' },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request - Validation failed',
  })
  public async createUser(@Body() body: UserDto) {
    return await this.userService.createUser(body);
  }

  @Put('update/:userId')
  @ApiOperation({ summary: 'Update info for this user' }) // Describe la operación
  @ApiParam({
    name: 'userId',
    required: true,
    description: 'ID of the user to be updated',
  })
  @ApiBody({
    type: UserDto,
    description: 'Updated details of the user',
  })
  @ApiResponse({
    status: 200,
    description: 'User updated successfully',
    schema: {
      example: {
        id: 1,
        username: 'updateduser',
        email: 'updateduser@example.com',
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
  })
  public async updateUser(
    @Body() body: UserDto,
    @Param('userId') userId: string,
  ) {
    return await this.userService.updateUser(userId, body);
  }

  @Delete('delete/:userId')
  @ApiOperation({
    summary: 'Delete a user by ID',
    description:
      'Deletes a user from the database by providing their unique ID.',
  })
  @ApiParam({
    name: 'userId',
    required: true,
    description: 'ID of the user to be deleted',
  })
  @ApiResponse({
    status: 200,
    description: 'User deleted successfully',
    schema: {
      example: {
        message: 'User with ID 1 deleted successfully',
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid user ID format',
    schema: {
      example: {
        statusCode: 400,
        message: 'Invalid user ID format',
        error: 'Bad Request',
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
    schema: {
      example: {
        statusCode: 404,
        message: 'User not found',
        error: 'Not Found',
      },
    },
  })
  public async deleteUser(@Param('userId') userId: string) {
    return await this.userService.deleteUser(userId);
  }
}
