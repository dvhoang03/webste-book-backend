import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiTagAndBearer } from '@/base/swagger/swagger.decorator';
import { SkipAuth, UserAuth } from '@/modules/auth/auth.decorator';
import { JwtUserGuard } from '@/modules/auth/jwt-user/jwt-user.guard';
import { UserCreateRentalReturnDto } from '@/modules/ecommerce/dto/user-rental-request.dto';
import { UserRentalReturnService } from '@/modules/ecommerce/service/user-rental-return.service';
import { User } from '@/modules/entity';
import { ApiOperation } from '@nestjs/swagger';

@ApiTagAndBearer('User/ Rental Return')
@SkipAuth()
@UseGuards(JwtUserGuard)
@Controller('rental-return')
export class UserRentalReturnController {
  constructor(private readonly service: UserRentalReturnService) {}

  @ApiOperation({
    summary: 'User tao rental return de tra sach da thue torng 1 order',
  })
  @Post()
  async create(@UserAuth() user: User, @Body() dto: UserCreateRentalReturnDto) {
    await this.service.createRentalReturn(user, dto);
  }
}
