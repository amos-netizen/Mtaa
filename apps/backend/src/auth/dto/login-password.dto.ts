import { IsString, IsNotEmpty, MinLength, IsEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

/**
 * Login with password DTO
 */
export class LoginPasswordDto {
  @ApiProperty({ example: 'user@example.com' })
  @IsEmail({}, { message: 'Invalid email address' })
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: 'SecurePassword123!' })
  @IsString()
  @IsNotEmpty()
  @MinLength(6, { message: 'Password must be at least 6 characters' })
  password: string;
}



