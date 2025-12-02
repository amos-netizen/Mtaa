import { IsString, IsNotEmpty, IsOptional, IsEmail, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

/**
 * Create user DTO
 */
export class CreateUserDto {
  @ApiProperty({ example: '+254712345678' })
  @IsString()
  @IsNotEmpty()
  phoneNumber: string;

  @ApiProperty({ example: 'John Doe' })
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  fullName: string;

  @ApiProperty({ example: 'johndoe' })
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  username: string;

  @ApiProperty({ example: 'SecurePassword123!' })
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @ApiProperty({ example: 'john@example.com', required: false })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiProperty({ example: 'cuid-here', required: false })
  @IsString()
  @IsOptional()
  neighborhoodId?: string;

  @ApiProperty({ example: '123 Main Street', required: false })
  @IsString()
  @IsOptional()
  address?: string;
}



