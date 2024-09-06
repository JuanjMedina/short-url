export class UserDto {
  username: string;
  email: string;
  phone: string;
  password: string;
}

export class UpdateUserDto {
  username?: string;
  email?: string;
  phone?: string;
  password?: string;
}
