# Vercel Frontend Deployment Guide

## Environment Variables

### Required for Production

Set the following environment variable in **Vercel Dashboard**:

1. Go to your project in Vercel Dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Add the following:

| Variable | Value |
|----------|-------|
| `NEXT_PUBLIC_API_URL` | `https://mtaa-16.onrender.com/api/v1` |

### For Local Development

Create a `.env.local` file in `apps/frontend/`:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

**Note**: `.env.local` is gitignored and should not be committed.

## Deployment Steps

1. **Connect Repository to Vercel**
   - Import your GitHub repository
   - Vercel will auto-detect Next.js

2. **Configure Project Settings**
   - **Root Directory**: `apps/frontend`
   - **Framework Preset**: Next.js
   - **Build Command**: `cd ../.. && npm install && cd apps/frontend && npm run build`
   - **Output Directory**: `.next`
   - **Install Command**: `cd ../.. && npm install`

3. **Set Environment Variables**
   - Add `NEXT_PUBLIC_API_URL=https://mtaa-16.onrender.com/api/v1`
   - Apply to: **Production**, **Preview**, and **Development** (or just Production if you prefer)

4. **Deploy**
   - Push to your main branch or manually trigger deployment
   - Vercel will build and deploy automatically

## Verification

After deployment, verify:
- Frontend loads: `https://your-app.vercel.app`
- API calls work: Check browser console for successful API requests
- No CORS errors: Backend should have `FRONTEND_URL` set to your Vercel URL

## Backend CORS Configuration

Make sure your backend on Render has:
```
FRONTEND_URL=https://your-app.vercel.app
```

This allows the frontend to make API calls to the backend.






