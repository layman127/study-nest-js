import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserModel } from '../../user/user.model';
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  readonly configService: ConfigService;
  constructor(configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get<string>('JWT_SECRET') as string,
    });
    this.configService = configService;
  }
  async validate({ _id, role }: Pick<UserModel, 'role' | '_id'>) {
    return { _id, role };
  }
}
