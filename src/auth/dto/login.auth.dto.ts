import { IsEmail, IsString } from 'class-validator';

export class CredentialsUserDto {
  @IsString()
  @IsEmail()
  login: string;
  @IsString()
  password: string;
}
