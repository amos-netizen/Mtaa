# 🚀 Deploy to Render (Backend) + Vercel (Frontend)

## 📋 Overview

This guide will help you deploy:
- **Backend** → Render.com
- **Frontend** → Vercel.com

---

## 🔧 Part 1: Deploy Backend to Render

### Step 1: Create Render Account
1. Go to https://render.com
2. Sign up / Login
3. Connect your GitHub account

### Step 2: Create PostgreSQL Database
1. In Render Dashboard, click **"New +"** → **"PostgreSQL"**
2. Name: `mtaa-database`
3. Database: `mtaa`
4. User: `mtaa_user`
5. Region: Choose closest to your users
6. Plan: Free tier (or paid for production)
7. Click **"Create Database"**
8. **Save the Internal Database URL** (you'll need it)

### Step 3: Create Backend Web Service
1. In Render Dashboard, click **"New +"** → **"Web Service"**
2. Connect your GitHub repository
3. Configure:
   - **Name**: `mtaa-backend`
   - **Region**: Same as database
   - **Branch**: `main` (or your main branch)
   - **Root Directory**: `apps/backend`
   - **Environment**: `Node`
   - **Build Command**: 
     ```bash
     npm install && npm run build && npm run prisma:generate
     ```
   - **Start Command**: 
     ```bash
     npm start
     ```

### Step 4: Set Environment Variables
In Render Dashboard → Your Service → Environment:

```env
NODE_ENV=production
PORT=10000
DATABASE_URL=<Your PostgreSQL Internal Database URL from Step 2>
JWT_SECRET=<Generate a 32+ character random string>
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=30d
FRONTEND_URL=https://your-frontend.vercel.app
```

**To generate JWT_SECRET:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Step 5: Deploy
1. Click **"Create Web Service"**
2. Render will build and deploy automatically
3. Wait for deployment to complete
4. **Copy your backend URL** (e.g., `https://mtaa-backend.onrender.com`)

### Step 6: Run Database Migrations
1. In Render Dashboard → Your Service → **Shell**
2. Run:
   ```bash
   npm run prisma:migrate:deploy
   ```

**OR** add to build command:
```bash
npm install && npm run build && npm run prisma:generate && npm run prisma:migrate:deploy
```

---

## 🎨 Part 2: Deploy Frontend to Vercel

### Step 1: Install Vercel CLI
```bash
npm i -g vercel
```

### Step 2: Login to Vercel
```bash
vercel login
```

### Step 3: Deploy Frontend
```bash
cd apps/frontend
vercel
```

Follow the prompts:
- **Set up and deploy?** → Yes
- **Which scope?** → Your account
- **Link to existing project?** → No
- **What's your project's name?** → `mtaa-frontend` (or your choice)
- **In which directory is your code located?** → `./`
- **Want to override settings?** → No

### Step 4: Set Environment Variables
1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
2. Add:
   ```
   NEXT_PUBLIC_API_URL=https://your-backend-url.onrender.com/api/v1
   ```
   Replace `your-backend-url` with your actual Render backend URL

### Step 5: Redeploy
After setting environment variables:
```bash
vercel --prod
```

**OR** in Vercel Dashboard → Deployments → Click "Redeploy"

---

## 🔗 Part 3: Connect Services

### Update Backend CORS
1. In Render Dashboard → Your Backend Service → Environment Variables
2. Update `FRONTEND_URL` to your Vercel frontend URL:
   ```
   FRONTEND_URL=https://your-frontend.vercel.app
   ```
3. Redeploy backend

### Update Frontend API URL
1. In Vercel Dashboard → Your Project → Environment Variables
2. Ensure `NEXT_PUBLIC_API_URL` points to your Render backend:
   ```
   NEXT_PUBLIC_API_URL=https://your-backend.onrender.com/api/v1
   ```
3. Redeploy frontend

---

## ✅ Verification

### Test Backend
```bash
curl https://your-backend.onrender.com/api/v1/health
```

Should return:
```json
{"status":"ok","timestamp":"...","uptime":...}
```

### Test Frontend
1. Visit: `https://your-frontend.vercel.app`
2. Should load the home page
3. Try registering a new user
4. Test login

---

## 🔧 Troubleshooting

### Backend Issues

**Build Fails:**
- Check build logs in Render
- Ensure `apps/backend` is correct root directory
- Verify all dependencies are in `package.json`

**Database Connection:**
- Use **Internal Database URL** (not external)
- Format: `postgresql://user:pass@host:5432/dbname`
- Check database is running in Render

**Migrations:**
- Run migrations in Render Shell
- Or add to build command

### Frontend Issues

**API Calls Fail:**
- Check `NEXT_PUBLIC_API_URL` is set correctly
- Ensure backend URL includes `/api/v1`
- Check CORS settings in backend

**Build Errors:**
- Check Vercel build logs
- Ensure all dependencies are installed
- Verify TypeScript compiles

---

## 📝 Environment Variables Summary

### Render (Backend)
```env
NODE_ENV=production
PORT=10000
DATABASE_URL=postgresql://user:pass@host:5432/mtaa
JWT_SECRET=your-32-char-secret
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=30d
FRONTEND_URL=https://your-frontend.vercel.app
```

### Vercel (Frontend)
```env
NEXT_PUBLIC_API_URL=https://your-backend.onrender.com/api/v1
```

---

## 🎯 Quick Reference

### Render Backend URL
- Format: `https://your-service-name.onrender.com`
- Health: `https://your-service-name.onrender.com/api/v1/health`
- Docs: `https://your-service-name.onrender.com/api/docs`

### Vercel Frontend URL
- Format: `https://your-project-name.vercel.app`
- Custom domain: Configure in Vercel Dashboard

---

## 🚀 Post-Deployment

1. ✅ Test user registration
2. ✅ Test login
3. ✅ Test all 9 main features
4. ✅ Check API documentation
5. ✅ Monitor logs in both platforms
6. ✅ Set up custom domains (optional)

**You're live! 🎉**


