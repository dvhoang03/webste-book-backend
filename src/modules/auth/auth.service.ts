// auth/auth.service.ts
import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Response, Request } from 'express';
import { config } from '@/config';
import { User } from '@/modules/entity';
import { RedisService } from '@/base/database/redis/redis.service';
import * as bcrypt from 'bcrypt';
import { RegisterDto, SendOptDto } from '@/modules/auth/auth.dto';
import { MailService } from '@/base/mail/mail.service';
import { otp1, otp6 } from '@/base/util';

const REFRESH_COOKIE = 'rt';

function getCacheKeyRefreshToken(userId: string) {
  return `account:${userId}`;
}

function getCacheKeyOtpMail(email: string) {
  return `otp:${email}`;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly jwt: JwtService,
    @InjectRepository(User) private readonly users: Repository<User>,
    private readonly redisService: RedisService,
    private readonly mailService: MailService,
  ) {}

  private accessTtl = config.JWT.EXPIRES;
  private refreshTtlMs = config.JWT.REFRESH_EXPIRES; // 30 ngày

  private cookieOpts = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    path: '/',
    maxAge: 1000 * 60 * 60 * 24 * 30,
  };

  async sendOtp(dto: SendOptDto) {
    await this.redisService.delCache(getCacheKeyOtpMail(dto.email));
    const otp = otp1();
    await this.mailService.send(dto.email, otp);
    await this.redisService.setParse(
      getCacheKeyOtpMail(dto.email),
      otp,
      1000 * 60 * 10,
    );
    return {
      expire: 1000 * 60 * 10,
    };
  }

  async register(dto: RegisterDto, res: Response) {
    const otp = await this.redisService.getParse(getCacheKeyOtpMail(dto.email));
    if (!otp || otp !== dto.otp) {
      throw new BadRequestException('opt expire or wrong');
    }
    dto.password = await bcrypt.hash(dto.password, 10);
    const user = await this.users.save(dto);
    await this.redisService.delCache(getCacheKeyOtpMail(dto.email));
    return await this.loginUser(user, res);
  }

  async loginUser(user: User, res: Response) {
    const accessToken = await this.jwt.signAsync(
      { sub: user.id, email: user.email, role: user.role, typ: 'access' },
      { expiresIn: this.accessTtl, secret: config.JWT.SECRET },
    );

    const refreshToken = await this.jwt.signAsync(
      { sub: user.id, typ: 'refresh' }, // payload tối giản
      { expiresIn: '30d', secret: config.JWT.REFRESH_SECRET },
    );
    await this.redisService.setParse(
      getCacheKeyRefreshToken(user.id),
      await bcrypt.hash(refreshToken, 10),
      1000 * 60 * 60 * 24 * 30,
    );
    res.cookie(REFRESH_COOKIE, refreshToken, this.cookieOpts);
    const { password, ...result } = user;
    return { ...result, accessToken, refreshToken };
  }

  async refresh(req: Request, res: Response) {
    const incoming: string =
      req.cookies?.[REFRESH_COOKIE] || req.get('x-refresh-token');
    if (!incoming) throw new BadRequestException('Missing refresh token');

    // verify chữ ký + hạn của refresh JWT
    let payload: any;
    try {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      payload = await this.jwt.verifyAsync(incoming, {
        secret: config.JWT.REFRESH_SECRET,
      });
      if (payload.typ !== 'refresh') throw new UnauthorizedException();
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const user = await this.users.findOne({ where: { id: payload.sub } });

    if (!user) throw new UnauthorizedException('No session');
    const refreshTokenCache = await this.redisService.getParse(
      getCacheKeyRefreshToken(user.id),
    );
    BadRequestException;
    const refreshTokenHashed = await bcrypt.hash(incoming, 10);
    if (refreshTokenCache !== refreshTokenHashed) {
      throw new UnauthorizedException('Refresh token not match or expired');
    }

    // cấp access token mới (giữ nguyên refresh token)
    const accessToken = await this.jwt.signAsync(
      { sub: user.id, email: user.email, role: user.role, typ: 'access' },
      { expiresIn: config.JWT.EXPIRES, secret: config.JWT.SECRET },
    );

    // tùy chọn: gia hạn cookie (nếu muốn sliding window)
    res.cookie(REFRESH_COOKIE, incoming, this.cookieOpts);
    return { accessToken };
  }

  async logout(userId: string, res: Response) {
    await this.redisService.delCache(getCacheKeyRefreshToken(userId));
    res.clearCookie(REFRESH_COOKIE, { path: '/' });
    return { success: true };
  }
}
