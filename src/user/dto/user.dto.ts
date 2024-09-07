import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';

export class UserDto {
  @ApiProperty({
    type: String,
    example: 'user123',
    description: 'The username of the user',
  })
  @IsString()
  username: string;

  @ApiProperty({
    type: String,
    example: 'user@example.com',
    description: 'The email address of the user',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    type: String,
    example: '+123456789',
    description: 'The phone number of the user',
  })
  @IsString()
  phone: string;

  @ApiProperty({
    type: String,
    example: 'password123',
    description: 'The password of the user',
  })
  @IsString()
  password: string;
}

export class UpdateUserDto {
  @ApiPropertyOptional({
    type: String,
    example: 'updateduser123',
    description: 'The updated username of the user',
  })
  @IsString()
  username?: string;

  @ApiPropertyOptional({
    type: String,
    example: 'updateduser@example.com',
    description: 'The updated email address of the user',
  })
  @IsEmail()
  email?: string;

  @ApiPropertyOptional({
    type: String,
    example: '+987654321',
    description: 'The updated phone number of the user',
  })
  @IsString()
  phone?: string;

  @ApiPropertyOptional({
    type: String,
    example: 'newpassword123',
    description: 'The updated password of the user',
  })
  @IsString()
  password?: string;
}
