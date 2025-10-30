import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiTagAndBearer } from '@/base/swagger/swagger.decorator';
import { AdminCategoryService } from '@/modules/ecommerce/service/admin-category.service';
import {
  CreateCategoryDto,
  ListCategoryDto,
  UpdateCategoryDto,
} from '@/modules/ecommerce/dto/category.dto';
import { PostgresIdParam } from '@/base/dto/base.dto';

@ApiTagAndBearer('Admin/ Category')
@Controller('admin/category')
export class AdminCategoryController {
  constructor(private readonly adminCategoryService: AdminCategoryService) {}

  @Get()
  async list(@Query() query: ListCategoryDto) {
    return await this.adminCategoryService.list(query);
  }

  @Post()
  async create(@Body() dto: CreateCategoryDto) {
    return await this.adminCategoryService.create(dto);
  }

  @Patch(':id')
  async update(
    @Param() params: PostgresIdParam,
    @Body() dto: UpdateCategoryDto,
  ) {
    return await this.adminCategoryService.update(params.id, dto);
  }
}
