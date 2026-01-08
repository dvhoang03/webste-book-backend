import { Controller, Get, Query } from '@nestjs/common';
import { ApiTagAndBearer } from '@/base/swagger/swagger.decorator';
import { AdminRentalItemService } from '@/modules/ecommerce/service/admin-rental-item.service';
import { RentalItemListDto } from '@/modules/ecommerce/dto/rental-item.dto';

@ApiTagAndBearer('Admin/ Rental Item')
@Controller('admin/rental-item')
export class AdminRentalItemController {
  constructor(private readonly service: AdminRentalItemService) {}

  @Get()
  async listRentalItem(@Query() query: RentalItemListDto) {
    return await this.service.list(query);
  }
}
