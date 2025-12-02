// src/modules/users/analysis.controller.ts
import { Body, Controller, Get, Param, Patch, Query } from '@nestjs/common';
import { AdminUserService } from '@/modules/ecommerce/service/admin-user.service';
import { ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { ApiTagAndBearer } from '@/base/swagger/swagger.decorator';
import {
  CreateUserDto,
  UpdateUserDto,
  UserListDto,
} from '@/modules/ecommerce/dto/user.dto';
import { PostgresIdParam } from '@/base/dto/base.dto';
import { User } from '@/modules/entity';

@ApiTagAndBearer('Admin/ User')
@Controller('admin/users')
export class AdminUserController {
  constructor(private readonly service: AdminUserService) {}

  @Get('list')
  @ApiOkResponse({
    description: 'Danh sách người dùng (có phân trang, sort, search, filter).',
  })
  async list(@Query() dto: UserListDto) {
    return this.service.list(dto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'api lấy thông tin user' })
  async getDetail(@Param() params: PostgresIdParam) {
    return await this.service.getOne(params);
  }

  @ApiOperation({ summary: 'api sửa user' })
  @Patch(':id')
  async update(@Param() params: PostgresIdParam, @Body() dto: UpdateUserDto) {
    console.log({ ...dto });
    return this.service.update(params.id, dto);
  }
}
