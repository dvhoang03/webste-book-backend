import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Book } from '@/modules/entity';
import { Repository } from 'typeorm';

@ValidatorConstraint({ async: true, name: 'UniqueSku' })
@Injectable()
export class IsUniqueSkuValidate implements ValidatorConstraintInterface {
  constructor(
    @InjectRepository(Book)
    private readonly bookModel: Repository<Book>,
  ) {}

  async validate(sku: string, validationArguments?: ValidationArguments) {
    const existProduct = await this.bookModel.findOne({ where: { sku } });
    return !existProduct;
  }
  defaultMessage?(validationArguments?: ValidationArguments): string {
    return 'sku is exist';
  }
}

export function IsSkuUnique(validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'IsSkuUnique',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: IsUniqueSkuValidate,
    });
  };
}
