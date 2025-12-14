import { IsString, IsNotEmpty, IsOptional, IsNumber, IsBoolean, IsArray, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateListingDto {
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  @IsString()
  @IsNotEmpty()
  neighborhoodId: string;

  @ApiProperty({ example: 'FURNITURE' })
  @IsString()
  @IsNotEmpty()
  category: string;

  @ApiProperty({ example: 'Vintage Coffee Table' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ example: 'Beautiful vintage coffee table in excellent condition' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ example: 5000, required: false })
  @IsNumber()
  @IsOptional()
  @Min(0)
  price?: number;

  @ApiProperty({ example: false })
  @IsBoolean()
  @IsOptional()
  isFree?: boolean;

  @ApiProperty({ example: 'GOOD', required: false })
  @IsString()
  @IsOptional()
  condition?: string;

  @ApiProperty({ example: '["https://example.com/image1.jpg"]' })
  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty()
  images: string[];

  @ApiProperty({ example: 'Kilimani, Nairobi', required: false })
  @IsString()
  @IsOptional()
  pickupLocation?: string;

  @ApiProperty({ example: false })
  @IsBoolean()
  @IsOptional()
  deliveryAvailable?: boolean;
}
