import * as bcrypt from 'bcrypt';
import { Injectable } from '@nestjs/common';
import { AppConfigService } from '../../config/config.service';

/**
 * Password utility service
 * Handles password hashing and verification using BCrypt
 */
@Injectable()
export class PasswordUtil {
  constructor(private configService: AppConfigService) {}

  /**
   * Hash a plain text password
   * @param password - Plain text password
   * @returns Hashed password
   */
  async hashPassword(password: string): Promise<string> {
    const rounds = this.configService.bcryptRounds;
    return bcrypt.hash(password, rounds);
  }

  /**
   * Verify a password against a hash
   * @param password - Plain text password
   * @param hash - Hashed password
   * @returns True if password matches, false otherwise
   */
  async verifyPassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }
}



