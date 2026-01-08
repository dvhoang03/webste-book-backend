// src/auth/auth.controller.ts
import { Body, Controller, Post, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import {
  ApiBearerAuth,
  ApiBody,
  ApiCookieAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import {
  AccessTokenResponseDto,
  LoginDto,
  RegisterDto,
  SendOptDto,
  SuccessDto,
} from '@/modules/auth/auth.dto';
import { SkipAuth, UserAuth } from '@/modules/auth/auth.decorator';
import { AdminUserService } from '@/modules/ecommerce/service/admin-user.service';
import { UserService } from '@/modules/user/user.service';

@SkipAuth()
@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly auth: AuthService,
    private readonly userService: UserService,
  ) {}

  @ApiOperation({ summary: 'lay ma otp gui ve mail' })
  @Post('otp')
  async sendOpt(@Body() dto: SendOptDto) {
    return await this.auth.sendOtp(dto);
  }

  @ApiOperation({ summary: 'Dang ki tai khoan' })
  @Post('register')
  async register(@Body() dto: RegisterDto, @Res() res: Response) {
    const data = await this.auth.register(dto, res);
    return res.json(data); // <--- thêm dòng này
  }

  @ApiOperation({
    summary: 'User login (trả access token, set cookie refresh token)',
  })
  @ApiBody({ type: LoginDto })
  @ApiOkResponse({ type: AccessTokenResponseDto })
  @Post('user/login')
  async userLogin(
    @Body() dto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<AccessTokenResponseDto> {
    // TODO: tự bạn validate credential & lấy user từ DB
    const user = await this.userService.validateUser(dto.email, dto.password);
    return this.auth.loginUser(user, res);
  }

  @ApiOperation({
    summary: 'Refresh access token bằng refresh token (cookie hoặc header)',
  })
  @ApiOkResponse({ type: AccessTokenResponseDto })
  @ApiCookieAuth('rt') // cookie name: rt
  @Post('user/refresh')
  async userRefresh(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): Promise<AccessTokenResponseDto> {
    return this.auth.refresh(req, res);
  }

  @ApiOperation({
    summary: 'Đăng xuất (xóa refresh token server-side, clear cookie)',
  })
  @ApiOkResponse({ type: SuccessDto })
  @ApiBearerAuth() // cần access token (Bear
  @Post('user/logout')
  async userLogout(
    @Req() req: any,
    @Res({ passthrough: true }) res: Response,
  ): Promise<SuccessDto> {
    const userId: string = req.user.sub; // lấy từ access token payload
    return this.auth.logout(userId, res);
  }
}
