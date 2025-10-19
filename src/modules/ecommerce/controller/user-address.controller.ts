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
import { SkipAuth, UserAuth } from '@/modules/auth/auth.decorator';
import { UserAddressService } from '@/modules/ecommerce/service/user-address.service';
import { JwtUserGuard } from '@/modules/auth/jwt-user/jwt-user.guard';
import { User } from '@/modules/entity';
import {
  AddressListDto,
  CreateAddressDto,
} from '@/modules/ecommerce/dto/address.dto';
import { ApiOperation } from '@nestjs/swagger';
import { PostgresIdParam } from '@/base/dto/base.dto';

@ApiTagAndBearer('User/ Address')
@SkipAuth()
@Controller('address')
@UseGuards(JwtUserGuard)
export class UserAddressController {
  constructor(private readonly userAddressService: UserAddressService) {}

  @ApiOperation({ summary: 'api list product' })
  @Get()
  async list(@UserAuth() user: User, @Query() query: AddressListDto) {
    query.filter = Object.assign({}, query.filter, { userId: user.id });
    return await this.userAddressService.list(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'api lấy thông tin chi tiet address' })
  async getDetail(@Param() params: PostgresIdParam) {
    return await this.userAddressService.getOne(params);
  }

  @ApiOperation({ summary: 'api tao dia chi' })
  @Post()
  async create(@UserAuth() user: User, @Body() dto: CreateAddressDto) {
    dto.userId = user.id;
    return await this.userAddressService.create(dto);
  }

  @ApiOperation({ summary: 'api sua dia chi' })
  @Patch()
  async update(@Param() param: PostgresIdParam, @Body() dto: CreateAddressDto) {
    return await this.userAddressService.update(param.id, dto);
  }

  @ApiOperation({ summary: 'api xoa dia chi' })
  @Delete(':id')
  async delete(@Param() param: PostgresIdParam) {
    return await this.userAddressService.remove(param.id);
  }
}
