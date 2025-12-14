# ⚡ Quick Deploy: Render + Vercel

## 🎯 TL;DR

**Backend (Render):**
- Root: `apps/backend`
- Build: `npm install && npm run build && npm run prisma:generate && npm run prisma:migrate:deploy`
- Start: `npm start`
- Port: `10000`

**Frontend (Vercel):**
- Root: `apps/frontend`
- Build: `npm run build` (auto)
- Env: `NEXT_PUBLIC_API_URL=https://your-backend.onrender.com/api/v1`

---

## 📝 Environment Variables

### Render Backend
```env
NODE_ENV=production
PORT=10000
DATABASE_URL=<Internal DB URL>
JWT_SECRET=<32-char-random>
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=30d
FRONTEND_URL=https://your-frontend.vercel.app
```

### Vercel Frontend
```env
NEXT_PUBLIC_API_URL=https://your-backend.onrender.com/api/v1
```

---

## 🚀 Deploy Steps

1. **Render**: Create DB → Create Web Service → Set env vars → Deploy
2. **Vercel**: Import repo → Set root to `apps/frontend` → Set env var → Deploy
3. **Connect**: Update `FRONTEND_URL` in Render with Vercel URL

**Full guide**: See `DEPLOYMENT_RENDER_VERCEL.md`

