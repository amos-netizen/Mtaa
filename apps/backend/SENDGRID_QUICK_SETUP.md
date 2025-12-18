# 🚀 SendGrid Quick Setup Guide

## Step-by-Step Instructions

### 1. Create SendGrid Account

Visit: **https://signup.sendgrid.com/**

- Sign up with your email
- Verify your email address
- Complete the account setup

### 2. Get Your API Key

1. **Login to SendGrid Dashboard**: https://app.sendgrid.com/

2. **Navigate to API Keys**:
   - Click on **Settings** (left sidebar)
   - Click on **API Keys**

3. **Create New API Key**:
   - Click **"Create API Key"** button
   - Choose **"Full Access"** (recommended for production)
     - OR **"Restricted Access"** → Select **"Mail Send"** permission
   - Enter a name: `MTAA Production` or `MTAA Backend`
   - Click **"Create & View"**

4. **Copy Your API Key**:
   - The API key will be displayed (starts with `SG.`)
   - **⚠️ IMPORTANT**: Copy it immediately - you can only see it once!
   - Example: `SG.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`

### 3. Verify Sender Identity

Before sending emails, you need to verify your sender:

**Option A: Single Sender Verification (Quick)**
1. Go to **Settings → Sender Authentication**
2. Click **"Verify a Single Sender"**
3. Fill in your details:
   - Email: `noreply@mymtaa.com` (or your domain email)
   - Company name: MTAA
   - Address, City, State, Zip, Country
4. Click **"Create"**
5. Check your email and click the verification link

**Option B: Domain Authentication (Recommended for Production)**
1. Go to **Settings → Sender Authentication**
2. Click **"Authenticate Your Domain"**
3. Follow DNS setup instructions
4. Add SPF, DKIM records to your domain

### 4. Complete Email Configuration

Run the configuration script:

```bash
cd apps/backend
./configure-email.sh
```

When prompted:
1. Choose option **1** (SendGrid)
2. Paste your API key (starts with `SG.`)
3. Enter your FROM email address (must be verified):
   - Example: `noreply@mymtaa.com`
   - Or use your verified single sender email

### 5. Test Email Sending

After configuration, test it:

```bash
# Start backend
npm run dev

# In another terminal, test registration
curl -X POST http://localhost:3001/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "your-test-email@example.com",
    "phoneNumber": "+254712345678",
    "fullName": "Test User",
    "username": "testuser",
    "password": "Test123!"
  }'
```

Check your email inbox for the verification email!

## Free Tier Limits

SendGrid Free Tier includes:
- **100 emails/day** (forever free)
- Perfect for development and testing
- Upgrade when you need more

## Troubleshooting

### "Invalid API Key"
- Make sure you copied the entire key (starts with `SG.`)
- Check for extra spaces
- Verify the key is active in SendGrid dashboard

### "Sender not verified"
- Verify your sender email in SendGrid dashboard
- Check spam folder for verification email
- Use the exact verified email in `EMAIL_FROM_ADDRESS`

### "Emails not sending"
- Check SendGrid Activity Feed: https://app.sendgrid.com/activity
- Look for error messages
- Verify API key has "Mail Send" permission

### "Rate limit exceeded"
- Free tier: 100 emails/day
- Check your usage in SendGrid dashboard
- Wait 24 hours or upgrade plan

## Production Checklist

- [ ] SendGrid account created
- [ ] API key generated and saved securely
- [ ] Sender email verified
- [ ] Domain authenticated (recommended)
- [ ] SPF/DKIM records configured
- [ ] Email configuration added to `.env.local`
- [ ] Test email sent successfully
- [ ] Monitor SendGrid activity feed

## Security Best Practices

1. **Never commit API keys to Git**
   - Keep them in `.env.local` (already in `.gitignore`)
   - Use environment variables in production

2. **Use Restricted Access API Keys**
   - Only grant "Mail Send" permission
   - Create separate keys for different environments

3. **Rotate API Keys Regularly**
   - Change keys every 90 days
   - Revoke old keys immediately

4. **Monitor Usage**
   - Check SendGrid dashboard regularly
   - Set up alerts for unusual activity

---

**Need Help?**
- SendGrid Docs: https://docs.sendgrid.com/
- SendGrid Support: https://support.sendgrid.com/

