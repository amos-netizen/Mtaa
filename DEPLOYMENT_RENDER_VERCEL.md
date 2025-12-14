# 🚀 Complete Deployment Guide: Render + Vercel

## 📋 Quick Overview

- **Backend**: Deploy to Render.com
- **Frontend**: Deploy to Vercel.com
- **Database**: PostgreSQL on Render

---

## 🎯 Step 1: Deploy Backend to Render

### 1.1 Create Database
1. Go to https://dashboard.render.com
2. **New +** → **PostgreSQL**
3. Settings:
   - Name: `mtaa-database`
   - Database: `mtaa`
   - User: `mtaa_user`
   - Region: `Oregon` (or closest)
   - Plan: `Free` (or `Starter`)
4. **Create Database**
5. **Copy Internal Database URL** (save this!)

### 1.2 Create Web Service
1. **New +** → **Web Service**
2. Connect GitHub repo
3. Settings:
   - **Name**: `mtaa-backend`
   - **Region**: Same as database
   - **Branch**: `main`
   - **Root Directory**: `apps/backend` ⚠️
   - **Environment**: `Node`
   - **Build Command**: 
     ```bash
     npm install && npm run build && npm run prisma:generate && npm run prisma:migrate:deploy
     ```
   - **Start Command**: 
     ```bash
     npm start
     ```

### 1.3 Environment Variables
Add these in Render → Environment:

```env
NODE_ENV=production
PORT=10000
DATABASE_URL=<Internal Database URL from Step 1.1>
JWT_SECRET=<Generate: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))">
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=30d
FRONTEND_URL=https://your-frontend.vercel.app
```

**Generate JWT_SECRET:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 1.4 Deploy
1. Click **Create Web Service**
2. Wait for deployment (5-10 min)
3. **Copy backend URL**: `https://mtaa-backend.onrender.com`

### 1.5 Verify Backend
```bash
curl https://your-backend.onrender.com/api/v1/health
```

---

## 🎨 Step 2: Deploy Frontend to Vercel

### 2.1 Create Project
1. Go to https://vercel.com
2. **Add New...** → **Project**
3. Import GitHub repo
4. Settings:
   - **Framework Preset**: `Next.js`
   - **Root Directory**: `apps/frontend` ⚠️
   - **Build Command**: `npm run build` (auto)
   - **Output Directory**: `.next` (auto)

### 2.2 Environment Variables
Before deploying, add:

```
NEXT_PUBLIC_API_URL=https://your-backend.onrender.com/api/v1
```

Replace `your-backend` with your actual Render URL.

### 2.3 Deploy
1. Click **Deploy**
2. Wait for build (2-5 min)
3. **Copy frontend URL**: `https://your-project.vercel.app`

---

## 🔗 Step 3: Connect Services

### 3.1 Update Backend CORS
1. Render Dashboard → Backend Service → Environment
2. Update `FRONTEND_URL`:
   ```
   FRONTEND_URL=https://your-project.vercel.app
   ```
3. Service will auto-redeploy

### 3.2 Verify Frontend
1. Visit your Vercel URL
2. Test registration/login
3. Check browser console for errors

---

## ✅ Final Checklist

- [ ] Backend deployed on Render
- [ ] Database created and connected
- [ ] Migrations run successfully
- [ ] Backend health check passes
- [ ] Frontend deployed on Vercel
- [ ] Environment variables set
- [ ] CORS configured
- [ ] Test user registration
- [ ] Test login
- [ ] Test all features

---

## 🔧 Troubleshooting

### Backend Issues

**Build fails:**
- Check root directory is `apps/backend`
- Verify build command is correct
- Check Render build logs

**Database connection:**
- Use Internal Database URL (not external)
- Check database is running
- Verify DATABASE_URL format

**Migrations:**
- Check build logs for migration errors
- Verify DATABASE_URL is correct
- Run migrations manually in Render Shell if needed

### Frontend Issues

**Build fails:**
- Check root directory is `apps/frontend`
- Verify all dependencies installed
- Check Vercel build logs

**API calls fail:**
- Verify `NEXT_PUBLIC_API_URL` is correct
- Check backend CORS settings
- Ensure backend URL includes `/api/v1`
- Check browser console for errors

---

## 📝 URLs After Deployment

### Backend (Render)
- API: `https://mtaa-backend.onrender.com`
- Health: `https://mtaa-backend.onrender.com/api/v1/health`
- Docs: `https://mtaa-backend.onrender.com/api/docs`

### Frontend (Vercel)
- App: `https://your-project.vercel.app`
- Custom domain: Configure in Vercel Dashboard

---

## 🎉 You're Live!

Your Mtaa app is now deployed and accessible worldwide!

**Next Steps:**
1. Set up custom domains (optional)
2. Configure monitoring
3. Set up backups
4. Enable analytics

---

## 📚 Additional Resources

- **Render Docs**: https://render.com/docs
- **Vercel Docs**: https://vercel.com/docs
- **Detailed Guides**: 
  - `RENDER_DEPLOYMENT_STEPS.md`
  - `VERCEL_DEPLOYMENT_STEPS.md`


