# Email Service Setup Guide

## Overview

The MTAA backend includes a comprehensive email service that supports multiple email providers:
- **SendGrid** (Recommended for production)
- **Mailgun** (Alternative transactional email service)
- **SMTP** (Generic SMTP server support)

## Environment Variables

Add the following environment variables to your `.env` file:

### Required for All Providers
```env
# Email service configuration
EMAIL_SERVICE=sendgrid  # Options: sendgrid, mailgun, smtp, none
EMAIL_FROM_ADDRESS=noreply@mymtaa.com  # Sender email address
FRONTEND_URL=https://mymtaa.com  # Frontend URL for email links
```

### SendGrid Configuration
```env
EMAIL_SERVICE=sendgrid
EMAIL_SERVICE_API_KEY=SG.your_sendgrid_api_key_here
EMAIL_FROM_ADDRESS=noreply@mymtaa.com
```

### Mailgun Configuration
```env
EMAIL_SERVICE=mailgun
EMAIL_SERVICE_API_KEY=your_mailgun_api_key_here
MAILGUN_DOMAIN=mg.mymtaa.com
EMAIL_FROM_ADDRESS=noreply@mg.mymtaa.com
```

### SMTP Configuration
```env
EMAIL_SERVICE=smtp
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
SMTP_SECURE=false  # true for port 465, false for port 587
EMAIL_FROM_ADDRESS=your-email@gmail.com
```

## Email Features

### 1. User Registration Verification
- Automatically sends verification email when user registers with email
- Email includes verification link that expires in 24 hours
- Endpoint: `POST /api/v1/auth/verify-email`

### 2. Password Reset
- Sends password reset link to user's email
- Reset link expires in 1 hour
- Endpoint: `POST /api/v1/auth/forgot-password`
- Endpoint: `POST /api/v1/auth/reset-password`

### 3. Emergency Alerts
- Sends email notifications for emergency alerts
- Includes alert type, location, and description
- Integrated into safety alerts module

### 4. Job Applications
- Sends email to employer when someone applies for a job
- Includes applicant name, job title, and cover letter
- Integrated into jobs module

### 5. Message Notifications
- Sends email when user receives a new message
- Includes sender name and message preview
- Integrated into messaging module

## Usage Examples

### In Your Service

```typescript
import { EmailService } from '../email/email.service';

@Injectable()
export class YourService {
  constructor(private emailService: EmailService) {}

  async sendCustomEmail() {
    const result = await this.emailService.sendEmail({
      to: 'user@example.com',
      subject: 'Welcome!',
      html: '<h1>Welcome to MTAA</h1>',
    });

    if (result.success) {
      console.log('Email sent:', result.messageId);
    } else {
      console.error('Email failed:', result.error);
    }
  }
}
```

### Pre-built Email Methods

```typescript
// Verification email
await emailService.sendVerificationEmail(
  'user@example.com',
  'verification-token',
  'John Doe'
);

// Password reset
await emailService.sendPasswordResetEmail(
  'user@example.com',
  'reset-token',
  'John Doe'
);

// Emergency alert
await emailService.sendEmergencyAlertEmail(
  'user@example.com',
  'Alert Title',
  'Alert Description',
  'CRIME',
  'Westlands'
);

// Job application
await emailService.sendJobApplicationEmail(
  'employer@example.com',
  'Applicant Name',
  'Job Title',
  'Cover letter text...'
);

// Message notification
await emailService.sendMessageNotificationEmail(
  'recipient@example.com',
  'Sender Name',
  'Message preview...',
  '/messages/conversation-id'
);
```

## Error Handling

All email methods return a `EmailResult` object:

```typescript
interface EmailResult {
  success: boolean;
  messageId?: string;
  error?: string;
}
```

Emails are sent asynchronously and errors are logged but don't throw exceptions. This ensures that:
- User registration succeeds even if email fails
- Job applications are saved even if notification email fails
- The application continues to function if email service is down

## Testing

### Development Mode
Set `EMAIL_SERVICE=none` to disable email sending during development. All email methods will log warnings but won't attempt to send emails.

### Testing with Real Emails
1. Use a test email service like Mailtrap or Ethereal Email
2. Configure SMTP settings for the test service
3. Check the test inbox for sent emails

### Example: Using Ethereal Email (Free Testing)
```env
EMAIL_SERVICE=smtp
SMTP_HOST=smtp.ethereal.email
SMTP_PORT=587
SMTP_USER=your-ethereal-username
SMTP_PASSWORD=your-ethereal-password
SMTP_SECURE=false
EMAIL_FROM_ADDRESS=your-ethereal-email@ethereal.email
```

## Production Recommendations

1. **Use SendGrid or Mailgun** for reliable delivery
2. **Set up SPF and DKIM records** for your domain
3. **Monitor email delivery rates** and bounce rates
4. **Use a dedicated sending domain** (e.g., `noreply@mymtaa.com`)
5. **Implement rate limiting** to prevent abuse
6. **Set up webhooks** to track email events (delivered, opened, clicked)

## Troubleshooting

### Emails Not Sending
1. Check environment variables are set correctly
2. Verify API keys are valid
3. Check email service logs in console
4. Ensure `EMAIL_FROM_ADDRESS` matches your verified domain

### SMTP Connection Failed
1. Verify SMTP host and port are correct
2. Check if firewall is blocking SMTP port
3. For Gmail, use App Password instead of regular password
4. Ensure `SMTP_SECURE` matches the port (true for 465, false for 587)

### Email in Spam Folder
1. Set up SPF, DKIM, and DMARC records
2. Use a dedicated sending domain
3. Warm up your sending domain gradually
4. Avoid spam trigger words in subject lines

## Database Migration

After adding email fields to the User model, run:

```bash
cd apps/backend
npx prisma migrate dev --name add_email_verification_fields
npx prisma generate
```

## Security Notes

- Email verification tokens expire after 24 hours
- Password reset tokens expire after 1 hour
- Tokens are cryptographically secure (32-byte random)
- All tokens are stored in the database and validated before use
- Invalid tokens are rejected without revealing if they exist

