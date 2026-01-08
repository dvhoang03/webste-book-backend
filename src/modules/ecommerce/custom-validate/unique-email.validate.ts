import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '@/modules/entity';
import { Repository } from 'typeorm';

@ValidatorConstraint({ async: true, name: 'UniqueEmail' })
@Injectable()
export class IsUniqueEmailValidate implements ValidatorConstraintInterface {
  constructor(
    @InjectRepository(User)
    private readonly userRepotry: Repository<User>,
  ) {}

  async validate(email: string, validationArguments?: ValidationArguments) {
    const user = await this.userRepotry.findOne({ where: { email } });
    return !user;
  }
  defaultMessage?(validationArguments?: ValidationArguments): string {
    return 'email đã tồn tại.';
  }
}

export function IsEmailUnique(validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'IsEmailUnique',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: IsUniqueEmailValidate,
    });
  };
}
