import { Body, Controller, Param, Post, UseGuards } from '@nestjs/common';
import { ApiTagAndBearer } from '@/base/swagger/swagger.decorator';
import { SkipAuth, UserAuth } from '@/modules/auth/auth.decorator';
import { JwtUserGuard } from '@/modules/auth/jwt-user/jwt-user.guard';
import { UserReturnRequestService } from '@/modules/ecommerce/service/user-return-request.service';
import { User } from '@/modules/entity';
import { UserReturnRequestDto } from '@/modules/ecommerce/dto/user-return-request.dto';
import { ApiOperation } from '@nestjs/swagger';
import { UpdateReturnRequestDto } from '@/modules/ecommerce/dto/return-request.dto';
import { PostgresIdParam } from '@/base/dto/base.dto';

@ApiTagAndBearer('Amin/ Return Request')
@Controller('return-request')
export class AdminReturnRequestController {
  constructor(private readonly userReturnRequest: UserReturnRequestService) {}

  @ApiOperation({ summary: 'api de admin capj nhat, xac nhan tra hang' })
  @Post()
  async update(
    @Param() param: PostgresIdParam,
    @Body() dto: UpdateReturnRequestDto,
  ) {
    return await this.userReturnRequest.update(param.id, dto);
  }
}
