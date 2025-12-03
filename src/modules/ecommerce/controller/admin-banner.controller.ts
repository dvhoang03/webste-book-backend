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
import { BannerService } from '@/modules/ecommerce/service/banner.service';
import { PostgresIdParam } from '@/base/dto/base.dto';
import {
  BannerListDto,
  CreateBannerDto,
  UpdateBannerDto,
} from '@/modules/ecommerce/dto/banner.dto';
import { ApiTags } from '@nestjs/swagger';
import { SkipAuth } from '@/modules/auth/auth.decorator';

@ApiTags('Banner')
@SkipAuth()
@Controller('admin-banner')
export class AdminBannerController {
  constructor(private readonly service: BannerService) {}

  @Get()
  async list(@Query() query: BannerListDto) {
    return await this.service.list(query);
  }

  @Get(':id')
  async getDetail(@Param() param: PostgresIdParam) {
    return await this.service.getOne({ id: param.id });
  }

  @Post()
  async create(@Body() dto: CreateBannerDto) {
    return await this.service.create(dto);
  }

  @Patch(':id')
  async update(@Param() param: PostgresIdParam, @Body() dto: UpdateBannerDto) {
    return await this.service.update(param.id, dto);
  }

  @Delete(':id')
  async delete(@Param() param: PostgresIdParam) {
    return await this.service.remove(param.id);
  }
}
