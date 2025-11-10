import { Module } from '@nestjs/common';
import { UploadController } from '@/modules/ecommerce/controller/upload-file.controller';
import { IsUniqueEmailValidate } from '@/modules/ecommerce/custom-validate/unique-email.validate';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  Address,
  Author,
  Book,
  BookAuthor,
  BookCategory,
  Cart,
  CartItem,
  Category,
  Order,
  OrderItem,
  Payment,
  RentalItem,
  Review,
  User,
} from '@/modules/entity';
import { AdminUserService } from '@/modules/ecommerce/service/admin-user.service';
import { AdminUserController } from '@/modules/ecommerce/controller/admin-user.controller';
import { AdminBookController } from '@/modules/ecommerce/controller/admin-book.controller';
import { UserBookController } from '@/modules/ecommerce/controller/user-book.controller';
import { UserBookService } from '@/modules/ecommerce/service/user-book.service';
import { AdminBookService } from '@/modules/ecommerce/service/admin-book.service';
import { UserAddressController } from '@/modules/ecommerce/controller/user-address.controller';
import { UserAddressService } from '@/modules/ecommerce/service/user-address.service';
import { AdminAuthorService } from '@/modules/ecommerce/service/admin-author.service';
import { AdminAuthorController } from '@/modules/ecommerce/controller/admin-author.controller';
import { UserReviewController } from '@/modules/ecommerce/controller/user-review.controller';
import { UserReviewService } from '@/modules/ecommerce/service/user-review.service';
import { AdminPublisherController } from '@/modules/ecommerce/controller/admin-publisher.controller';
import { AdminPublisherService } from '@/modules/ecommerce/service/admin-publisher.service';
import { Publisher } from '@/modules/entity/publisher.entity';
import { IsUniqueSkuValidate } from '@/modules/ecommerce/custom-validate/sku-product-unique.validate';
import { UserCartController } from '@/modules/ecommerce/controller/user-cart.controller';
import { UserCartService } from '@/modules/ecommerce/service/user-cart.service';
import { OrderItemDto } from '@/modules/ecommerce/dto/order-item.dto';
import { UserCreateOrderService } from '@/modules/ecommerce/service/user-create-order.service';
import { UserCreateOrderController } from '@/modules/ecommerce/controller/user-create-order.controller';
import { VnpayModule } from '@/provider/vnpay/vnpay.module';
import { HttpModule } from '@nestjs/axios';
import { config } from '@/config';
import { CheckTransactionSchedule } from '@/modules/ecommerce/schedule/check-transaction.schedule';
import { UserOrderController } from '@/modules/ecommerce/controller/user-order.controller';
import { UserOrderService } from '@/modules/ecommerce/service/user-order.service';
import { AdminCategoryController } from '@/modules/ecommerce/controller/admin-category.controller';
import { AdminCategoryService } from '@/modules/ecommerce/service/admin-category.service';
import { AdminShipmentController } from '@/modules/ecommerce/controller/admin-shipment.controller';
import { AdminShippingService } from '@/modules/ecommerce/service/admin-shipping.service';
import { Shipping } from '@/modules/entity/shipping.entity';
import { RentalReturn } from '@/modules/entity/rental-return.entity';
import { ReturnRequest } from '@/modules/entity/return-request.entity';
import { ReturnItem } from '@/modules/entity/return-item.entity';
import { AdminReturnRequestController } from '@/modules/ecommerce/controller/admin-return-request.controller';
import { UserReturnRequestController } from '@/modules/ecommerce/controller/user-return-request.controller';
import { UserReturnRequestService } from '@/modules/ecommerce/service/user-return-request.service';
import { UserCategoryController } from '@/modules/ecommerce/controller/user-category.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      Book,
      Address,
      Author,
      Review,
      Publisher,
      Cart,
      CartItem,
      Order,
      OrderItem,
      RentalItem,
      Payment,
      BookCategory,
      BookAuthor,
      Shipping,
      Category,
      RentalReturn,
      ReturnRequest,
      ReturnItem,
    ]),

    VnpayModule,
  ],
  controllers: [
    UploadController,

    AdminUserController,
    AdminBookController,
    AdminAuthorController,
    AdminPublisherController,
    AdminCategoryController,
    AdminShipmentController,
    AdminReturnRequestController,

    UserOrderController,
    UserBookController,
    UserAddressController,
    UserReviewController,
    UserCartController,
    UserCreateOrderController,
    UserOrderController,
    UserReturnRequestController,
    UserCategoryController,
  ],
  providers: [
    IsUniqueEmailValidate,
    IsUniqueSkuValidate,

    AdminUserService,
    AdminBookService,
    AdminAuthorService,
    AdminPublisherService,
    AdminCategoryService,
    AdminShippingService,

    UserBookService,
    UserAddressService,
    UserReviewService,
    UserCartService,
    UserCreateOrderService,
    UserOrderService,
    UserReturnRequestService,

    //conjob
    CheckTransactionSchedule,
  ],
  exports: [IsUniqueEmailValidate],
})
export class EcommerceModule {}
