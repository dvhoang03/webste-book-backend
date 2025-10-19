import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiTagAndBearer } from '@/base/swagger/swagger.decorator';
import { AdminAuthorService } from '@/modules/ecommerce/service/admin-author.service';
import { ApiOperation } from '@nestjs/swagger';
import {
  AuthorListDto,
  CreateAuthorDto,
  UpdateAuthorDto,
} from '@/modules/ecommerce/dto/author.dto';
import { UserAuth } from '@/modules/auth/auth.decorator';
import { User } from '@/modules/entity';
import { PostgresIdParam } from '@/base/dto/base.dto';

@ApiTagAndBearer('Admin/ Author')
@Controller('admin/author')
export class AdminAuthorController {
  constructor(private readonly adminAuthorService: AdminAuthorService) {}

  @ApiOperation({ summary: 'api list danh sach author' })
  @Get()
  async list(@Query() query: AuthorListDto) {
    return await this.adminAuthorService.list(query);
  }
  @Get(':id')
  @ApiOperation({ summary: 'api lấy thông tin author' })
  async getDetail(@Param() params: PostgresIdParam) {
    return await this.adminAuthorService.getOne(params);
  }

  @ApiOperation({ summary: 'api tao author' })
  @Post()
  async create(@UserAuth() user: User, @Body() dto: CreateAuthorDto) {
    return await this.adminAuthorService.create(dto);
  }

  @ApiOperation({ summary: 'api update author' })
  @Patch()
  async update(@Param() param: PostgresIdParam, @Body() dto: UpdateAuthorDto) {
    return await this.adminAuthorService.update(param.id, dto);
  }
}
