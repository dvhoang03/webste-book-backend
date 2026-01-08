import { Controller } from '@nestjs/common';
import { ApiTagAndBearer } from '@/base/swagger/swagger.decorator';

@ApiTagAndBearer('Admin/ Shipment')
@Controller('admin-shipment')
export class AdminCreateShipmentController {}
