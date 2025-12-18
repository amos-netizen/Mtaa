# 📧 Email Service Configuration Guide

## Quick Setup

The email service has been configured with default settings. To enable email sending, you need to configure your email provider.

## Current Configuration

The email service is currently set to `EMAIL_SERVICE=none` which means emails will be logged but not sent. This is safe for development.

## Setup Options

### Option 1: SendGrid (Recommended for Production) ⭐

1. **Sign up for SendGrid**: https://signup.sendgrid.com/
2. **Create API Key**:
   - Go to Settings → API Keys
   - Click "Create API Key"
   - Name it "MTAA Production"
   - Select "Full Access" or "Mail Send" permissions
   - Copy the API key (starts with `SG.`)

3. **Update `.env.local`**:
   ```env
   EMAIL_SERVICE=sendgrid
   EMAIL_SERVICE_API_KEY=SG.your_actual_api_key_here
   EMAIL_FROM_ADDRESS=noreply@mymtaa.com
   FRONTEND_URL=https://mymtaa.com
   ```

4. **Verify Sender**:
   - Go to Settings → Sender Authentication
   - Verify your domain or single sender
   - Update `EMAIL_FROM_ADDRESS` to match verified sender

### Option 2: Mailgun (Alternative Production)

1. **Sign up for Mailgun**: https://signup.mailgun.com/
2. **Get API Key**:
   - Go to Sending → API Keys
   - Copy your API key

3. **Get Domain**:
   - Go to Sending → Domains
   - Use your domain (e.g., `mg.mymtaa.com`)

4. **Update `.env.local`**:
   ```env
   EMAIL_SERVICE=mailgun
   EMAIL_SERVICE_API_KEY=your_mailgun_api_key_here
   MAILGUN_DOMAIN=mg.mymtaa.com
   EMAIL_FROM_ADDRESS=noreply@mg.mymtaa.com
   FRONTEND_URL=https://mymtaa.com
   ```

### Option 3: SMTP (For Testing/Development)

#### Gmail Setup

1. **Enable 2-Factor Authentication** on your Gmail account
2. **Create App Password**:
   - Go to: https://myaccount.google.com/apppasswords
   - Select "Mail" and "Other (Custom name)"
   - Enter "MTAA Backend"
   - Copy the 16-character password

3. **Update `.env.local`**:
   ```env
   EMAIL_SERVICE=smtp
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=your-email@gmail.com
   SMTP_PASSWORD=your-16-char-app-password
   SMTP_SECURE=false
   EMAIL_FROM_ADDRESS=your-email@gmail.com
   FRONTEND_URL=http://localhost:3000
   ```

#### Other SMTP Providers

```env
# Outlook/Office 365
EMAIL_SERVICE=smtp
SMTP_HOST=smtp.office365.com
SMTP_PORT=587
SMTP_USER=your-email@outlook.com
SMTP_PASSWORD=your-password
SMTP_SECURE=false
EMAIL_FROM_ADDRESS=your-email@outlook.com

# Custom SMTP Server
EMAIL_SERVICE=smtp
SMTP_HOST=mail.yourdomain.com
SMTP_PORT=587
SMTP_USER=noreply@yourdomain.com
SMTP_PASSWORD=your-password
SMTP_SECURE=false
EMAIL_FROM_ADDRESS=noreply@yourdomain.com
```

### Option 4: Test Email Service (Free)

For testing, you can use **Ethereal Email** (free, no signup required):

1. **Generate Test Account**: https://ethereal.email/create
2. **Copy credentials** from the generated account
3. **Update `.env.local`**:
   ```env
   EMAIL_SERVICE=smtp
   SMTP_HOST=smtp.ethereal.email
   SMTP_PORT=587
   SMTP_USER=your-ethereal-username
   SMTP_PASSWORD=your-ethereal-password
   SMTP_SECURE=false
   EMAIL_FROM_ADDRESS=your-ethereal-email@ethereal.email
   FRONTEND_URL=http://localhost:3000
   ```

## Verification

After configuring, restart your backend server:

```bash
cd apps/backend
npm run dev
```

Check the console logs. You should see:
- ✅ `SendGrid email service initialized` (if using SendGrid)
- ✅ `Mailgun email service initialized` (if using Mailgun)
- ✅ `SMTP email service initialized` (if using SMTP)
- ⚠️ `Email service not configured` (if using none)

## Testing Email

### Test Registration Email

```bash
curl -X POST http://localhost:3001/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "phoneNumber": "+254712345678",
    "fullName": "Test User",
    "username": "testuser",
    "password": "Test123!"
  }'
```

Check the email inbox for the verification email.

### Test Password Reset

```bash
curl -X POST http://localhost:3001/api/v1/auth/forgot-password \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com"
  }'
```

## Production Checklist

- [ ] Choose email provider (SendGrid recommended)
- [ ] Get API key/credentials
- [ ] Verify sender domain
- [ ] Set up SPF, DKIM, DMARC records
- [ ] Update `EMAIL_FROM_ADDRESS` to verified domain
- [ ] Update `FRONTEND_URL` to production URL
- [ ] Test email delivery
- [ ] Monitor email metrics
- [ ] Set up webhooks for delivery tracking

## Troubleshooting

### Emails Not Sending

1. **Check environment variables**:
   ```bash
   cd apps/backend
   cat .env.local | grep EMAIL
   ```

2. **Check logs**: Look for email service initialization messages

3. **Verify API key**: Make sure API key is correct and has proper permissions

4. **Check sender verification**: Ensure sender email is verified with provider

### SMTP Connection Failed

1. **Check credentials**: Username and password are correct
2. **Check port**: 587 for TLS, 465 for SSL
3. **Check firewall**: Ensure SMTP port is not blocked
4. **For Gmail**: Must use App Password, not regular password

### Emails Going to Spam

1. **Set up SPF record**: `v=spf1 include:sendgrid.net ~all` (for SendGrid)
2. **Set up DKIM**: Configure in email provider dashboard
3. **Set up DMARC**: Add DMARC record to DNS
4. **Use verified domain**: Don't use free email addresses in production

## Current Status

✅ Email service is configured and ready
✅ Default: `EMAIL_SERVICE=none` (safe for development)
✅ All email templates are ready
✅ All integrations are complete

**Next Step**: Choose an email provider and update `.env.local` with your credentials.

