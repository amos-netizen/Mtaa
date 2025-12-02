# Mtaa Project - Complete Setup Guide

Complete terminal commands to set up and install ALL parts of the Mtaa project on a fresh machine.

---

## 1. SYSTEM SETUP

### 1.1 Install Node.js (Latest LTS)

**Linux (Ubuntu/Debian):**
```bash
curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
sudo apt-get install -y nodejs
node --version
npm --version
```

**Linux (Fedora/RHEL):**
```bash
curl -fsSL https://rpm.nodesource.com/setup_lts.x | sudo bash -
sudo dnf install -y nodejs
node --version
npm --version
```

**macOS (using Homebrew):**
```bash
brew install node@lts
brew link node@lts
node --version
npm --version
```

**Windows (PowerShell - using Chocolatey):**
```powershell
choco install nodejs-lts -y
node --version
npm --version
```

**Windows (PowerShell - using winget):**
```powershell
winget install OpenJS.NodeJS.LTS
node --version
npm --version
```

**Windows (PowerShell - Manual Install):**
1. Download from https://nodejs.org/
2. Run installer
3. Verify:
```powershell
node --version
npm --version
```

---

### 1.2 Install pnpm (Recommended) or Use npm

**Linux/macOS:**
```bash
# Option 1: Install pnpm
npm install -g pnpm
pnpm --version

# Option 2: Use npm (already installed with Node.js)
npm --version
```

**Windows (PowerShell):**
```powershell
# Option 1: Install pnpm
npm install -g pnpm
pnpm --version

# Option 2: Use npm (already installed with Node.js)
npm --version
```

---

### 1.3 Install Git

**Linux (Ubuntu/Debian):**
```bash
sudo apt-get update
sudo apt-get install -y git
git --version
```

**Linux (Fedora/RHEL):**
```bash
sudo dnf install -y git
git --version
```

**macOS:**
```bash
# Git usually pre-installed, if not:
brew install git
git --version
```

**Windows (PowerShell - using Chocolatey):**
```powershell
choco install git -y
git --version
```

**Windows (PowerShell - using winget):**
```powershell
winget install Git.Git
git --version
```

**Windows (PowerShell - Manual Install):**
1. Download from https://git-scm.com/download/win
2. Run installer
3. Verify:
```powershell
git --version
```

---

### 1.4 Install Docker & Docker Compose

**Linux (Ubuntu/Debian):**
```bash
# Remove old versions
sudo apt-get remove docker docker-engine docker.io containerd runc

# Install prerequisites
sudo apt-get update
sudo apt-get install -y ca-certificates curl gnupg lsb-release

# Add Docker's official GPG key
sudo mkdir -p /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg

# Set up repository
echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

# Install Docker Engine
sudo apt-get update
sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

# Add user to docker group (to run without sudo)
sudo usermod -aG docker $USER
newgrp docker

# Verify installation
docker --version
docker compose version
```

**Linux (Fedora/RHEL):**
```bash
# Install Docker
sudo dnf install -y docker docker-compose

# Start Docker service
sudo systemctl start docker
sudo systemctl enable docker

# Add user to docker group
sudo usermod -aG docker $USER
newgrp docker

# Verify installation
docker --version
docker compose version
```

**macOS:**
```bash
# Install Docker Desktop (includes Docker Compose)
brew install --cask docker

# Or download from: https://www.docker.com/products/docker-desktop
# Open Docker Desktop application after installation

# Verify installation
docker --version
docker compose version
```

**Windows (PowerShell - using Chocolatey):**
```powershell
choco install docker-desktop -y
# Restart computer, then open Docker Desktop
docker --version
docker compose version
```

**Windows (PowerShell - using winget):**
```powershell
winget install Docker.DockerDesktop
# Restart computer, then open Docker Desktop
docker --version
docker compose version
```

**Windows (PowerShell - Manual Install):**
1. Download Docker Desktop from https://www.docker.com/products/docker-desktop
2. Run installer
3. Restart computer
4. Open Docker Desktop
5. Verify:
```powershell
docker --version
docker compose version
```

---

### 1.5 Install PostgreSQL (via Docker - Recommended)

PostgreSQL will be installed via Docker Compose, so no manual installation needed. Skip to section 2.

**Alternative: Install PostgreSQL Locally (Optional)**

**Linux (Ubuntu/Debian):**
```bash
sudo apt-get update
sudo apt-get install -y postgresql postgresql-contrib
sudo systemctl start postgresql
sudo systemctl enable postgresql
sudo -u postgres psql -c "CREATE DATABASE mtaa;"
```

**Linux (Fedora/RHEL):**
```bash
sudo dnf install -y postgresql postgresql-server
sudo postgresql-setup --initdb
sudo systemctl start postgresql
sudo systemctl enable postgresql
sudo -u postgres psql -c "CREATE DATABASE mtaa;"
```

**macOS:**
```bash
brew install postgresql@15
brew services start postgresql@15
createdb mtaa
```

**Windows (PowerShell - using Chocolatey):**
```powershell
choco install postgresql -y
# Follow installer prompts to set password
# Create database manually using pgAdmin or psql
```

---

## 2. BACKEND INSTALLATION

### 2.1 Clone Repository (if not already cloned)

**Linux/macOS:**
```bash
cd ~
git clone <repository-url>
cd Mtaa
```

**Windows (PowerShell):**
```powershell
cd $HOME
git clone <repository-url>
cd Mtaa
```

---

### 2.2 Install NestJS CLI (Global)

**Linux/macOS:**
```bash
npm install -g @nestjs/cli
nest --version
```

**Windows (PowerShell):**
```powershell
npm install -g @nestjs/cli
nest --version
```

---

### 2.3 Install Root Dependencies

**Linux/macOS/Windows (PowerShell):**
```bash
# Navigate to project root
cd Mtaa

# Install all dependencies (workspace dependencies)
npm install

# Or if using pnpm:
pnpm install
```

---

### 2.4 Setup Backend Environment Variables

**Linux/macOS:**
```bash
cd apps/backend
cp .env.example .env.local
# Edit .env.local with your configuration
nano .env.local
# Or use your preferred editor: vim, code, etc.
```

**Windows (PowerShell):**
```powershell
cd apps/backend
Copy-Item .env.example .env.local
# Edit .env.local with your configuration
notepad .env.local
# Or use: code .env.local
```

**Minimum .env.local content:**
```env
NODE_ENV=development
PORT=3001
DATABASE_URL=postgresql://mtaa:mtaa_password@localhost:5432/mtaa
JWT_SECRET=your-super-secret-jwt-key-minimum-32-characters-change-this
JWT_EXPIRES_IN=15m
JWT_REFRESH_SECRET=your-refresh-token-secret-minimum-32-characters
JWT_REFRESH_EXPIRES_IN=30d
FRONTEND_URL=http://localhost:3000
REDIS_URL=redis://localhost:6379
BCRYPT_ROUNDS=10
```

---

### 2.5 Install Prisma

Prisma is already in package.json, but verify installation:

**Linux/macOS/Windows (PowerShell):**
```bash
cd apps/backend
npm list prisma
# If not installed:
npm install prisma @prisma/client --save-dev
```

---

### 2.6 Initialize Prisma (if not already initialized)

**Linux/macOS/Windows (PowerShell):**
```bash
cd apps/backend
# Prisma is already initialized, but if you need to reinitialize:
npx prisma init
```

---

### 2.7 Generate Prisma Client

**Linux/macOS/Windows (PowerShell):**
```bash
cd apps/backend
npm run prisma:generate
# Or directly:
npx prisma generate
```

---

### 2.8 Start PostgreSQL and Redis (via Docker)

**Linux/macOS/Windows (PowerShell):**
```bash
# From project root
cd Mtaa

# Start only database services
docker compose up postgres redis -d

# Verify containers are running
docker ps

# Check logs
docker compose logs postgres
docker compose logs redis
```

---

### 2.9 Run Database Migrations

**Linux/macOS/Windows (PowerShell):**
```bash
cd apps/backend
npm run prisma:migrate
# Or directly:
npx prisma migrate dev
```

**If you need to reset database (WARNING: Deletes all data):**
```bash
npx prisma migrate reset
```

---

### 2.10 Start Backend in Dev Mode

**Linux/macOS/Windows (PowerShell):**
```bash
cd apps/backend
npm run dev
```

**Backend will be available at:**
- API: http://localhost:3001
- Swagger Docs: http://localhost:3001/api/docs

---

## 3. FRONTEND INSTALLATION

### 3.1 Frontend is Already Created

The Next.js frontend is already part of the monorepo. No need to create a new project.

---

### 3.2 Install Frontend Dependencies

Dependencies are installed when you run `npm install` at the root. Verify:

**Linux/macOS/Windows (PowerShell):**
```bash
cd apps/frontend
npm list
# If dependencies missing:
npm install
```

---

### 3.3 Setup Frontend Environment Variables

**Linux/macOS:**
```bash
cd apps/frontend
cp .env.example .env.local
# Edit .env.local
nano .env.local
```

**Windows (PowerShell):**
```powershell
cd apps/frontend
Copy-Item .env.example .env.local
# Edit .env.local
notepad .env.local
```

**Minimum .env.local content:**
```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

---

### 3.4 Run Frontend Dev Server

**Linux/macOS/Windows (PowerShell):**
```bash
cd apps/frontend
npm run dev
```

**Frontend will be available at:**
- http://localhost:3000

---

## 4. MOBILE INSTALLATION

### 4.1 Install Expo CLI (Global)

**Linux/macOS:**
```bash
npm install -g expo-cli
expo --version
```

**Windows (PowerShell):**
```powershell
npm install -g expo-cli
expo --version
```

**Alternative: Use npx (no global install needed):**
```bash
npx expo-cli --version
```

---

### 4.2 Mobile Project is Already Created

The Expo project is already part of the monorepo. No need to create a new project.

---

### 4.3 Install Mobile Dependencies

Dependencies are installed when you run `npm install` at the root. Verify:

**Linux/macOS/Windows (PowerShell):**
```bash
cd apps/mobile
npm list
# If dependencies missing:
npm install
```

---

### 4.4 Start Expo Development Environment

**Linux/macOS/Windows (PowerShell):**
```bash
cd apps/mobile
npm start
# Or:
expo start
```

**Options:**
- Press `a` to open on Android emulator
- Press `i` to open on iOS simulator (macOS only)
- Scan QR code with Expo Go app on your phone

---

## 5. DOCKER SETUP

### 5.1 Setup Root Environment Variables

**Linux/macOS:**
```bash
cd Mtaa
cp .env.example .env
# Edit .env
nano .env
```

**Windows (PowerShell):**
```powershell
cd Mtaa
Copy-Item .env.example .env
# Edit .env
notepad .env
```

**Minimum .env content:**
```env
NODE_ENV=development
POSTGRES_USER=mtaa
POSTGRES_PASSWORD=mtaa_password
POSTGRES_DB=mtaa
POSTGRES_PORT=5432
REDIS_PORT=6379
JWT_SECRET=your-super-secret-jwt-key-minimum-32-characters
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=30d
FRONTEND_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:3001
FRONTEND_PORT=3000
NGINX_PORT=80
```

---

### 5.2 Build Docker Images

**Linux/macOS/Windows (PowerShell):**
```bash
cd Mtaa
docker compose build
# Or build specific service:
docker compose build backend
docker compose build frontend
```

---

### 5.3 Start All Containers

**Linux/macOS/Windows (PowerShell):**
```bash
cd Mtaa
# Start all services in detached mode
docker compose up -d

# Or start and see logs:
docker compose up

# Or use npm script:
npm run docker:up
```

---

### 5.4 View Container Logs

**Linux/macOS/Windows (PowerShell):**
```bash
cd Mtaa
# View all logs
docker compose logs -f

# View specific service logs
docker compose logs -f backend
docker compose logs -f frontend
docker compose logs -f postgres
docker compose logs -f redis

# Or use npm script:
npm run docker:logs
```

---

### 5.5 Check Container Status

**Linux/macOS/Windows (PowerShell):**
```bash
# List running containers
docker ps

# List all containers (including stopped)
docker ps -a

# Check specific container
docker ps | grep mtaa
```

---

### 5.6 Stop Containers

**Linux/macOS/Windows (PowerShell):**
```bash
cd Mtaa
# Stop all containers
docker compose down

# Stop and remove volumes (WARNING: Deletes database data)
docker compose down -v

# Or use npm script:
npm run docker:down
```

---

### 5.7 Restart Containers

**Linux/macOS/Windows (PowerShell):**
```bash
cd Mtaa
docker compose restart

# Restart specific service
docker compose restart backend
```

---

### 5.8 Rebuild and Start Containers

**Linux/macOS/Windows (PowerShell):**
```bash
cd Mtaa
docker compose up -d --build
```

---

### 5.9 Access Database via Docker

**Linux/macOS/Windows (PowerShell):**
```bash
# Connect to PostgreSQL container
docker exec -it mtaa-postgres psql -U mtaa -d mtaa

# Run SQL commands
# \dt - list tables
# \q - quit
```

---

### 5.10 Access Redis via Docker

**Linux/macOS/Windows (PowerShell):**
```bash
# Connect to Redis container
docker exec -it mtaa-redis redis-cli

# Test connection
ping
# Should return: PONG

# Exit
exit
```

---

## 6. BONUS COMMANDS

### 6.1 Generate Prisma Client

**Linux/macOS/Windows (PowerShell):**
```bash
cd apps/backend
npm run prisma:generate
# Or:
npx prisma generate
```

---

### 6.2 Seed Database

**Linux/macOS/Windows (PowerShell):**
```bash
cd apps/backend
npm run prisma:seed
# Or:
npx ts-node prisma/seed.ts
```

---

### 6.3 Open Prisma Studio (Database GUI)

**Linux/macOS/Windows (PowerShell):**
```bash
cd apps/backend
npm run prisma:studio
# Or:
npx prisma studio
```

**Prisma Studio will open at:** http://localhost:5555

---

### 6.4 Environment Variables Management

**Create .env files:**

**Linux/macOS:**
```bash
# Root .env
cd Mtaa
cp .env.example .env

# Backend .env.local
cd apps/backend
cp .env.example .env.local

# Frontend .env.local
cd ../frontend
cp .env.example .env.local
```

**Windows (PowerShell):**
```powershell
# Root .env
cd Mtaa
Copy-Item .env.example .env

# Backend .env.local
cd apps/backend
Copy-Item .env.example .env.local

# Frontend .env.local
cd ../frontend
Copy-Item .env.example .env.local
```

---

### 6.5 Fix Common Errors

#### Error: Port Already in Use

**Linux/macOS:**
```bash
# Find process using port 3000
lsof -i :3000
# Kill process
kill -9 <PID>

# Find process using port 3001
lsof -i :3001
kill -9 <PID>

# Find process using port 5432
lsof -i :5432
kill -9 <PID>
```

**Windows (PowerShell):**
```powershell
# Find process using port 3000
netstat -ano | findstr :3000
# Kill process (replace <PID> with actual PID)
taskkill /PID <PID> /F

# Find process using port 3001
netstat -ano | findstr :3001
taskkill /PID <PID> /F

# Find process using port 5432
netstat -ano | findstr :5432
taskkill /PID <PID> /F
```

---

#### Error: Cannot Connect to Database

**Linux/macOS/Windows (PowerShell):**
```bash
# Check if PostgreSQL container is running
docker ps | grep postgres

# Check PostgreSQL logs
docker compose logs postgres

# Restart PostgreSQL
docker compose restart postgres

# Verify connection string in .env.local
# DATABASE_URL=postgresql://mtaa:mtaa_password@localhost:5432/mtaa
```

---

#### Error: Prisma Client Not Generated

**Linux/macOS/Windows (PowerShell):**
```bash
cd apps/backend
# Delete node_modules and reinstall
rm -rf node_modules
npm install

# Regenerate Prisma Client
npm run prisma:generate
```

**Windows (PowerShell):**
```powershell
cd apps/backend
# Delete node_modules and reinstall
Remove-Item -Recurse -Force node_modules
npm install

# Regenerate Prisma Client
npm run prisma:generate
```

---

#### Error: Module Not Found

**Linux/macOS/Windows (PowerShell):**
```bash
# From project root
cd Mtaa

# Clean install
rm -rf node_modules
rm -rf apps/*/node_modules
rm -rf packages/*/node_modules
npm install
```

**Windows (PowerShell):**
```powershell
# From project root
cd Mtaa

# Clean install
Remove-Item -Recurse -Force node_modules
Remove-Item -Recurse -Force apps\*\node_modules
Remove-Item -Recurse -Force packages\*\node_modules
npm install
```

---

#### Error: Docker Permission Denied (Linux)

**Linux:**
```bash
# Add user to docker group
sudo usermod -aG docker $USER
newgrp docker

# Or run with sudo (not recommended)
sudo docker compose up -d
```

---

#### Error: Expo CLI Not Found

**Linux/macOS/Windows (PowerShell):**
```bash
# Install globally
npm install -g expo-cli

# Or use npx (no install needed)
npx expo-cli start
```

---

### 6.6 Run All Services from Root

**Linux/macOS/Windows (PowerShell):**
```bash
cd Mtaa
# Start all services using Turborepo
npm run dev
```

This will start backend, frontend, and mobile concurrently.

---

### 6.7 Database Migration Commands

**Linux/macOS/Windows (PowerShell):**
```bash
cd apps/backend

# Create new migration
npx prisma migrate dev --name migration_name

# Apply migrations (production)
npx prisma migrate deploy

# Reset database (WARNING: Deletes all data)
npx prisma migrate reset

# View migration status
npx prisma migrate status
```

---

### 6.8 Clean Build Artifacts

**Linux/macOS:**
```bash
cd Mtaa
# Clean all build artifacts
npm run clean

# Or manually:
rm -rf node_modules
rm -rf apps/*/node_modules
rm -rf packages/*/node_modules
rm -rf apps/*/dist
rm -rf apps/frontend/.next
rm -rf apps/mobile/.expo
```

**Windows (PowerShell):**
```powershell
cd Mtaa
# Clean all build artifacts
npm run clean

# Or manually:
Remove-Item -Recurse -Force node_modules
Remove-Item -Recurse -Force apps\*\node_modules
Remove-Item -Recurse -Force packages\*\node_modules
Remove-Item -Recurse -Force apps\*\dist
Remove-Item -Recurse -Force apps\frontend\.next
Remove-Item -Recurse -Force apps\mobile\.expo
```

---

## 7. QUICK START SUMMARY

### Complete Setup in Order:

**1. System Setup:**
```bash
# Install Node.js, Git, Docker (see section 1)
```

**2. Clone and Install:**
```bash
git clone <repository-url>
cd Mtaa
npm install
```

**3. Setup Environment:**
```bash
# Root .env
cp .env.example .env

# Backend .env.local
cd apps/backend
cp .env.example .env.local

# Frontend .env.local
cd ../frontend
cp .env.example .env.local
```

**4. Start Databases:**
```bash
cd Mtaa
docker compose up postgres redis -d
```

**5. Setup Database:**
```bash
cd apps/backend
npm run prisma:generate
npm run prisma:migrate
```

**6. Start Services:**

**Option A: All at once (using Turborepo):**
```bash
cd Mtaa
npm run dev
```

**Option B: Separate terminals:**
```bash
# Terminal 1: Backend
cd apps/backend
npm run dev

# Terminal 2: Frontend
cd apps/frontend
npm run dev

# Terminal 3: Mobile (optional)
cd apps/mobile
npm start
```

**Option C: Docker (all services):**
```bash
cd Mtaa
docker compose up -d
```

---

## 8. VERIFICATION CHECKLIST

After setup, verify everything works:

- [ ] Node.js installed: `node --version` (should be 18+)
- [ ] npm/pnpm installed: `npm --version` or `pnpm --version`
- [ ] Git installed: `git --version`
- [ ] Docker installed: `docker --version`
- [ ] Docker Compose installed: `docker compose version`
- [ ] PostgreSQL container running: `docker ps | grep postgres`
- [ ] Redis container running: `docker ps | grep redis`
- [ ] Backend running: http://localhost:3001
- [ ] Backend API docs: http://localhost:3001/api/docs
- [ ] Frontend running: http://localhost:3000
- [ ] Prisma Studio: `cd apps/backend && npm run prisma:studio` → http://localhost:5555

---

## 9. TROUBLESHOOTING

### Check Service Health

**Backend Health Check:**
```bash
curl http://localhost:3001/api/v1/health
```

**Frontend:**
```bash
curl http://localhost:3000
```

**Database Connection:**
```bash
docker exec -it mtaa-postgres psql -U mtaa -d mtaa -c "SELECT version();"
```

---

### View All Logs

**Linux/macOS/Windows (PowerShell):**
```bash
cd Mtaa
docker compose logs -f
```

---

### Reset Everything

**Linux/macOS:**
```bash
cd Mtaa
# Stop all containers
docker compose down -v

# Clean node_modules
rm -rf node_modules apps/*/node_modules packages/*/node_modules

# Reinstall
npm install

# Restart containers
docker compose up -d

# Re-run migrations
cd apps/backend
npm run prisma:generate
npm run prisma:migrate
```

**Windows (PowerShell):**
```powershell
cd Mtaa
# Stop all containers
docker compose down -v

# Clean node_modules
Remove-Item -Recurse -Force node_modules, apps\*\node_modules, packages\*\node_modules

# Reinstall
npm install

# Restart containers
docker compose up -d

# Re-run migrations
cd apps/backend
npm run prisma:generate
npm run prisma:migrate
```

---

## 10. TESTING COMMANDS

### 10.1 Run All Tests

**Linux/macOS/Windows (PowerShell):**
```bash
cd Mtaa
# Run all tests using Turborepo
npm test
```

---

### 10.2 Backend Tests

**Linux/macOS/Windows (PowerShell):**
```bash
cd apps/backend

# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:cov

# Run E2E tests
npm run test:e2e

# Run tests in debug mode
npm run test:debug
```

---

### 10.3 Frontend Tests

**Linux/macOS/Windows (PowerShell):**
```bash
cd apps/frontend

# Run tests (if configured)
npm test

# Run tests in watch mode
npm test -- --watch

# Run tests with coverage
npm test -- --coverage
```

---

### 10.4 Mobile Tests

**Linux/macOS/Windows (PowerShell):**
```bash
cd apps/mobile

# Run tests (if configured)
npm test
```

---

## 11. PRODUCTION BUILD & DEPLOYMENT

### 11.1 Build All Projects

**Linux/macOS/Windows (PowerShell):**
```bash
cd Mtaa
# Build all apps and packages
npm run build

# Or build specific app
cd apps/backend
npm run build

cd ../frontend
npm run build
```

---

### 11.2 Backend Production Build

**Linux/macOS/Windows (PowerShell):**
```bash
cd apps/backend

# Build for production
npm run build

# Start production server
npm run start:prod

# Or using Node directly
node dist/main.js
```

---

### 11.3 Frontend Production Build

**Linux/macOS/Windows (PowerShell):**
```bash
cd apps/frontend

# Build for production
npm run build

# Start production server
npm run start

# Frontend will be available at http://localhost:3000
```

---

### 11.4 Build Docker Images for Production

**Linux/macOS/Windows (PowerShell):**
```bash
cd Mtaa

# Build all images
docker compose build

# Build specific service
docker compose build backend
docker compose build frontend

# Build without cache
docker compose build --no-cache
```

---

### 11.5 Production Docker Deployment

**Linux/macOS/Windows (PowerShell):**
```bash
cd Mtaa

# Set production environment
export NODE_ENV=production
# Windows: $env:NODE_ENV="production"

# Build and start in production mode
docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d --build

# Or with custom env file
docker compose --env-file .env.production up -d --build
```

---

### 11.6 Run Production Migrations

**Linux/macOS/Windows (PowerShell):**
```bash
cd apps/backend

# Apply migrations (production safe)
npx prisma migrate deploy

# Or via Docker
docker exec -it mtaa-backend npx prisma migrate deploy
```

---

## 12. CODE QUALITY COMMANDS

### 12.1 Linting

**Linux/macOS/Windows (PowerShell):**
```bash
cd Mtaa

# Lint all projects
npm run lint

# Lint specific app
cd apps/backend
npm run lint

cd ../frontend
npm run lint

cd ../mobile
npm run lint
```

---

### 12.2 Formatting

**Linux/macOS/Windows (PowerShell):**
```bash
cd Mtaa

# Format all code
npm run format

# Check formatting (without fixing)
npx prettier --check "**/*.{ts,tsx,js,jsx,json,md}"
```

---

### 12.3 Type Checking

**Linux/macOS/Windows (PowerShell):**
```bash
cd Mtaa

# Type check all projects
npm run type-check

# Type check specific app
cd apps/backend
npm run type-check

cd ../frontend
npm run type-check

cd ../mobile
npm run type-check
```

---

### 12.4 Run All Quality Checks

**Linux/macOS/Windows (PowerShell):**
```bash
cd Mtaa

# Lint, format, and type check
npm run lint
npm run format
npm run type-check
```

---

## 13. DATABASE BACKUP & RESTORE

### 13.1 Backup Database

**Linux/macOS/Windows (PowerShell):**
```bash
# Backup PostgreSQL database
docker exec mtaa-postgres pg_dump -U mtaa mtaa > backup_$(date +%Y%m%d_%H%M%S).sql

# Windows PowerShell:
docker exec mtaa-postgres pg_dump -U mtaa mtaa | Out-File -Encoding utf8 "backup_$(Get-Date -Format 'yyyyMMdd_HHmmss').sql"

# Backup with compression
docker exec mtaa-postgres pg_dump -U mtaa -Fc mtaa > backup_$(date +%Y%m%d_%H%M%S).dump
```

---

### 13.2 Restore Database

**Linux/macOS:**
```bash
# Restore from SQL file
cat backup_20240101_120000.sql | docker exec -i mtaa-postgres psql -U mtaa -d mtaa

# Restore from compressed dump
docker exec -i mtaa-postgres pg_restore -U mtaa -d mtaa < backup_20240101_120000.dump
```

**Windows (PowerShell):**
```powershell
# Restore from SQL file
Get-Content backup_20240101_120000.sql | docker exec -i mtaa-postgres psql -U mtaa -d mtaa

# Restore from compressed dump
Get-Content backup_20240101_120000.dump | docker exec -i mtaa-postgres pg_restore -U mtaa -d mtaa
```

---

### 13.3 Export Database Schema Only

**Linux/macOS/Windows (PowerShell):**
```bash
# Export schema without data
docker exec mtaa-postgres pg_dump -U mtaa -s mtaa > schema_only.sql

# Export data without schema
docker exec mtaa-postgres pg_dump -U mtaa -a mtaa > data_only.sql
```

---

### 13.4 Backup Redis Data

**Linux/macOS/Windows (PowerShell):**
```bash
# Create Redis backup
docker exec mtaa-redis redis-cli SAVE
docker cp mtaa-redis:/data/dump.rdb ./redis_backup_$(date +%Y%m%d_%H%M%S).rdb

# Windows PowerShell:
docker exec mtaa-redis redis-cli SAVE
docker cp mtaa-redis:/data/dump.rdb "redis_backup_$(Get-Date -Format 'yyyyMMdd_HHmmss').rdb"
```

---

## 14. DEPENDENCY MANAGEMENT

### 14.1 Update Dependencies

**Linux/macOS/Windows (PowerShell):**
```bash
cd Mtaa

# Check for outdated packages
npm outdated

# Update all dependencies (root)
npm update

# Update specific package
npm install package-name@latest

# Update all dependencies to latest (use with caution)
npx npm-check-updates -u
npm install
```

---

### 14.2 Add New Dependency

**Linux/macOS/Windows (PowerShell):**
```bash
# Add to root
cd Mtaa
npm install package-name

# Add to backend
cd apps/backend
npm install package-name

# Add to frontend
cd ../frontend
npm install package-name

# Add to mobile
cd ../mobile
npm install package-name

# Add dev dependency
npm install -D package-name
```

---

### 14.3 Remove Dependency

**Linux/macOS/Windows (PowerShell):**
```bash
# Remove from root
cd Mtaa
npm uninstall package-name

# Remove from specific app
cd apps/backend
npm uninstall package-name
```

---

### 14.4 Clean Install Dependencies

**Linux/macOS:**
```bash
cd Mtaa
rm -rf node_modules package-lock.json
rm -rf apps/*/node_modules apps/*/package-lock.json
rm -rf packages/*/node_modules packages/*/package-lock.json
npm install
```

**Windows (PowerShell):**
```powershell
cd Mtaa
Remove-Item -Recurse -Force node_modules, package-lock.json
Remove-Item -Recurse -Force apps\*\node_modules, apps\*\package-lock.json
Remove-Item -Recurse -Force packages\*\node_modules, packages\*\package-lock.json
npm install
```

---

### 14.5 Audit Dependencies

**Linux/macOS/Windows (PowerShell):**
```bash
cd Mtaa

# Check for security vulnerabilities
npm audit

# Fix automatically fixable issues
npm audit fix

# Force fix (may break things)
npm audit fix --force
```

---

## 15. MONITORING & DEBUGGING

### 15.1 Monitor Container Resources

**Linux/macOS/Windows (PowerShell):**
```bash
# View container stats
docker stats

# View specific container stats
docker stats mtaa-backend

# View disk usage
docker system df
```

---

### 15.2 Debug Backend

**Linux/macOS/Windows (PowerShell):**
```bash
cd apps/backend

# Start with debugger
npm run start:debug

# Attach debugger on port 9229
# Use VS Code debugger or Chrome DevTools: chrome://inspect
```

---

### 15.3 View Application Logs

**Linux/macOS/Windows (PowerShell):**
```bash
cd Mtaa

# View all logs
docker compose logs -f

# View last 100 lines
docker compose logs --tail=100

# View logs since specific time
docker compose logs --since 30m

# View specific service logs
docker compose logs -f backend
docker compose logs -f frontend
```

---

### 15.4 Database Monitoring

**Linux/macOS/Windows (PowerShell):**
```bash
# Connect to PostgreSQL and view active connections
docker exec -it mtaa-postgres psql -U mtaa -d mtaa -c "SELECT * FROM pg_stat_activity;"

# View database size
docker exec -it mtaa-postgres psql -U mtaa -d mtaa -c "SELECT pg_size_pretty(pg_database_size('mtaa'));"

# View table sizes
docker exec -it mtaa-postgres psql -U mtaa -d mtaa -c "SELECT schemaname, tablename, pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size FROM pg_tables WHERE schemaname = 'public' ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;"
```

---

### 15.5 Redis Monitoring

**Linux/macOS/Windows (PowerShell):**
```bash
# Connect to Redis CLI
docker exec -it mtaa-redis redis-cli

# Monitor Redis commands in real-time
docker exec -it mtaa-redis redis-cli MONITOR

# Get Redis info
docker exec -it mtaa-redis redis-cli INFO

# Get memory usage
docker exec -it mtaa-redis redis-cli INFO memory
```

---

### 15.6 Network Debugging

**Linux/macOS/Windows (PowerShell):**
```bash
# Inspect Docker network
docker network inspect mtaa-network

# Test connectivity between containers
docker exec -it mtaa-backend ping postgres
docker exec -it mtaa-backend ping redis
```

---

## 16. WINDOWS CMD ALTERNATIVES

### 16.1 Basic Commands (CMD)

**Windows (Command Prompt):**
```cmd
REM Navigate to project
cd /d C:\Users\username\Documents\PROJECTS\Mtaa

REM Install dependencies
npm install

REM Start services
cd apps\backend
npm run dev

REM Docker commands
docker compose up -d
docker compose logs -f

REM Environment variables
set NODE_ENV=development
set DATABASE_URL=postgresql://mtaa:mtaa_password@localhost:5432/mtaa
```

---

### 16.2 File Operations (CMD)

**Windows (Command Prompt):**
```cmd
REM Copy files
copy .env.example .env
copy apps\backend\.env.example apps\backend\.env.local

REM Delete files/folders
rmdir /s /q node_modules
del package-lock.json

REM List files
dir
dir /s *.json
```

---

### 16.3 Process Management (CMD)

**Windows (Command Prompt):**
```cmd
REM Find process using port
netstat -ano | findstr :3000

REM Kill process
taskkill /PID 1234 /F

REM List running Node processes
tasklist | findstr node
```

---

## 17. PERFORMANCE OPTIMIZATION

### 17.1 Prisma Query Optimization

**Linux/macOS/Windows (PowerShell):**
```bash
cd apps/backend

# Enable Prisma query logging
# Add to .env.local:
# LOG_LEVEL=query

# Analyze slow queries
npx prisma studio
# Use Prisma Studio to identify slow queries
```

---

### 17.2 Build Optimization

**Linux/macOS/Windows (PowerShell):**
```bash
cd Mtaa

# Build with production optimizations
NODE_ENV=production npm run build
# Windows: $env:NODE_ENV="production"; npm run build

# Analyze bundle size (frontend)
cd apps/frontend
npm run build
# Check .next/analyze for bundle analysis
```

---

### 17.3 Docker Image Optimization

**Linux/macOS/Windows (PowerShell):**
```bash
cd Mtaa

# Build with build cache
docker compose build --build-arg BUILDKIT_INLINE_CACHE=1

# Use multi-stage builds (already in Dockerfiles)
# Clean up unused images
docker image prune -a

# Clean up everything
docker system prune -a --volumes
```

---

### 17.4 Database Indexing

**Linux/macOS/Windows (PowerShell):**
```bash
# Connect to database
docker exec -it mtaa-postgres psql -U mtaa -d mtaa

# View indexes
\di

# Analyze query performance
EXPLAIN ANALYZE SELECT * FROM users WHERE email = 'test@example.com';
```

---

## 18. CI/CD COMMANDS

### 18.1 Pre-commit Checks

**Linux/macOS/Windows (PowerShell):**
```bash
cd Mtaa

# Run all checks before commit
npm run lint
npm run type-check
npm run format -- --check
npm test
```

---

### 18.2 GitHub Actions / GitLab CI

**Example CI Script:**
```bash
#!/bin/bash
# Install dependencies
npm ci

# Run linting
npm run lint

# Run type checking
npm run type-check

# Run tests
npm test

# Build all projects
npm run build

# Run E2E tests
cd apps/backend
npm run test:e2e
```

---

### 18.3 Docker Build for CI

**Linux/macOS/Windows (PowerShell):**
```bash
# Build without cache (for CI)
docker compose build --no-cache

# Build specific service
docker build -f apps/backend/Dockerfile -t mtaa-backend:latest .

# Tag for registry
docker tag mtaa-backend:latest registry.example.com/mtaa-backend:latest

# Push to registry
docker push registry.example.com/mtaa-backend:latest
```

---

## 19. SECURITY COMMANDS

### 19.1 Security Audit

**Linux/macOS/Windows (PowerShell):**
```bash
cd Mtaa

# Audit dependencies
npm audit

# Fix vulnerabilities
npm audit fix

# Check for known vulnerabilities
npm audit --audit-level=moderate
```

---

### 19.2 Environment Variables Security

**Linux/macOS:**
```bash
# Check for exposed secrets (use git-secrets or similar)
git secrets --scan

# Verify .env files are in .gitignore
cat .gitignore | grep .env
```

**Windows (PowerShell):**
```powershell
# Check .gitignore
Select-String -Path .gitignore -Pattern "\.env"
```

---

### 19.3 Docker Security Scan

**Linux/macOS/Windows (PowerShell):**
```bash
# Scan Docker images for vulnerabilities
docker scan mtaa-backend
docker scan mtaa-frontend

# Use Trivy (if installed)
trivy image mtaa-backend:latest
```

---

## 20. UTILITY COMMANDS

### 20.1 Clear All Caches

**Linux/macOS:**
```bash
cd Mtaa

# Clear npm cache
npm cache clean --force

# Clear Next.js cache
rm -rf apps/frontend/.next

# Clear Expo cache
rm -rf apps/mobile/.expo

# Clear Turbo cache
rm -rf .turbo

# Clear all
npm cache clean --force
rm -rf apps/*/.next apps/mobile/.expo .turbo node_modules/.cache
```

**Windows (PowerShell):**
```powershell
cd Mtaa

# Clear npm cache
npm cache clean --force

# Clear Next.js cache
Remove-Item -Recurse -Force apps\frontend\.next

# Clear Expo cache
Remove-Item -Recurse -Force apps\mobile\.expo

# Clear Turbo cache
Remove-Item -Recurse -Force .turbo

# Clear all
npm cache clean --force
Remove-Item -Recurse -Force apps\*\.next, apps\mobile\.expo, .turbo, node_modules\.cache
```

---

### 20.2 View Project Structure

**Linux/macOS:**
```bash
# Tree view (if tree is installed)
tree -L 2 -I node_modules

# Or use find
find . -maxdepth 2 -type d -not -path '*/node_modules/*' | sort
```

**Windows (PowerShell):**
```powershell
# Tree view
tree /F /A

# Or use Get-ChildItem
Get-ChildItem -Recurse -Depth 2 -Directory | Where-Object { $_.FullName -notlike '*node_modules*' } | Select-Object FullName
```

---

### 20.3 Check Disk Usage

**Linux/macOS:**
```bash
# Check project size
du -sh Mtaa

# Check node_modules size
du -sh Mtaa/node_modules
du -sh Mtaa/apps/*/node_modules

# Check Docker disk usage
docker system df
```

**Windows (PowerShell):**
```powershell
# Check project size
Get-ChildItem -Recurse | Measure-Object -Property Length -Sum | Select-Object @{Name="Size(GB)";Expression={[math]::Round($_.Sum / 1GB, 2)}}

# Check Docker disk usage
docker system df
```

---

### 20.4 Git Commands

**Linux/macOS/Windows (PowerShell):**
```bash
cd Mtaa

# Check status
git status

# Pull latest changes
git pull origin main

# Create new branch
git checkout -b feature/new-feature

# Commit changes
git add .
git commit -m "Your commit message"

# Push changes
git push origin feature/new-feature
```

---

### 20.5 Quick Health Check Script

**Linux/macOS:**
```bash
#!/bin/bash
echo "=== Mtaa Health Check ==="
echo "Node version: $(node --version)"
echo "npm version: $(npm --version)"
echo "Docker version: $(docker --version)"
echo ""
echo "Checking containers..."
docker ps --filter "name=mtaa" --format "table {{.Names}}\t{{.Status}}"
echo ""
echo "Checking services..."
curl -s http://localhost:3001/api/v1/health && echo "✓ Backend OK" || echo "✗ Backend DOWN"
curl -s http://localhost:3000 > /dev/null && echo "✓ Frontend OK" || echo "✗ Frontend DOWN"
```

**Windows (PowerShell):**
```powershell
Write-Host "=== Mtaa Health Check ==="
Write-Host "Node version: $(node --version)"
Write-Host "npm version: $(npm --version)"
Write-Host "Docker version: $(docker --version)"
Write-Host ""
Write-Host "Checking containers..."
docker ps --filter "name=mtaa" --format "table {{.Names}}\t{{.Status}}"
Write-Host ""
Write-Host "Checking services..."
try { Invoke-WebRequest -Uri http://localhost:3001/api/v1/health -UseBasicParsing | Out-Null; Write-Host "✓ Backend OK" } catch { Write-Host "✗ Backend DOWN" }
try { Invoke-WebRequest -Uri http://localhost:3000 -UseBasicParsing | Out-Null; Write-Host "✓ Frontend OK" } catch { Write-Host "✗ Frontend DOWN" }
```

---

## END OF SETUP GUIDE

For more information, see:
- [README.md](./README.md) - Project overview
- [apps/backend/README.md](./apps/backend/README.md) - Backend documentation

**Happy Coding! 🚀**

