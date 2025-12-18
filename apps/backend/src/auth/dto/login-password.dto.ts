import { IsString, IsNotEmpty, MinLength, IsEmail, IsOptional, ValidateIf, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

/**
 * Login with password DTO
 * Supports both email and phone number login
 */
export class LoginPasswordDto {
  @ApiProperty({ example: 'user@example.com', required: false })
  @IsEmail({}, { message: 'Invalid email address' })
  @IsOptional()
  @ValidateIf((o) => !o.phoneNumber)
  email?: string;

  @ApiProperty({ example: '+254712345678', required: false })
  @IsString()
  @IsOptional()
  @ValidateIf((o) => !o.email)
  @Matches(/^[\d+\-\s()]+$/, { message: 'Invalid phone number format' })
  phoneNumber?: string;

  @ApiProperty({ example: 'SecurePassword123!' })
  @IsString()
  @IsNotEmpty()
  @MinLength(6, { message: 'Password must be at least 6 characters' })
  password: string;
}



