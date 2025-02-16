import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from '../user/dto/create.user.dto';
import { CredentialsUserDto, LoginResponseDto } from './dto/login.auth.dto';
import { UserService } from '../user/user.provider';
import * as argon2 from 'argon2';
import {
  USER_BY_EMAIL_NOT_FOUND_ERROR_MSG,
  WRONG_PASSWORD_MSG,
} from '../user/user.constants';
import { JwtService } from '@nestjs/jwt';
import { RegisterResponseDto } from './dto/register.auth.dto';

@Injectable()
export class AuthService {
  private userService: UserService;
  private jwtService: JwtService;
  constructor(userProvider: UserService, jwtService: JwtService) {
    this.userService = userProvider;
    this.jwtService = jwtService;
  }
  async register(dto: CreateUserDto): Promise<RegisterResponseDto> {
    return await this.userService.createUser(dto);
  }
  async login(сredentials: CredentialsUserDto): Promise<LoginResponseDto> {
    const user = await this.userService.findByEmal(сredentials.login);
    if (!user) {
      throw new BadRequestException(USER_BY_EMAIL_NOT_FOUND_ERROR_MSG);
    }
    const isVerifyUser = await argon2.verify(
      user.hashedPassword,
      сredentials.password,
    );
    if (!isVerifyUser) {
      throw new BadRequestException(WRONG_PASSWORD_MSG);
    }
    const userWithoutPassword =
      this.userService.getUserWithoutHashedPassword(user);

    return {
      ...userWithoutPassword,
      access_token: await this.jwtService.signAsync(
        {
          _id: user.id,
          email: user.email,
          role: user.role,
        },
        { expiresIn: '7d' },
      ),
    };
  }
}
