import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTagAndBearer } from '@/base/swagger/swagger.decorator';
import { SkipAuth, UserAuth } from '@/modules/auth/auth.decorator';
import { JwtUserGuard } from '@/modules/auth/jwt-user/jwt-user.guard';
import { UserCreateRentalReturnDto } from '@/modules/ecommerce/dto/user-rental-request.dto';
import { UserRentalReturnService } from '@/modules/ecommerce/service/user-rental-return.service';
import { User } from '@/modules/entity';
import { ApiOperation } from '@nestjs/swagger';
import { RentalReturnListDto } from '@/modules/ecommerce/dto/rental-return.dto';
import { PostgresIdParam } from '@/base/dto/base.dto';
import { AdminRentalItemService } from '@/modules/ecommerce/service/admin-rental-item.service';
import { AdminRentalReturnService } from '@/modules/ecommerce/service/admin-rental-return.service';

@ApiTagAndBearer('User/ Rental Return')
@SkipAuth()
@UseGuards(JwtUserGuard)
@Controller('rental-return')
export class UserRentalReturnController {
  constructor(
    private readonly service: UserRentalReturnService,
    private readonly adminService: AdminRentalReturnService,
    private readonly adminRentalItemService: AdminRentalItemService,
    private readonly adminRentalReturnService: AdminRentalReturnService,
  ) {}

  @Get()
  async list(@Query() query: RentalReturnListDto, @UserAuth() user: User) {
    query.filter = Object.assign({}, query.filter, { userId: user.id });
    return await this.adminService.list(query);
  }

  @Get(':id')
  async getDetail(@Param() param: PostgresIdParam) {
    const rentalReturn = await this.adminService.getOne(param, ['user']);
    const rentalItem = await this.adminRentalItemService.listForOrder(
      rentalReturn.orderId,
    );
    return Object.assign(rentalReturn, { rentalItems: rentalItem });
  }

  @ApiOperation({
    summary: 'User tao rental return de tra sach da thue torng 1 order',
  })
  @Post()
  async create(@UserAuth() user: User, @Body() dto: UserCreateRentalReturnDto) {
    await this.service.createRentalReturn(user, dto);
  }
}
