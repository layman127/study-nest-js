import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserModel } from '../../user/user.model';
type UserPropertiesFromToken = Pick<UserModel, 'role' | '_id'>;
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  readonly configService: ConfigService;
  constructor(configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.getOrThrow<string>('JWT_SECRET'),
    });
    this.configService = configService;
  }
  async validate({ _id, role }: UserPropertiesFromToken) {
    return { _id, role };
  }
}
