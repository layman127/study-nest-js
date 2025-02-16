import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { CreateUserDto } from '../user/dto/create.user.dto';
import { AuthService } from './auth.provider';
import { CredentialsUserDto, LoginResponseDto } from './dto/login.auth.dto';
import { RegisterResponseDto } from './dto/register.auth.dto';

@Controller('auth')
export class AuthController {
  private authService: AuthService;
  constructor(authProvider: AuthService) {
    this.authService = authProvider;
  }
  @Post('register')
  async registerUser(@Body() dto: CreateUserDto): Promise<RegisterResponseDto> {
    return await this.authService.register(dto);
  }
  @Post('login')
  @HttpCode(200)
  async login(
    @Body() сredentials: CredentialsUserDto,
  ): Promise<LoginResponseDto> {
    return await this.authService.login(сredentials);
  }
}
