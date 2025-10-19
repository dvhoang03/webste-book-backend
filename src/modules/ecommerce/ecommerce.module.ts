import { Module } from '@nestjs/common';
import { UploadController } from '@/modules/ecommerce/controller/upload-file.controller';
import { IsUniqueEmailValidate } from '@/modules/ecommerce/custom-validate/unique-email.validate';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  Address,
  Author,
  Book,
  Cart,
  CartItem,
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
    ]),
  ],
  controllers: [
    UploadController,

    AdminUserController,
    AdminBookController,
    AdminAuthorController,
    AdminPublisherController,

    UserBookController,
    UserAddressController,
    UserReviewController,
    UserCartController,
  ],
  providers: [
    IsUniqueEmailValidate,
    IsUniqueSkuValidate,

    AdminUserService,
    AdminBookService,
    AdminAuthorService,
    AdminPublisherService,

    UserBookService,
    UserAddressService,
    UserReviewService,
    UserCartService,
  ],
  exports: [IsUniqueEmailValidate],
})
export class EcommerceModule {}
