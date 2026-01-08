import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { SkipAuth, UserAuth } from '@/modules/auth/auth.decorator';
import { ApiTagAndBearer } from '@/base/swagger/swagger.decorator';
import { UserReviewService } from '@/modules/ecommerce/service/user-review.service';
import { ApiOperation } from '@nestjs/swagger';
import {
  CreateReviewDto,
  ReviewListDto,
  UpdateReviewDto,
} from '@/modules/ecommerce/dto/review.dto';
import { JwtUserGuard } from '@/modules/auth/jwt-user/jwt-user.guard';
import { User } from '@/modules/entity';
import { PostgresIdParam } from '@/base/dto/base.dto';
@SkipAuth()
@ApiTagAndBearer('User/ Review')
@Controller('review')
export class UserReviewController {
  constructor(private readonly userReviewService: UserReviewService) {}

  @ApiOperation({ summary: 'api list tất cả review' })
  @Get()
  async list(@Query() query: ReviewListDto) {
    return await this.userReviewService.list(query);
  }

  @ApiOperation({ summary: 'api lietj ke review cua user' })
  @Get('user')
  async listReviewOfUser(
    @UserAuth() user: User,
    @Query() query: ReviewListDto,
  ) {
    query.filter = Object.assign({}, query.filter, { userId: user.id });
    return await this.userReviewService.list(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'api lấy thông tin chi tiet review' })
  async getDetail(@Param() params: PostgresIdParam) {
    return await this.userReviewService.getOne(params);
  }

  @UseGuards(JwtUserGuard)
  @ApiOperation({ summary: 'api tao review' })
  @Post()
  async create(@Body() dto: CreateReviewDto, @UserAuth() user: User) {
    Object.assign(dto, { userId: user.id });
    return this.userReviewService.create(dto);
  }

  @ApiOperation({ summary: 'api update review' })
  @UseGuards(JwtUserGuard)
  @Patch(':id')
  async update(
    @UserAuth() user: User,
    @Param() params: PostgresIdParam,
    @Body() dto: UpdateReviewDto,
  ) {
    await this.userReviewService.getOne({
      userId: user.id,
      id: params.id,
    });
    return await this.userReviewService.update(params.id, dto);
  }

  @ApiOperation({ summary: 'api xoa review' })
  @UseGuards(JwtUserGuard)
  @Delete(':id')
  async delete(@Param() params: PostgresIdParam, @UserAuth() user: User) {
    await this.userReviewService.getOne({
      userId: user.id,
      id: params.id,
    });
    return await this.userReviewService.remove(params.id);
  }
}
