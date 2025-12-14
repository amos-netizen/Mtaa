# 🎨 Vercel Frontend Deployment - Step by Step

## Prerequisites
- GitHub repository with your code
- Vercel account (free tier available)
- Backend deployed on Render (for API URL)

## Step-by-Step Instructions

### Option 1: Deploy via Vercel Dashboard (Recommended)

#### 1. Create Vercel Account
1. Go to https://vercel.com
2. Sign up / Login
3. Connect your GitHub account

#### 2. Import Project
1. Click **"Add New..."** → **"Project"**
2. Select your GitHub repository
3. Configure project:

   **Framework Preset:**
   - **Framework**: `Next.js` (auto-detected)

   **Root Directory:**
   - Click **"Edit"**
   - Set to: `apps/frontend` ⚠️ **IMPORTANT**

   **Build and Output Settings:**
   - **Build Command**: `npm run build` (auto-detected)
   - **Output Directory**: `.next` (auto-detected)
   - **Install Command**: `npm install` (auto-detected)

#### 3. Set Environment Variables
Before deploying, add environment variable:

1. In project settings → **Environment Variables**
2. Add:
   ```
   Name: NEXT_PUBLIC_API_URL
   Value: https://your-backend.onrender.com/api/v1
   ```
   Replace `your-backend` with your actual Render backend URL

3. Select environments: **Production**, **Preview**, **Development**

#### 4. Deploy
1. Click **"Deploy"**
2. Wait for build to complete (2-5 minutes)
3. **Copy your deployment URL** (e.g., `https://mtaa-frontend.vercel.app`)

---

### Option 2: Deploy via CLI

#### 1. Install Vercel CLI
```bash
npm i -g vercel
```

#### 2. Login
```bash
vercel login
```

#### 3. Navigate to Frontend
```bash
cd apps/frontend
```

#### 4. Deploy
```bash
vercel
```

Follow prompts:
- **Set up and deploy?** → `Y`
- **Which scope?** → Your account
- **Link to existing project?** → `N`
- **Project name?** → `mtaa-frontend`
- **Directory?** → `./`
- **Override settings?** → `N`

#### 5. Set Environment Variable
```bash
vercel env add NEXT_PUBLIC_API_URL
# Enter: https://your-backend.onrender.com/api/v1
# Select: Production, Preview, Development
```

#### 6. Deploy to Production
```bash
vercel --prod
```

---

## 🔧 Configuration

### Root Directory
Vercel needs to know the frontend is in `apps/frontend`:

**Option 1: Via Dashboard**
- Project Settings → General → Root Directory → `apps/frontend`

**Option 2: Via `vercel.json`**
Already configured in `apps/frontend/vercel.json`

### Environment Variables
Required:
```
NEXT_PUBLIC_API_URL=https://your-backend.onrender.com/api/v1
```

Optional:
```
NEXT_PUBLIC_GA_ID=your-google-analytics-id
NEXT_PUBLIC_SENTRY_DSN=your-sentry-dsn
```

---

## ✅ Verification

1. Visit your Vercel URL: `https://your-project.vercel.app`
2. Should see the Mtaa home page
3. Try registering a new user
4. Check browser console for errors
5. Test API calls work

---

## 🔧 Troubleshooting

### Build Fails
- Check build logs in Vercel dashboard
- Ensure root directory is `apps/frontend`
- Verify all dependencies in `package.json`
- Check TypeScript errors

### API Calls Fail
- Verify `NEXT_PUBLIC_API_URL` is set correctly
- Check backend URL includes `/api/v1`
- Ensure backend CORS allows Vercel domain
- Check browser console for CORS errors

### 404 Errors
- Verify routes exist in `apps/frontend/src/app`
- Check Next.js routing configuration
- Ensure pages are exported correctly

---

## 🔗 Your URLs

After deployment:
- **Frontend**: `https://your-project.vercel.app`
- **Custom Domain**: Configure in Vercel Dashboard → Settings → Domains

---

## 📝 Notes

- **Auto-deploy**: Enabled by default on git push to main branch
- **Preview deployments**: Created for every pull request
- **Free tier**: Unlimited deployments
- **Custom domains**: Free SSL included

---

## 🔄 Updating Deployment

### Automatic (Recommended)
- Push to `main` branch → Auto-deploys

### Manual
```bash
cd apps/frontend
vercel --prod
```

### Update Environment Variables
1. Vercel Dashboard → Project → Settings → Environment Variables
2. Update value
3. Redeploy (automatic or manual)


