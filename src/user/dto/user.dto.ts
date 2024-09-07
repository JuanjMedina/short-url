import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';

export class UserDto {
  @ApiProperty({
    type: String,
    example: 'user123', // Ejemplo del nombre de usuario
    description: 'The username of the user',
  })
  @IsString()
  username: string;

  @ApiProperty({
    type: String,
    example: 'user@example.com', // Ejemplo de correo electrónico
    description: 'The email address of the user',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    type: String,
    example: '+123456789', // Ejemplo de número de teléfono
    description: 'The phone number of the user',
  })
  @IsString()
  phone: string;

  @ApiProperty({
    type: String,
    example: 'password123', // Ejemplo de contraseña
    description: 'The password of the user',
  })
  @IsString()
  password: string;
}

export class UpdateUserDto {
  @ApiPropertyOptional({
    type: String,
    example: 'updateduser123', // Ejemplo de nombre de usuario actualizado
    description: 'The updated username of the user',
  })
  @IsString()
  username?: string;

  @ApiPropertyOptional({
    type: String,
    example: 'updateduser@example.com', // Ejemplo de correo electrónico actualizado
    description: 'The updated email address of the user',
  })
  @IsEmail()
  email?: string;

  @ApiPropertyOptional({
    type: String,
    example: '+987654321', // Ejemplo de número de teléfono actualizado
    description: 'The updated phone number of the user',
  })
  @IsString()
  phone?: string;

  @ApiPropertyOptional({
    type: String,
    example: 'newpassword123', // Ejemplo de nueva contraseña
    description: 'The updated password of the user',
  })
  @IsString()
  password?: string;
}
