import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { ApiTagAndBearer } from '@/base/swagger/swagger.decorator';
import { SkipAuth } from '@/modules/auth/auth.decorator';
import { UserBookService } from '@/modules/ecommerce/service/user-book.service';
import { BookListDto, UpdateBookDto } from '@/modules/ecommerce/dto/book.dto';
import { CreateUserDto } from '@/modules/ecommerce/dto/user.dto';
import { ApiOperation } from '@nestjs/swagger';
import { PostgresIdParam } from '@/base/dto/base.dto';

@ApiTagAndBearer('User/ Book')
@Controller('book')
@SkipAuth()
export class UserBookController {
  constructor(private readonly userBook: UserBookService) {}

  @Get()
  async listPaginated(@Query() query: BookListDto) {
    return await this.userBook.list(query);
  }

  @Get(':id')
  async getDetail(@Param() param: PostgresIdParam) {
    return await this.userBook.getOne(param);
  }
}
