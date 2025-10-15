import { Controller, Get, Query } from '@nestjs/common';
import { ApiTagAndBearer } from '@/base/swagger/swagger.decorator';
import { AdminAuthorService } from '@/modules/ecommerce/service/admin-author.service';

@ApiTagAndBearer('Admin/ Author')
@Controller('admin/author')
export class AdminAuthorController {
  constructor(private readonly adminAuthorService: AdminAuthorService) {}

  @Get()
  async list() {}
}
