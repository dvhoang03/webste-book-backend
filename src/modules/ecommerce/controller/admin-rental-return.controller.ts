import { Body, Controller, Get, Param, Patch, Query } from '@nestjs/common';
import { AdminRentalReturnService } from '@/modules/ecommerce/service/admin-rental-return.service';
import { ApiTagAndBearer } from '@/base/swagger/swagger.decorator';
import {
  RentalReturnDto,
  RentalReturnListDto,
  UpdateRentalReturnDto,
} from '@/modules/ecommerce/dto/rental-return.dto';
import { PostgresIdParam } from '@/base/dto/base.dto';
import { RentalItemListDto } from '@/modules/ecommerce/dto/rental-item.dto';
import { AdminRentalItemService } from '@/modules/ecommerce/service/admin-rental-item.service';

@ApiTagAndBearer('Admin/ Rental Return')
@Controller('admin/rental-return')
export class AdminRentalReturnController {
  constructor(
    private readonly service: AdminRentalReturnService,
    private readonly adminRentalItemService: AdminRentalItemService,
  ) {}

  @Get()
  async list(@Query() query: RentalReturnListDto) {
    return await this.service.list(query);
  }

  @Get(':id')
  async getDetail(@Param() param: PostgresIdParam) {
    const rentalReturn = await this.service.getOne(param, ['user', 'o']);
    const rentalItem = await this.adminRentalItemService.listForOrder(
      rentalReturn.orderId,
    );
    return Object.assign(rentalReturn, { rentalItems: rentalItem });
  }

  @Patch(':id')
  async update(
    @Param() param: PostgresIdParam,
    @Body() dto: UpdateRentalReturnDto,
  ) {
    return await this.service.update(param.id, dto);
  }
}
