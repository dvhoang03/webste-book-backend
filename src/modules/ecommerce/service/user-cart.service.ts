import { Injectable } from '@nestjs/common';
import { BaseService } from '@/base/service/base-service.service';
import { Cart, CartItem, User } from '@/modules/entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  CartItemListDto,
  CreateCartItemDto,
  UpdateCartItemDto,
} from '@/modules/ecommerce/dto/cart.dto';

@Injectable()
export class UserCartService extends BaseService<CartItem> {
  constructor(
    @InjectRepository(CartItem)
    private readonly cartItemModel: Repository<CartItem>,
    @InjectRepository(Cart)
    private readonly cartModel: Repository<Cart>,
  ) {
    super(cartItemModel);
  }

  async addCartItem(user: User, dto: CreateCartItemDto) {
    let cart = await this.cartModel.findOne({ where: { userId: user.id } });
    if (!cart) {
      cart = await this.cartModel.save({ userId: user.id });
    }
    return await this.cartItemModel.save({ ...dto, cartId: cart.id });
  }

  async listCartItem(user: User, query: CartItemListDto) {
    const cart = await this.cartModel.findOne({ where: { userId: user.id } });
    query.filter = Object.assign({}, query.filter, { cartId: cart?.id });
    return await this.list(query);
  }
}
