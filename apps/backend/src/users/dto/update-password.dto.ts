import { IsString, IsNotEmpty, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

/**
 * Update password DTO
 */
export class UpdatePasswordDto {
  @ApiProperty({ example: 'OldPassword123!' })
  @IsString()
  @IsNotEmpty()
  oldPassword: string;

  @ApiProperty({ example: 'NewPassword123!' })
  @IsString()
  @IsNotEmpty()
  @MinLength(6, { message: 'New password must be at least 6 characters' })
  newPassword: string;
}



