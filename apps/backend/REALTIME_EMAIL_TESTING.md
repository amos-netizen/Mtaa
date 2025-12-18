# 🚀 Real-Time Email Testing Guide

## Overview

This guide shows you how to test all email functionality in real-time. All emails are sent **immediately** and **asynchronously** when events occur.

## ✅ Email Features Implemented

### 1. User Registration Verification ✅
- **Trigger**: User registers with email
- **Endpoint**: `POST /api/v1/auth/register`
- **Email Sent**: Immediately after registration
- **Content**: Verification link (expires in 24 hours)

### 2. Password Reset ✅
- **Trigger**: User requests password reset
- **Endpoint**: `POST /api/v1/auth/forgot-password`
- **Email Sent**: Immediately when requested
- **Content**: Reset link (expires in 1 hour)

### 3. Emergency Alerts ✅
- **Trigger**: User creates safety alert
- **Endpoint**: `POST /api/v1/posts` (type: `SAFETY_ALERT`)
- **Email Sent**: Immediately to all neighborhood members
- **Content**: Alert details, type, location

### 4. Job Applications ✅
- **Trigger**: User applies for a job
- **Endpoint**: `POST /api/v1/jobs/:id/apply`
- **Email Sent**: Immediately to employer
- **Content**: Applicant name, job title, cover letter

### 5. Service Bookings ✅
- **Trigger**: User books a service
- **Endpoint**: `POST /api/v1/services/:id/book`
- **Email Sent**: Immediately to service provider
- **Content**: Customer name, service title, booking details

### 6. Marketplace Updates ✅
- **Trigger**: Item marked as sold or interest shown
- **Endpoint**: `PUT /api/v1/marketplace/listings/:id/sold`
- **Email Sent**: Immediately to seller
- **Content**: Buyer info, listing details

### 7. Message Notifications ✅
- **Trigger**: User receives new message
- **Email Sent**: Immediately to recipient
- **Content**: Sender name, message preview

## 🧪 Testing Instructions

### Prerequisites

1. **Configure Email Provider**:
   ```bash
   cd apps/backend
   # Edit .env.local and add your email provider credentials
   EMAIL_SERVICE=sendgrid  # or mailgun, smtp
   EMAIL_SERVICE_API_KEY=your_key_here
   EMAIL_FROM_ADDRESS=noreply@mymtaa.com
   ```

2. **Start Backend Server**:
   ```bash
   npm run dev
   ```

3. **Check Email Service Status**:
   Look for one of these in console logs:
   - ✅ `SendGrid email service initialized`
   - ✅ `Mailgun email service initialized`
   - ✅ `SMTP email service initialized`

### Test 1: User Registration Verification

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

**Expected Result**:
- ✅ User created successfully
- ✅ Verification email sent immediately
- ✅ Check email inbox for verification link
- ✅ Email subject: "Verify Your Email Address - MTAA"

### Test 2: Password Reset

```bash
curl -X POST http://localhost:3001/api/v1/auth/forgot-password \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com"
  }'
```

**Expected Result**:
- ✅ Password reset email sent immediately
- ✅ Check email inbox for reset link
- ✅ Email subject: "Reset Your Password - MTAA"
- ✅ Link expires in 1 hour

### Test 3: Emergency Alert

First, get auth token:
```bash
TOKEN=$(curl -X POST http://localhost:3001/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test123!"
  }' | jq -r '.accessToken')
```

Then create alert:
```bash
curl -X POST http://localhost:3001/api/v1/posts \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "title": "Power Outage Scheduled",
    "description": "Kenya Power has scheduled maintenance from 9 AM to 5 PM",
    "neighborhoodId": "your-neighborhood-id",
    "type": "SAFETY_ALERT",
    "category": "POWER_OUTAGE"
  }'
```

**Expected Result**:
- ✅ Alert created successfully
- ✅ Emails sent immediately to all neighborhood members
- ✅ Check email inboxes for alert notification
- ✅ Email subject: "🚨 Emergency Alert: Power Outage Scheduled - [Neighborhood]"

### Test 4: Job Application

```bash
curl -X POST http://localhost:3001/api/v1/jobs/job-id-here/apply \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "coverLetter": "I am very interested in this position..."
  }'
```

**Expected Result**:
- ✅ Application submitted successfully
- ✅ Email sent immediately to job employer
- ✅ Check employer's email inbox
- ✅ Email subject: "New Application for [Job Title] - MTAA"

### Test 5: Service Booking

```bash
curl -X POST http://localhost:3001/api/v1/services/service-id-here/book \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "message": "I need plumbing services urgently",
    "preferredDate": "2024-12-20",
    "preferredTime": "10:00"
  }'
```

**Expected Result**:
- ✅ Booking created successfully
- ✅ Email sent immediately to service provider
- ✅ Check provider's email inbox
- ✅ Email subject: "New Booking: [Service Title] - MTAA"

### Test 6: Marketplace Item Sold

```bash
curl -X PUT http://localhost:3001/api/v1/marketplace/listings/listing-id-here/sold \
  -H "Authorization: Bearer $TOKEN"
```

**Expected Result**:
- ✅ Listing marked as sold
- ✅ Email sent immediately to seller
- ✅ Check seller's email inbox
- ✅ Email subject: "🎉 Your item '[Item Title]' has been purchased!"

## 📊 Email Sending Flow

### Real-Time Process:

1. **Event Occurs** (e.g., user registers)
2. **Email Service Called** (async, non-blocking)
3. **Email Queued** (using `sendEmailAsync`)
4. **Email Sent Immediately** (in background)
5. **Result Logged** (success/failure in console)

### Async Implementation:

```typescript
// All emails use this pattern:
this.emailService.sendEmailAsync(
  () => this.emailService.sendVerificationEmail(...),
  'Context Name'
);
```

**Benefits**:
- ✅ Non-blocking (API responds immediately)
- ✅ Real-time sending (emails sent instantly)
- ✅ Error handling (failures logged, don't break app)
- ✅ Comprehensive logging

## 🔍 Monitoring Email Sending

### Check Backend Logs

Look for these log messages:

**Success**:
```
[EmailService] SendGrid email service initialized
[User Registration Verification] Email sent successfully: msg-12345
```

**Failure**:
```
[EmailService] Email service not configured
[Job Application Notification] Email failed: Invalid API key
```

### Check Email Provider Dashboard

- **SendGrid**: https://app.sendgrid.com/activity
- **Mailgun**: https://app.mailgun.com/app/logs
- **SMTP**: Check your email provider's sent folder

## 🎯 Real-Time Verification

### Quick Test Checklist

- [ ] User registration → Verification email received
- [ ] Password reset request → Reset email received
- [ ] Emergency alert created → Neighborhood emails received
- [ ] Job application submitted → Employer email received
- [ ] Service booked → Provider email received
- [ ] Marketplace item sold → Seller email received

### Timing Verification

All emails should be received **within seconds** of the triggering event:
- ✅ Registration email: < 5 seconds
- ✅ Password reset: < 5 seconds
- ✅ Emergency alerts: < 10 seconds (multiple recipients)
- ✅ Job applications: < 5 seconds
- ✅ Service bookings: < 5 seconds

## 🐛 Troubleshooting

### Emails Not Sending

1. **Check Configuration**:
   ```bash
   cat apps/backend/.env.local | grep EMAIL
   ```

2. **Check Logs**: Look for initialization messages

3. **Verify API Key**: Test with email provider dashboard

4. **Check Network**: Ensure backend can reach email provider

### Emails Delayed

- Check email provider status
- Verify rate limits not exceeded
- Check backend server resources

### Email in Spam

- Verify sender domain
- Set up SPF/DKIM records
- Use verified sender address

## 📝 Example Test Script

Save this as `test-emails.sh`:

```bash
#!/bin/bash

BASE_URL="http://localhost:3001"
EMAIL="test@example.com"

echo "Testing Email Functionality..."
echo ""

# Test 1: Registration
echo "1. Testing Registration Email..."
curl -X POST $BASE_URL/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"$EMAIL\",\"phoneNumber\":\"+254712345678\",\"fullName\":\"Test User\",\"username\":\"testuser\",\"password\":\"Test123!\"}"

echo ""
echo "✅ Check $EMAIL for verification email"
echo ""

# Test 2: Password Reset
echo "2. Testing Password Reset Email..."
curl -X POST $BASE_URL/api/v1/auth/forgot-password \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"$EMAIL\"}"

echo ""
echo "✅ Check $EMAIL for password reset email"
echo ""

echo "Tests completed! Check your email inbox."
```

Run with: `chmod +x test-emails.sh && ./test-emails.sh`

## ✅ Success Indicators

When emails are working correctly, you should see:

1. **Backend Logs**:
   - Email service initialized
   - Email sent successfully messages

2. **Email Inbox**:
   - Emails received within seconds
   - Proper formatting and links
   - Correct sender address

3. **API Responses**:
   - Fast response times (emails don't block)
   - Success status codes
   - No errors in response

---

**All email functionality is now real-time and ready for testing!** 🎉

