import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { config } from '@/config';
import { JwtPayload } from '@/modules/auth/auth.interface';
import { Role } from '@/modules/user/user.enum';
import { UserService } from '@/modules/user/user.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private readonly userService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.JWT.SECRET,
    });
  }

  // Kết quả trả về của ham fnyaf sẽ được gắn vào req.user
  async validate(payload: JwtPayload) {
    const { role } = payload;
    const allowed = role === Role.ADMIN || role === Role.STAFF;
    if (!allowed) throw new UnauthorizedException('admin/staff only');
    return await this.userService.findOneID(payload.sub);
  }
}
