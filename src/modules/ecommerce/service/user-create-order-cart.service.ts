import { BadRequestException, Injectable } from '@nestjs/common';
import { UserCreateOrderService } from '@/modules/ecommerce/service/user-create-order.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Cart, CartItem, User } from '@/modules/entity';
import { Repository } from 'typeorm';
import {
  RentalType,
  TransactionType,
} from '@/modules/ecommerce/enums/product.enum';
import { Items, UserOrderDto } from '@/modules/ecommerce/dto/user-order.dto';

@Injectable()
export class UserCreateOrderCartService {
  constructor(
    private readonly userCreateOrderService: UserCreateOrderService,
    @InjectRepository(Cart)
    private readonly cartRepo: Repository<Cart>,
    @InjectRepository(CartItem)
    private readonly cartItemRepo: Repository<CartItem>,
  ) {}

  async createOrderByCart(
    user: User,
    dto: { addressId: string },
    ipAddr: string,
  ) {
    const cart = await this.cartRepo.findOneBy({ userId: user.id });
    if (!cart) throw new BadRequestException('Cart not found ');
    const cartItems = await this.cartItemRepo.findBy({
      cartId: cart.id,
      isSelected: true,
    });
    let check;
    cartItems.forEach((cartItem) => {
      if (cartItem.type === TransactionType.RENTAL) {
        if (!check) {
          check = cartItem.rentalType;
        } else {
          if (cartItem.rentalType !== check) {
            throw new BadRequestException(
              'Books was rented must be the same rental type, not different',
            );
          }
        }
      }
    });

    const dateOrderItemDto: Items[] = cartItems.map((item) => {
      return {
        type: item.type,
        quantity: item.quantity,
        rentalType: item.rentalType || RentalType.DAILY,
        bookId: item.bookId,
      };
    });
    const dataOrder: UserOrderDto = {
      items: dateOrderItemDto,
      addressId: dto.addressId,
      rentalType: check,
    };
    const result = await this.userCreateOrderService.createOrder(
      user,
      dataOrder,
      ipAddr,
    );
    await this.cartItemRepo.delete(cartItems.map((i) => i.id));
    return result;
  }
}
