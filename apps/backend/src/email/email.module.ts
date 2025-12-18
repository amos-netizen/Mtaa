import { Module, Global } from '@nestjs/common';
import { EmailService } from './email.service';
import { ConfigModule } from '../config/config.module';

/**
 * Email Module
 * Provides email sending functionality across the application
 * Supports SendGrid, Mailgun, and SMTP providers
 */
@Global()
@Module({
  imports: [ConfigModule],
  providers: [EmailService],
  exports: [EmailService],
})
export class EmailModule {}

