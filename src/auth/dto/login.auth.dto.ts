import { IsEmail, IsString } from 'class-validator';
import { RegisterResponseDto } from './register.auth.dto';

export class CredentialsUserDto {
  @IsString()
  @IsEmail()
  login: string;
  @IsString()
  password: string;
}
export class LoginResponseDto implements RegisterResponseDto {
  username: string;
  email: string;
  role: 'admin' | 'user';
  access_token: string;
  telephone: string;
}
