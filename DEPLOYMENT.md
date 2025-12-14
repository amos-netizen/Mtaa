# 🚀 Mtaa Deployment Guide

## 📋 Pre-Deployment Checklist

- [x] All features implemented and tested
- [x] Build scripts configured
- [x] Environment variables documented
- [x] Dockerfiles created
- [x] Database migrations ready

## 🏗️ Build Commands

### Backend
```bash
cd apps/backend
npm run build          # Build TypeScript
npm run prisma:generate # Generate Prisma Client
npm run prisma:migrate:deploy # Deploy migrations
npm start              # Start production server
```

### Frontend
```bash
cd apps/frontend
npm run build          # Build Next.js app
npm start              # Start production server
```

## 🌐 Deployment Options

### Option 1: Docker Compose (Recommended for VPS)

#### Prerequisites
- Docker & Docker Compose installed
- Domain name (optional)

#### Steps

1. **Clone repository**
```bash
git clone <your-repo-url>
cd Mtaa
```

2. **Set environment variables**
```bash
cp .env.example .env
# Edit .env with your production values
```

3. **Build and start**
```bash
docker-compose up -d --build
```

4. **Run migrations**
```bash
docker-compose exec backend npm run prisma:migrate:deploy
```

5. **Access services**
- Frontend: http://your-domain.com (or http://localhost:3000)
- Backend API: http://your-domain.com/api (or http://localhost:3001)
- API Docs: http://your-domain.com/api/docs

---

### Option 2: Vercel (Frontend) + Railway/Render (Backend)

#### Frontend on Vercel

1. **Install Vercel CLI**
```bash
npm i -g vercel
```

2. **Deploy**
```bash
cd apps/frontend
vercel
```

3. **Set environment variables in Vercel Dashboard**
- `NEXT_PUBLIC_API_URL` = Your backend URL

4. **Configure `vercel.json`** (created below)

#### Backend on Railway/Render

1. **Connect repository** to Railway/Render
2. **Set build command**: `cd apps/backend && npm install && npm run build && npm run prisma:generate`
3. **Set start command**: `cd apps/backend && npm start`
4. **Set environment variables** (see below)
5. **Deploy**

---

### Option 3: Railway (Full Stack)

1. **Install Railway CLI**
```bash
npm i -g @railway/cli
railway login
```

2. **Initialize project**
```bash
railway init
```

3. **Deploy backend**
```bash
cd apps/backend
railway up
```

4. **Deploy frontend**
```bash
cd apps/frontend
railway up
```

5. **Set environment variables** in Railway dashboard

---

### Option 4: Render (Full Stack)

1. **Create services in Render Dashboard**

2. **Backend Service**
   - Build Command: `cd apps/backend && npm install && npm run build && npm run prisma:generate`
   - Start Command: `cd apps/backend && npm start`
   - Environment: Node

3. **Frontend Service**
   - Build Command: `cd apps/frontend && npm install && npm run build`
   - Start Command: `cd apps/frontend && npm start`
   - Environment: Node

---

## 🔐 Environment Variables

### Backend (.env)

```env
# Server
NODE_ENV=production
PORT=3001

# Database
DATABASE_URL=postgresql://user:password@host:5432/mtaa

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=30d

# CORS
FRONTEND_URL=https://your-frontend-domain.com

# Optional: Redis
REDIS_URL=redis://host:6379

# Optional: SMS Service
SMS_API_KEY=your-sms-api-key
SMS_API_SECRET=your-sms-api-secret
```

### Frontend (.env.local)

```env
NEXT_PUBLIC_API_URL=https://your-backend-domain.com/api/v1
```

---

## 🗄️ Database Setup

### Production Database (PostgreSQL)

1. **Create database**
```sql
CREATE DATABASE mtaa;
CREATE USER mtaa_user WITH PASSWORD 'secure_password';
GRANT ALL PRIVILEGES ON DATABASE mtaa TO mtaa_user;
```

2. **Run migrations**
```bash
cd apps/backend
npm run prisma:migrate:deploy
```

3. **Seed data (optional)**
```bash
npm run prisma:seed
```

---

## 📦 Build & Test Locally

### Test Production Build

```bash
# Backend
cd apps/backend
npm run build
npm run prisma:generate
NODE_ENV=production npm start

# Frontend (new terminal)
cd apps/frontend
npm run build
NODE_ENV=production npm start
```

---

## 🔄 CI/CD Setup

### GitHub Actions Example

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy-backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm install
      - run: cd apps/backend && npm run build
      - run: cd apps/backend && npm run prisma:generate
      # Add deployment steps here

  deploy-frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm install
      - run: cd apps/frontend && npm run build
      # Add deployment steps here
```

---

## 🐳 Docker Commands

### Build Images
```bash
# Backend
docker build -f apps/backend/Dockerfile -t mtaa-backend .

# Frontend
docker build -f apps/frontend/Dockerfile -t mtaa-frontend .
```

### Run Containers
```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down

# Rebuild and restart
docker-compose up -d --build
```

---

## 🔍 Post-Deployment Verification

1. **Health Check**
```bash
curl https://your-backend-domain.com/api/v1/health
```

2. **API Documentation**
Visit: `https://your-backend-domain.com/api/docs`

3. **Frontend**
Visit: `https://your-frontend-domain.com`

4. **Test Features**
- Register/Login
- Create posts
- Marketplace listings
- Job applications
- Service bookings

---

## 🛠️ Troubleshooting

### Build Failures
- Check Node version (18+)
- Clear node_modules and reinstall
- Check environment variables

### Database Connection
- Verify DATABASE_URL format
- Check firewall rules
- Ensure database is accessible

### CORS Issues
- Set FRONTEND_URL in backend .env
- Check CORS configuration

### Prisma Issues
```bash
cd apps/backend
npm run prisma:generate
npm run prisma:migrate:deploy
```

---

## 📊 Monitoring

### Recommended Tools
- **Uptime**: UptimeRobot, Pingdom
- **Logs**: Logtail, Datadog
- **Errors**: Sentry
- **Analytics**: Google Analytics, Plausible

---

## 🔒 Security Checklist

- [ ] Change JWT_SECRET to strong random value
- [ ] Use HTTPS (SSL certificates)
- [ ] Set secure CORS origins
- [ ] Enable rate limiting
- [ ] Use environment variables (never commit secrets)
- [ ] Regular security updates
- [ ] Database backups enabled
- [ ] Firewall configured

---

## 📝 Next Steps

1. Set up domain and SSL
2. Configure monitoring
3. Set up backups
4. Enable CDN (Cloudflare)
5. Configure email service
6. Set up SMS service (Safaricom)
7. Configure payment gateway (M-Pesa)

---

## 🆘 Support

For deployment issues:
1. Check logs: `docker-compose logs`
2. Verify environment variables
3. Test builds locally first
4. Check service health endpoints
