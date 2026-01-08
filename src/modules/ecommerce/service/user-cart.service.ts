import { BadRequestException, Injectable } from '@nestjs/common';
import { BaseService } from '@/base/service/base-service.service';
import { Book, Cart, CartItem, User } from '@/modules/entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import {
  CartItemDto,
  CartItemListDto,
  CreateCartItemDto,
} from '@/modules/ecommerce/dto/cart.dto';
import { TransactionType } from '@/modules/ecommerce/enums/product.enum';
import { UserCreateOrderService } from '@/modules/ecommerce/service/user-create-order.service';
import { BaseListDto } from '@/base/service/base-list.dto';

@Injectable()
export class UserCartService extends BaseService<CartItem> {
  constructor(
    @InjectRepository(CartItem)
    private readonly cartItemModel: Repository<CartItem>,
    @InjectRepository(Cart)
    private readonly cartModel: Repository<Cart>,
    @InjectRepository(Book)
    private readonly book: Repository<Book>,
    private readonly userCreateOrder: UserCreateOrderService,
  ) {
    super(cartItemModel);
  }

  protected addRelations<D extends BaseListDto>(
    qb: SelectQueryBuilder<CartItem>,
    dto: D,
  ): SelectQueryBuilder<CartItem> {
    const alias = qb.alias; // 't'

    // 1. Join và Select các bảng trung gian (BookAuthor, BookCategory)
    //    VÀ các bảng chính (Author, Category, Publisher)
    //    chỉ bằng một dòng cho mỗi quan hệ.
    qb.leftJoinAndSelect(`${alias}.book`, 'book');

    // qb.leftJoinAndSelect(`${alias}.bookAuthors`, 'bookAuthor');
    // qb.leftJoinAndSelect(`${alias}.bookCategories`, 'bookCategory');
    //
    // // 2. Join lồng cấp (nested join)
    // //    Từ 'bookAuthor' (đã join ở trên), join tiếp vào 'author'
    // qb.leftJoinAndSelect(`bookAuthor.author`, 'author');
    //
    // //    Từ 'bookCategory' (đã join ở trên), join tiếp vào 'category'
    // qb.leftJoinAndSelect(`bookCategory.category`, 'category');

    return qb;
  }

  async calculatorPriceCartItem(cartItem: CartItemDto) {
    const book = await this.book.findOneBy({ id: cartItem.bookId });
    if (!book) throw new BadRequestException('Book not found');
    if (cartItem.type === TransactionType.PURCHASE) {
      return book?.sellerPrice;
    }

    if (!cartItem.rentalType)
      throw new BadRequestException('Rental require Rental type');
    const toltal = this.userCreateOrder.calculatorMoneyRental(
      cartItem.rentalType,
      book,
      cartItem.quantity,
    );
    return toltal.totalDeposit + toltal.totalRental;
  }

  async addCartItem(user: User, dto: CreateCartItemDto) {
    let cart = await this.cartModel.findOne({ where: { userId: user.id } });
    if (!cart) {
      cart = await this.cartModel.save({ userId: user.id });
    }
    return await this.cartItemModel.save({
      ...dto,
      price: await this.calculatorPriceCartItem(dto),
      cartId: cart.id,
    });
  }

  async listCartItem(user: User, query: CartItemListDto) {
    const cart = await this.cartModel.findOne({ where: { userId: user.id } });
    query.filter = Object.assign({}, query.filter, { cartId: cart?.id });
    return await this.list(query);
  }
}
