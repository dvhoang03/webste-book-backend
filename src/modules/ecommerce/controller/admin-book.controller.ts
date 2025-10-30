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
import { UserBookService } from '@/modules/ecommerce/service/user-book.service';
import {
  BookListDto,
  CreateBookDto,
  UpdateBookDto,
} from '@/modules/ecommerce/dto/book.dto';
import { PostgresIdParam } from '@/base/dto/base.dto';
import { ApiOperation } from '@nestjs/swagger';
import { AdminBookService } from '@/modules/ecommerce/service/admin-book.service';

@ApiTagAndBearer('Admin/ Book')
@Controller('admin/book')
export class AdminBookController {
  constructor(private readonly userBook: AdminBookService) {}

  @ApiOperation({ summary: 'api liet ke danh sach book' })
  @Get()
  async listPaginated(@Query() query: BookListDto) {
    return await this.userBook.list(query);
  }

  @ApiOperation({ summary: 'api lay chi tiet  book' })
  @Get(':id')
  async getDetail(@Param() param: PostgresIdParam) {
    return await this.userBook.getOne(param);
  }

  @ApiOperation({ summary: 'api tao book' })
  @Post()
  async create(@Body() dto: CreateBookDto) {
    return this.userBook.createBook(dto);
  }

  @ApiOperation({ summary: 'api update book' })
  @Patch(':id')
  async update(@Param() params: PostgresIdParam, @Body() dto: UpdateBookDto) {
    return await this.userBook.update(params.id, dto);
  }
}
