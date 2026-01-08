// src/auth/dto/login.dto.ts
import { ApiProperty, PickType } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { IsEmailUnique } from '@/modules/ecommerce/custom-validate/unique-email.validate';

export class RegisterDto {
  @IsNotEmpty()
  @IsEmail()
  @IsEmailUnique()
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;

  @IsNotEmpty()
  @IsString()
  fullName: string;

  @IsNotEmpty()
  @IsString()
  phone: string;

  @IsNotEmpty()
  @IsString()
  otp: string;
}

export class SendOptDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;
}

export class LoginDto {
  @ApiProperty({ example: 'user@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'P@ssw0rd!' })
  @IsString()
  @MinLength(4)
  password: string;
}

export class AccessTokenResponseDto {
  @ApiProperty({ example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' })
  accessToken: string;
}

export class SuccessDto {
  @ApiProperty({ example: true })
  success: boolean;
}
