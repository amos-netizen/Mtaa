# ⚡ Quick Email Setup

## Current Status

✅ Email service is **configured and ready**
⚠️  Currently set to `EMAIL_SERVICE=none` (safe default - emails logged but not sent)

## 🚀 Quick Setup (Choose One)

### Option 1: Interactive Setup Script (Easiest)

```bash
cd apps/backend
./configure-email.sh
```

Follow the prompts to configure your email provider.

### Option 2: Manual Configuration

Edit `apps/backend/.env.local` and add:

#### For SendGrid (Recommended):
```env
EMAIL_SERVICE=sendgrid
EMAIL_SERVICE_API_KEY=SG.your_api_key_here
EMAIL_FROM_ADDRESS=noreply@mymtaa.com
FRONTEND_URL=https://mymtaa.com
```

#### For Mailgun:
```env
EMAIL_SERVICE=mailgun
EMAIL_SERVICE_API_KEY=your_api_key_here
MAILGUN_DOMAIN=mg.mymtaa.com
EMAIL_FROM_ADDRESS=noreply@mg.mymtaa.com
FRONTEND_URL=https://mymtaa.com
```

#### For SMTP (Gmail):
```env
EMAIL_SERVICE=smtp
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
SMTP_SECURE=false
EMAIL_FROM_ADDRESS=your-email@gmail.com
FRONTEND_URL=https://mymtaa.com
```

## 📝 Get API Keys

### SendGrid
1. Sign up: https://signup.sendgrid.com/
2. Go to: Settings → API Keys
3. Create new API key
4. Copy key (starts with `SG.`)

### Mailgun
1. Sign up: https://signup.mailgun.com/
2. Go to: Sending → API Keys
3. Copy your API key
4. Get domain from: Sending → Domains

### Gmail App Password
1. Enable 2FA on Gmail
2. Go to: https://myaccount.google.com/apppasswords
3. Create app password for "Mail"
4. Use the 16-character password

## ✅ Verify Configuration

After updating `.env.local`, restart the backend:

```bash
cd apps/backend
npm run dev
```

Look for one of these messages in the console:
- ✅ `SendGrid email service initialized`
- ✅ `Mailgun email service initialized`
- ✅ `SMTP email service initialized`
- ⚠️ `Email service not configured` (if using `none`)

## 🧪 Test Email

```bash
# Test registration (sends verification email)
curl -X POST http://localhost:3001/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "your-email@example.com",
    "phoneNumber": "+254712345678",
    "fullName": "Test User",
    "username": "testuser",
    "password": "Test123!"
  }'
```

Check your email inbox for the verification email!

## 📚 More Details

See `EMAIL_CONFIGURATION_GUIDE.md` for:
- Detailed setup instructions
- Troubleshooting guide
- Production checklist
- Security best practices

---

**Current Configuration**: `EMAIL_SERVICE=none` (emails logged, not sent)
**Next Step**: Run `./configure-email.sh` or manually edit `.env.local`

