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
import { ApiTagAndBearer } from '@/base/swagger/swagger.decorator';
import { UserCartService } from '@/modules/ecommerce/service/user-cart.service';
import { SkipAuth, UserAuth } from '@/modules/auth/auth.decorator';
import { JwtUserGuard } from '@/modules/auth/jwt-user/jwt-user.guard';
import { ApiConsumes, ApiOperation } from '@nestjs/swagger';
import { Cart, User } from '@/modules/entity';
import {
  CartItemListDto,
  CreateCartItemDto,
  UpdateCartItemDto,
} from '@/modules/ecommerce/dto/cart.dto';
import { PostgresIdParam } from '@/base/dto/base.dto';

@ApiTagAndBearer('User/ cart')
@Controller('cart')
@SkipAuth()
@UseGuards(JwtUserGuard)
export class UserCartController {
  constructor(private readonly cartService: UserCartService) {}

  @ApiOperation({ summary: 'api liet ke cart' })
  @Get()
  async list(@UserAuth() user: User, @Query() query: CartItemListDto) {
    return await this.cartService.listCartItem(user, query);
  }

  @ApiOperation({ summary: 'api get detail cartItem' })
  @Get(':id')
  async getDetail(@Param() param: PostgresIdParam) {
    return await this.cartService.getOne(param);
  }

  @ApiOperation({ summary: 'api update cartItem' })
  @Patch(':id')
  async update(
    @Param() param: PostgresIdParam,
    @Body() dto: UpdateCartItemDto,
  ) {
    return await this.cartService.update(param.id, dto);
  }

  @ApiOperation({ summary: 'api them vao gio hang' })
  @Post()
  async addCartItem(@UserAuth() user: User, @Body() dto: CreateCartItemDto) {
    return await this.cartService.addCartItem(user, dto);
  }

  @ApiOperation({ summary: 'api xoa cartItem' })
  @Delete(':id')
  async remove(@Param() param: PostgresIdParam) {
    return await this.cartService.remove(param.id);
  }
}
