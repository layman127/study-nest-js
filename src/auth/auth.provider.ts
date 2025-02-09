import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from '../user/dto/create.user.dto';
import { CredentialsUserDto } from './dto/login.auth.dto';
import { UserProvider } from '../user/user.provider';
import * as argon2 from 'argon2';
import {
  USER_BY_EMAIL_NOT_FOUND_ERROR_MSG,
  WRONG_PASSWORD_MSG,
} from '../user/user.constants';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthProvider {
  private userProvider: UserProvider;
  private jwtService: JwtService;
  constructor(userProvider: UserProvider, jwtService: JwtService) {
    this.userProvider = userProvider;
    this.jwtService = jwtService;
  }
  async register(dto: CreateUserDto) {
    return await this.userProvider.createUser(dto);
  }
  async login(сredentials: CredentialsUserDto) {
    const user = await this.userProvider.findByEmal(сredentials.login);
    if (!user) {
      throw new BadRequestException(USER_BY_EMAIL_NOT_FOUND_ERROR_MSG);
    }
    if (!(await argon2.verify(user.hashedPassword, сredentials.password))) {
      throw new BadRequestException(WRONG_PASSWORD_MSG);
    }
    return {
      ...this.userProvider.getUserWithoutHashedPassword(user),
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
