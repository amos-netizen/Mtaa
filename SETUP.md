# Mtaa Setup Guide

## Initial Setup

### 1. Install Dependencies

```bash
npm install
```

This will install dependencies for all workspaces (root, backend, frontend, mobile, and shared packages).

### 2. Environment Variables

Create `.env` files from the examples:

```bash
# Root .env
cp .env.example .env

# Backend .env
cp apps/backend/.env.example apps/backend/.env.local

# Frontend .env
cp apps/frontend/.env.example apps/frontend/.env.local

# Mobile .env (optional, can use app.json)
cp apps/mobile/.env.example apps/mobile/.env
```

**Important**: Edit these files with your actual configuration values.

### 3. Database Setup

#### Option A: Using Docker

```bash
# Start PostgreSQL and Redis
docker-compose up postgres redis -d

# Wait for services to be healthy, then run migrations
cd apps/backend
npm run prisma:generate
npm run prisma:migrate
```

#### Option B: Local PostgreSQL

1. Install PostgreSQL 15+
2. Create database:
   ```sql
   CREATE DATABASE mtaa;
   CREATE USER mtaa WITH PASSWORD 'mtaa_password';
   GRANT ALL PRIVILEGES ON DATABASE mtaa TO mtaa;
   ```
3. Run migrations:
   ```bash
   cd apps/backend
   npm run prisma:generate
   npm run prisma:migrate
   ```

### 4. Start Development Servers

#### Using Docker (All Services)

```bash
# Start all services
npm run docker:up

# View logs
npm run docker:logs
```

#### Local Development

**Terminal 1 - Backend:**
```bash
cd apps/backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd apps/frontend
npm run dev
```

**Terminal 3 - Mobile (Optional):**
```bash
cd apps/mobile
npm start
```

### 5. Verify Setup

1. **Backend API**: http://localhost:3001
2. **API Docs**: http://localhost:3001/api/docs
3. **Frontend**: http://localhost:3000
4. **Nginx Proxy** (if using Docker): http://localhost:80

## Common Issues

### Port Already in Use

If ports 3000, 3001, 5432, or 6379 are already in use:

1. Change ports in `.env` files
2. Or stop the conflicting services

### Database Connection Error

1. Verify PostgreSQL is running
2. Check `DATABASE_URL` in `.env` files
3. Ensure database and user exist
4. Check firewall settings

### Prisma Client Not Generated

```bash
cd apps/backend
npm run prisma:generate
```

### Module Not Found Errors

```bash
# Reinstall dependencies
npm install

# Rebuild packages
npm run build
```

## Next Steps

1. **Integrate SMS Service**: Update `apps/backend/src/auth/auth.service.ts` to use Safaricom SMS API
2. **Add More Features**: Follow the architecture in `TECHNICAL_SPECIFICATION.md`
3. **Configure Production**: Update environment variables for production deployment
4. **Set Up CI/CD**: Configure GitHub Actions or similar for automated deployments

## Development Workflow

1. Create feature branch
2. Make changes
3. Run linting: `npm run lint`
4. Run type checking: `npm run type-check`
5. Test locally
6. Commit and push
7. Create pull request

## Production Deployment

See the main `README.md` for deployment instructions.



