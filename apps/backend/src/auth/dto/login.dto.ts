import { IsString, IsOptional, IsEmail, ValidateIf } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
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
}



