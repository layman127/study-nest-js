import { IsEmail, IsEnum, IsString } from 'class-validator';
import { WRONG_USER_ROLE_MSG } from '../user.constants';

export class CreateUserDto {
  @IsString()
  username: string;
  @IsString()
  @IsEmail()
  email: string;
  @IsString()
  password: string;
  @IsString()
  telephone: string;
  @IsEnum(['admin', 'user'], { message: WRONG_USER_ROLE_MSG })
  role: 'admin' | 'user';
}
