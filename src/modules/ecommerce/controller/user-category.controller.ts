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
import { SkipAuth } from '@/modules/auth/auth.decorator';

@ApiTagAndBearer('User/ Category')
@SkipAuth()
@Controller('category')
export class UserCategoryController {
  constructor(private readonly adminCategoryService: AdminCategoryService) {}

  @Get()
  async list(@Query() query: ListCategoryDto) {
    return await this.adminCategoryService.list(query);
  }

  @Get(':id')
  async create(@Param() param: PostgresIdParam) {
    return await this.adminCategoryService.getOne({ id: param.id });
  }
}
