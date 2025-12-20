import {
  registerDecorator,
  ValidateByOptions,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { Injectable } from '@nestjs/common';
import { Policy } from '@/modules/entity/policy.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@ValidatorConstraint({ async: true, name: 'UniqueEmail' })
@Injectable()
export class IsUniqueSlugValidate implements ValidatorConstraintInterface {
  constructor(
    @InjectRepository(Policy)
    private readonly policyService: Repository<Policy>,
  ) {}

  async validate(slug: string, validationArgument?: ValidationArguments) {
    const slugs = await this.policyService.findOneBy({ slug });
    return !slugs;
  }
  defaultMessage(validationArguments?: ValidationArguments): string {
    return ' slug đã tồn tại.';
  }
}

export function IsSlugUnique(validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'IsSlugUnique',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: IsUniqueSlugValidate,
    });
  };
}
