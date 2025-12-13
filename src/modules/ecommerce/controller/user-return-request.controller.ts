import {
  Body,
  Controller,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiTagAndBearer } from '@/base/swagger/swagger.decorator';
import { SkipAuth, UserAuth } from '@/modules/auth/auth.decorator';
import { JwtUserGuard } from '@/modules/auth/jwt-user/jwt-user.guard';
import { UserReturnRequestService } from '@/modules/ecommerce/service/user-return-request.service';
import { User } from '@/modules/entity';
import { UserReturnRequestDto } from '@/modules/ecommerce/dto/user-return-request.dto';
import { PostgresIdParam } from '@/base/dto/base.dto';
import { ApiOperation } from '@nestjs/swagger';

@ApiTagAndBearer('User/ Return Book Purchase')
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

  @ApiOperation({ summary: 'api user cap nhat sach da mua de tra hang' })
  @Patch(':id')
  async update(
    @Param() param: PostgresIdParam,
    @UserAuth() user: User,
    @Body() dto: UserReturnRequestDto,
  ) {
    return await this.userReturnRequest.updateReturnRequest(
      param.id,
      user,
      dto,
    );
  }
}
