// src/modules/users/user.controller.ts
import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Param,
  Patch,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { BaseListDto } from '@/base/service/base-list.dto';
import { AdminUserService } from '@/modules/ecommerce/service/admin-user.service';
import { ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { ApiTagAndBearer } from '@/base/swagger/swagger.decorator';
import { SkipAuth } from '@/modules/auth/auth.decorator';
import { JwtUserGuard } from '@/modules/auth/jwt-user/jwt-user.guard';
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
    const user = await this.service.getOne(params);
    return user;
  }

  @ApiOperation({ summary: 'api sửa user' })
  @Patch(':id')
  async update(@Param() params: PostgresIdParam, @Body() dto: UpdateUserDto) {
    console.log({ ...dto });
    return this.service.update(params.id, dto);
  }
}
