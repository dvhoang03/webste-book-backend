import { IsString } from 'class-validator';
import { PartialType } from '@nestjs/swagger';

export class PolicyDto {
  @IsString()
  title: string;

  @IsString()
  slug: string;

  @IsString()
  category: string;

  @IsString()
  content: string;
}

export class CreatePolicyDto extends PolicyDto {}

export class UpdatePolicyDto extends PartialType(PolicyDto) {}
