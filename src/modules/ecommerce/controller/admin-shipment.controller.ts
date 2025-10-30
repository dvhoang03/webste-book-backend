import { Body, Controller, Param, Patch, Post } from '@nestjs/common';
import { AdminShippingService } from '@/modules/ecommerce/service/admin-shipping.service';
import { ApiTagAndBearer } from '@/base/swagger/swagger.decorator';
import {
  CreateShippingDto,
  UpdateShippingDto,
} from '@/modules/ecommerce/dto/shipping.dto';
import { ApiOperation } from '@nestjs/swagger';
import { PostgresIdParam } from '@/base/dto/base.dto';

@ApiTagAndBearer('Admin/ Shipping')
@Controller('admin/shipping')
export class AdminShipmentController {
  constructor(private readonly adminShipmentService: AdminShippingService) {}

  @ApiOperation({ summary: 'api admin xasc nhapaj giai hang' })
  @Post()
  async create(@Body() dto: CreateShippingDto) {
    return await this.adminShipmentService.createShipping(dto);
  }

  @ApiOperation({ summary: 'api cap nhat trang thai donw hang' })
  @Patch(':id')
  async update(
    @Param() param: PostgresIdParam,
    @Body() dto: UpdateShippingDto,
  ) {
    return await this.adminShipmentService.update(param.id, dto);
  }
}
