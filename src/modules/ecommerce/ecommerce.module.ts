import { Module } from '@nestjs/common';
import { UploadController } from '@/modules/ecommerce/controller/upload-file.controller';
import { IsUniqueEmailValidate } from '@/modules/ecommerce/custom-validate/unique-email.validate';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Address, Book, User } from '@/modules/entity';
import { AdminUserService } from '@/modules/ecommerce/service/admin-user.service';
import { AdminUserController } from '@/modules/ecommerce/controller/admin-user.controller';
import { AdminBookController } from '@/modules/ecommerce/controller/admin-book.controller';
import { UserBookController } from '@/modules/ecommerce/controller/user-book.controller';
import { UserBookService } from '@/modules/ecommerce/service/user-book.service';
import { AdminBookService } from '@/modules/ecommerce/service/admin-book.service';
import { UserAddressController } from '@/modules/ecommerce/controller/user-address.controller';
import { UserAddressService } from '@/modules/ecommerce/service/user-address.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, Book, Address])],
  controllers: [
    UploadController,

    AdminUserController,
    AdminBookController,

    UserBookController,
    UserAddressController,
  ],
  providers: [
    IsUniqueEmailValidate,

    AdminUserService,
    AdminBookService,

    UserBookService,
    UserAddressService,
  ],
  exports: [IsUniqueEmailValidate],
})
export class EcommerceModule {}
