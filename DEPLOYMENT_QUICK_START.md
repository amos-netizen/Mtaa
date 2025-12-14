# 🚀 Quick Deployment Guide

## ✅ Pre-Deployment Status

- ✅ Backend builds successfully
- ✅ Frontend builds successfully
- ✅ All features implemented
- ✅ Dockerfiles ready
- ✅ Environment templates created

## 🚀 Quick Deploy Options

### Option 1: Docker Compose (Easiest)

```bash
# 1. Set environment variables
cp .env.example .env
# Edit .env with your values

# 2. Start all services
docker-compose up -d --build

# 3. Run migrations
docker-compose exec backend npm run prisma:migrate:deploy

# 4. Access
# Frontend: http://localhost:3000
# Backend: http://localhost:3001
# API Docs: http://localhost:3001/api/docs
```

### Option 2: Vercel (Frontend) + Railway (Backend)

#### Frontend on Vercel:
```bash
cd apps/frontend
npm i -g vercel
vercel
# Follow prompts, set NEXT_PUBLIC_API_URL
```

#### Backend on Railway:
1. Connect GitHub repo
2. Set root directory: `apps/backend`
3. Build command: `npm install && npm run build && npm run prisma:generate`
4. Start command: `npm start`
5. Set environment variables (see DEPLOYMENT.md)

### Option 3: Render (Full Stack)

1. Create Web Service for Backend
   - Build: `cd apps/backend && npm install && npm run build && npm run prisma:generate`
   - Start: `cd apps/backend && npm start`

2. Create Web Service for Frontend
   - Build: `cd apps/frontend && npm install && npm run build`
   - Start: `cd apps/frontend && npm start`

## 🔑 Required Environment Variables

### Backend
```env
DATABASE_URL=postgresql://user:pass@host:5432/mtaa
JWT_SECRET=your-32-char-secret-key
FRONTEND_URL=https://your-frontend.com
```

### Frontend
```env
NEXT_PUBLIC_API_URL=https://your-backend.com/api/v1
```

## 📝 Post-Deployment

1. Run migrations: `npm run prisma:migrate:deploy`
2. Test health endpoint: `curl https://your-backend.com/api/v1/health`
3. Verify frontend loads
4. Test authentication flow
5. Test all features

## 📚 Full Documentation

See `DEPLOYMENT.md` for complete deployment guide.


