# 🚀 Deploy Registration Fixes

## Problem
The deployed app on your phone is using old code that has:
- ❌ Wrong API paths (double `/api/v1/`)
- ❌ Wrong database field name (`emailVerificationExpires` instead of `emailVerificationExpiresAt`)

## Solution
The fixes are already pushed to GitHub. You need to redeploy:

### Frontend (Vercel)

**Option 1: Auto-Deploy (if enabled)**
- Vercel should automatically detect the new commits
- Check: https://vercel.com/dashboard
- Look for a new deployment in progress

**Option 2: Manual Redeploy**
1. Go to: https://vercel.com/dashboard
2. Select your MTAA frontend project
3. Click "Deployments"
4. Click "Redeploy" on the latest deployment
5. Wait for deployment to complete (2-5 minutes)

### Backend (Render)

**Option 1: Auto-Deploy (if enabled)**
- Render should automatically detect the new commits
- Check: https://dashboard.render.com
- Look for a new deployment in progress

**Option 2: Manual Deploy**
1. Go to: https://dashboard.render.com
2. Select your MTAA backend service
3. Click "Manual Deploy"
4. Select "Deploy latest commit"
5. Wait for deployment to complete (5-10 minutes)

## Verify Deployment

After redeploying:

1. **Test Backend:**
   ```bash
   curl https://api.mymtaa.com/api/v1/health
   ```

2. **Test Registration:**
   - Open the app on your phone
   - Try registering with your real email
   - It should work now!

## What Was Fixed

1. **API Endpoint Paths:**
   - Before: `/api/v1/auth/register` (with base URL `/api/v1/`) = `/api/v1/api/v1/auth/register` ❌
   - After: `/auth/register` (with base URL `/api/v1/`) = `/api/v1/auth/register` ✅

2. **Database Field Name:**
   - Before: `emailVerificationExpires` ❌
   - After: `emailVerificationExpiresAt` ✅

## Quick Check

To see if your deployed app has the fixes:

1. Open browser console on your phone (if possible)
2. Look for: `[API Client] Base URL: https://api.mymtaa.com/api/v1`
3. Try registering - check network tab for the correct endpoint

---

**Note:** If auto-deploy is not enabled, you'll need to manually trigger deployments on both Vercel and Render.

