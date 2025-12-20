import { ApiTagAndBearer } from '@/base/swagger/swagger.decorator';
import { AdminPolicyService } from '@/modules/ecommerce/service/admin-policy.service';
import { Body, Controller, Get, Param, Post, Put, Query } from '@nestjs/common';
import {
  CreatePolicyDto,
  PolicyListDto,
  UpdatePolicyDto,
} from '@/modules/ecommerce/dto/policy.dto';
import { PostgresIdParam } from '@/base/dto/base.dto';

@ApiTagAndBearer('Admin/ Policy')
@Controller('admin/policy')
export class AdminPolicyController {
  constructor(private service: AdminPolicyService) {}

  @Get()
  async list(@Query() query: PolicyListDto) {
    return await this.service.list(query);
  }

  @Post()
  async create(@Body() createPolicyDto: CreatePolicyDto) {
    return await this.service.createPolicy(createPolicyDto);
  }

  @Put()
  async update(
    @Param() param: PostgresIdParam,
    @Body() updatePolicyDto: UpdatePolicyDto,
  ) {
    return await this.service.updatePolicy(param.id, updatePolicyDto);
  }
}
