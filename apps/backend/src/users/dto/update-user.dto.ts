import { IsString, IsOptional, IsEmail, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDto {
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  @MinLength(2)
  fullName?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  @MinLength(3)
  username?: string;

  @ApiProperty({ required: false })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  @MinLength(6)
  password?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  bio?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  profileImageUrl?: string;

  @ApiProperty({ required: false, enum: ['en', 'sw'] })
  @IsString()
  @IsOptional()
  languagePreference?: 'en' | 'sw';

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  mpesaNumber?: string;
}



