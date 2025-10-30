import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiTagAndBearer } from '@/base/swagger/swagger.decorator';
import { SkipAuth, UserAuth } from '@/modules/auth/auth.decorator';
import { JwtUserGuard } from '@/modules/auth/jwt-user/jwt-user.guard';
import { UserReturnRequestService } from '@/modules/ecommerce/service/user-return-request.service';
import { User } from '@/modules/entity';
import { UserReturnRequestDto } from '@/modules/ecommerce/dto/user-return-request.dto';

@ApiTagAndBearer('User/ Return ')
@SkipAuth()
@UseGuards(JwtUserGuard)
@Controller('return-request')
export class UserReturnRequestController {
  constructor(private readonly userReturnRequest: UserReturnRequestService) {}

  @Post()
  async createReturn(
    @UserAuth() user: User,
    @Body() dto: UserReturnRequestDto,
  ) {
    return await this.userReturnRequest.createReturnRequest(user, dto);
  }
}
