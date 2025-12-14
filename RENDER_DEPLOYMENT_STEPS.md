# 🚀 Render Backend Deployment - Step by Step

## Prerequisites
- GitHub repository with your code
- Render account (free tier available)

## Step-by-Step Instructions

### 1. Create PostgreSQL Database

1. Go to https://dashboard.render.com
2. Click **"New +"** → **"PostgreSQL"**
3. Configure:
   - **Name**: `mtaa-database`
   - **Database**: `mtaa`
   - **User**: `mtaa_user`
   - **Region**: Choose closest (e.g., `Oregon`)
   - **Plan**: `Free` (or `Starter` for production)
4. Click **"Create Database"**
5. **IMPORTANT**: Copy the **Internal Database URL** (starts with `postgresql://`)
   - This is different from the External Database URL
   - Format: `postgresql://mtaa_user:password@dpg-xxxxx-a/mtaa`

### 2. Create Web Service (Backend)

1. Click **"New +"** → **"Web Service"**
2. Connect your GitHub repository
3. Select your repository
4. Configure service:

   **Basic Settings:**
   - **Name**: `mtaa-backend`
   - **Region**: Same as database
   - **Branch**: `main` (or your main branch)
   - **Root Directory**: `apps/backend` ⚠️ **IMPORTANT**
   - **Environment**: `Node`
   - **Build Command**: 
     ```bash
     npm install && npm run build && npm run prisma:generate && npm run prisma:migrate:deploy
     ```
   - **Start Command**: 
     ```bash
     npm start
     ```

   **Advanced Settings:**
   - **Auto-Deploy**: `Yes` (deploys on git push)
   - **Plan**: `Free` (or `Starter` for production)

### 3. Set Environment Variables

In the service settings → **Environment** tab, add:

```env
NODE_ENV=production
PORT=10000
DATABASE_URL=<Paste Internal Database URL from Step 1>
JWT_SECRET=<Generate using: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))">
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=30d
FRONTEND_URL=https://your-frontend.vercel.app
```

**Generate JWT_SECRET:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 4. Deploy

1. Click **"Create Web Service"**
2. Render will:
   - Clone your repo
   - Install dependencies
   - Build the application
   - Run migrations
   - Start the service
3. Wait for deployment (5-10 minutes first time)
4. **Copy your service URL** (e.g., `https://mtaa-backend.onrender.com`)

### 5. Verify Deployment

1. Check health endpoint:
   ```bash
   curl https://your-backend.onrender.com/api/v1/health
   ```

2. Check API docs:
   ```
   https://your-backend.onrender.com/api/docs
   ```

### 6. Update Frontend URL (After Vercel Deploy)

1. Go to your Render service → **Environment**
2. Update `FRONTEND_URL` to your Vercel URL
3. Service will auto-redeploy

---

## 🔧 Troubleshooting

### Build Fails
- Check build logs in Render dashboard
- Ensure `apps/backend` is correct root directory
- Verify `package.json` has all dependencies

### Database Connection Error
- Use **Internal Database URL** (not external)
- Check database is running
- Verify DATABASE_URL format

### Migrations Fail
- Check Prisma schema is correct
- Verify DATABASE_URL is set
- Check build logs for errors

### Service Crashes
- Check logs in Render dashboard
- Verify PORT is set to 10000
- Check environment variables

---

## 📝 Notes

- **Free tier**: Services spin down after 15 minutes of inactivity
- **First request**: May take 30-60 seconds (cold start)
- **Database**: Free tier has connection limits
- **Auto-deploy**: Enabled by default on git push

---

## 🔗 Your URLs

After deployment, you'll have:
- **Backend API**: `https://mtaa-backend.onrender.com`
- **API Docs**: `https://mtaa-backend.onrender.com/api/docs`
- **Health Check**: `https://mtaa-backend.onrender.com/api/v1/health`


