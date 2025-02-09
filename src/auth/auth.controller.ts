import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { CreateUserDto } from '../user/dto/create.user.dto';
import { AuthProvider } from './auth.provider';
import { CredentialsUserDto } from './dto/login.auth.dto';

@Controller('auth')
export class AuthController {
  private authProvider: AuthProvider;
  constructor(authProvider: AuthProvider) {
    this.authProvider = authProvider;
  }
  @Post('register')
  async registerUser(@Body() dto: CreateUserDto) {
    return await this.authProvider.register(dto);
  }
  @Post('login')
  @HttpCode(200)
  async login(@Body() сredentials: CredentialsUserDto) {
    return await this.authProvider.login(сredentials);
  }
}
