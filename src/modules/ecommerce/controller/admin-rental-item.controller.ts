import { Controller, Get, Query } from '@nestjs/common';
import { ApiTagAndBearer } from '@/base/swagger/swagger.decorator';
import { AdminRentalItemService } from '@/modules/ecommerce/service/admin-rental-item.service';
import { RentalItemListDto } from '@/modules/ecommerce/dto/rental-item.dto';

ApiTagAndBearer('Admin/ Rental Return');
@Controller('admin/rental-return')
export class AdminRentalItemController {
  constructor(private readonly service: AdminRentalItemService) {}

  @Get('rental-item')
  async listRentalItem(@Query() query: RentalItemListDto) {
    return await this.service.list(query);
  }
}
