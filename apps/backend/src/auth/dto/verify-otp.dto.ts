import { IsString, IsNotEmpty, Matches, IsOptional, IsEmail, ValidateIf } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class VerifyOtpDto {
  @ApiProperty({ example: '+254712345678', required: false })
  @IsString()
  @IsOptional()
  @ValidateIf((o) => !o.email)
  phoneNumber?: string;

  @ApiProperty({ example: 'user@example.com', required: false })
  @IsEmail({}, { message: 'Invalid email address' })
  @IsOptional()
  @ValidateIf((o) => !o.phoneNumber)
  email?: string;

  @ApiProperty({ example: '123456' })
  @IsString()
  @IsNotEmpty()
  @Matches(/^\d{6}$/, { message: 'OTP must be 6 digits' })
  otpCode: string;
}



