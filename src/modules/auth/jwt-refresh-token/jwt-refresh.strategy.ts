import { Request } from 'express';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { config } from '@/config';
import { JwtPayload } from '@/modules/auth/auth.interface';
import { UserService } from '@/modules/user/user.service';

function extractRefreshToken(req: Request): string | null {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const cookie = req?.cookies?.['refresh_token'];
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  if (cookie) return cookie;
  const header = req.get('x-refresh-token');
  if (header) return header;
  return null;
}

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor(private readonly userService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.JWT.REFRESH_SECRET,
      passReqToCallback: true,
    });
  }
  async validate(req: Request, payload: JwtPayload) {
    const refreshToken = extractRefreshToken(req);

    if (!refreshToken) {
      throw new UnauthorizedException('No refresh token');
    }
    return await this.userService.findOneID(payload.sub);
  }
}
