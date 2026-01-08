import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { config } from '@/config';
import { JwtPayload } from '@/modules/auth/auth.interface';
import { Role } from '@/modules/user/user.enum';
import { UserService } from '@/modules/user/user.service';

@Injectable()
export class JwtUserStrategy extends PassportStrategy(Strategy, 'jwt-user') {
  constructor(private readonly userService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.JWT.SECRET,
    });
  }

  async validate(payload: JwtPayload) {
    const { role } = payload;
    if (role !== Role.USER) {
      throw new UnauthorizedException('user only');
    }
    return this.userService.findOneID(payload.sub);
  }
}
