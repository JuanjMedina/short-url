import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AuthDto {
  @ApiProperty({
    example: 'user123',
  })
  @IsString()
  username: string;

  @ApiProperty({
    example: 'mypassword123',
    description: 'The password of the user',
  })
  @IsString()
  password: string;
}
