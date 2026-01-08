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
import { AdminPublisherService } from '@/modules/ecommerce/service/admin-publisher.service';
import {
  CreatePublisherDto,
  PublisherListDto,
  UpdatePublisherDto,
} from '@/modules/ecommerce/dto/publisher.dto';
import { ApiOperation } from '@nestjs/swagger';
import { PostgresIdParam } from '@/base/dto/base.dto';
import { SkipAuth } from '@/modules/auth/auth.decorator';
import { ApiTagAndBearer } from '@/base/swagger/swagger.decorator';

@ApiTagAndBearer('Admin/ Publisher')
@Controller('admin/publisher')
export class AdminPublisherController {
  constructor(private readonly adminPublisherService: AdminPublisherService) {}

  @SkipAuth()
  @ApiOperation({ summary: 'api liet ke publisher' })
  @Get()
  async list(@Query() query: PublisherListDto) {
    return await this.adminPublisherService.list(query);
  }

  @SkipAuth()
  @Get(':id')
  @ApiOperation({ summary: 'api lấy thông tin publisher' })
  async getDetail(@Param() params: PostgresIdParam) {
    return await this.adminPublisherService.getOne(params);
  }

  @ApiOperation({ summary: 'api tao publisher' })
  @Post()
  async create(@Body() dto: CreatePublisherDto) {
    return this.adminPublisherService.create(dto);
  }

  @ApiOperation({ summary: 'api update publisher' })
  @Patch(':id')
  async update(
    @Param() params: PostgresIdParam,
    @Body() dto: UpdatePublisherDto,
  ) {
    await this.adminPublisherService.getOne({
      id: params.id,
    });
    return await this.adminPublisherService.update(params.id, dto);
  }

  @ApiOperation({ summary: 'api xoa publisher' })
  @Delete(':id')
  async delete(@Param() params: PostgresIdParam) {
    await this.adminPublisherService.getOne({
      id: params.id,
    });
    return await this.adminPublisherService.remove(params.id);
  }
}
