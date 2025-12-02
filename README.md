# Mtaa - Hyperlocal Kenyan Neighborhood Social Network

A production-ready monorepo for Mtaa, built with modern technologies and best practices.

## 🏗️ Architecture

- **Frontend**: Next.js 15 (App Router, TypeScript, TailwindCSS)
- **Backend**: NestJS (Node.js, TypeScript, Prisma ORM)
- **Mobile**: Expo React Native
- **Database**: PostgreSQL
- **Cache**: Redis
- **Reverse Proxy**: Nginx
- **Containerization**: Docker & Docker Compose

## 📁 Project Structure

```
Mtaa/
├── apps/
│   ├── backend/          # NestJS API
│   ├── frontend/          # Next.js web app
│   └── mobile/            # Expo React Native app
├── packages/
│   ├── types/            # Shared TypeScript types
│   └── config/            # Shared configuration
├── nginx/                 # Nginx configuration
├── docker-compose.yml     # Docker Compose setup
├── package.json           # Root package.json (workspaces)
└── turbo.json             # Turborepo configuration
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- Docker & Docker Compose
- PostgreSQL 15+ (if running locally without Docker)
- Redis 7+ (if running locally without Docker)

### Option 1: Docker (Recommended)

1. **Clone and setup environment**
   ```bash
   git clone <repository-url>
   cd Mtaa
   cp .env.example .env
   # Edit .env with your configuration
   ```

2. **Start all services**
   ```bash
   npm run docker:up
   ```

3. **Run database migrations**
   ```bash
   docker exec -it mtaa-backend npm run prisma:migrate
   ```

4. **Access services**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:3001
   - API Docs: http://localhost:3001/api/docs
   - Nginx Proxy: http://localhost:80

### Option 2: Local Development

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Setup environment variables**
   ```bash
   cp .env.example .env
   cp apps/backend/.env.example apps/backend/.env.local
   cp apps/frontend/.env.example apps/frontend/.env.local
   # Edit the .env files with your configuration
   ```

3. **Start PostgreSQL and Redis**
   ```bash
   # Using Docker for databases only
   docker-compose up postgres redis -d
   ```

4. **Setup database**
   ```bash
   cd apps/backend
   npm run prisma:generate
   npm run prisma:migrate
   ```

5. **Start services**

   In separate terminals:
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

## 📚 Documentation

- [Technical Specification](./TECHNICAL_SPECIFICATION.md) - Complete technical architecture
- [Database Schema](./database_schema.sql) - PostgreSQL schema
- [API Specification](./api_specification.yaml) - OpenAPI specification

## 🛠️ Development

### Available Scripts

**Root level:**
- `npm run dev` - Start all services in development mode
- `npm run build` - Build all packages and apps
- `npm run lint` - Lint all packages and apps
- `npm run format` - Format code with Prettier
- `npm run type-check` - Type check all TypeScript code
- `npm run docker:up` - Start Docker containers
- `npm run docker:down` - Stop Docker containers
- `npm run docker:logs` - View Docker logs

**Backend:**
- `npm run dev` - Start NestJS in watch mode
- `npm run build` - Build for production
- `npm run prisma:generate` - Generate Prisma Client
- `npm run prisma:migrate` - Run database migrations
- `npm run prisma:studio` - Open Prisma Studio

**Frontend:**
- `npm run dev` - Start Next.js dev server
- `npm run build` - Build for production
- `npm run start` - Start production server

**Mobile:**
- `npm start` - Start Expo dev server
- `npm run android` - Run on Android
- `npm run ios` - Run on iOS

## 🔐 Authentication

The app uses SMS OTP authentication:

1. User enters phone number
2. System sends 6-digit OTP via SMS
3. User verifies OTP
4. System returns JWT access token and refresh token

**Note**: In development, OTP codes are logged to console. Integrate with Safaricom SMS API for production.

## 🗄️ Database

### Prisma Commands

```bash
cd apps/backend

# Generate Prisma Client
npm run prisma:generate

# Create migration
npm run prisma:migrate

# Open Prisma Studio (database GUI)
npm run prisma:studio
```

## 🐳 Docker

### Services

- **postgres**: PostgreSQL 15 database
- **redis**: Redis 7 cache
- **backend**: NestJS API server
- **frontend**: Next.js web application
- **nginx**: Reverse proxy and load balancer

### Useful Commands

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f [service-name]

# Stop all services
docker-compose down

# Rebuild and start
docker-compose up -d --build

# Access database
docker exec -it mtaa-postgres psql -U mtaa -d mtaa
```

## 📦 Packages

### Shared Packages

- **@mtaa/types**: Shared TypeScript types and interfaces
- **@mtaa/config**: Shared configuration and constants

These packages are automatically linked via npm workspaces.

## 🔧 Configuration

### Environment Variables

Key environment variables:

- `DATABASE_URL`: PostgreSQL connection string
- `REDIS_URL`: Redis connection string
- `JWT_SECRET`: Secret key for JWT tokens
- `FRONTEND_URL`: Frontend URL for CORS
- `NEXT_PUBLIC_API_URL`: Backend API URL for frontend

See `.env.example` for all available variables.

## 🧪 Testing

```bash
# Backend tests
cd apps/backend
npm test

# Frontend tests (when added)
cd apps/frontend
npm test
```

## 📱 Mobile Development

### Setup

1. Install Expo CLI globally:
   ```bash
   npm install -g expo-cli
   ```

2. Start development server:
   ```bash
   cd apps/mobile
   npm start
   ```

3. Scan QR code with Expo Go app (iOS/Android)

### Building for Production

```bash
# iOS
expo build:ios

# Android
expo build:android
```

## 🚢 Deployment

### Backend

1. Build Docker image:
   ```bash
   docker build -f apps/backend/Dockerfile -t mtaa-backend .
   ```

2. Run migrations:
   ```bash
   docker run --rm mtaa-backend npm run prisma:migrate
   ```

3. Deploy container to your hosting platform

### Frontend

1. Build Docker image:
   ```bash
   docker build -f apps/frontend/Dockerfile -t mtaa-frontend .
   ```

2. Deploy container or use Vercel/Netlify

### Mobile

Use EAS Build (Expo Application Services) or build locally.

## 🔒 Security

- JWT tokens with refresh token rotation
- Password hashing with bcrypt
- Input validation with class-validator
- CORS configuration
- Rate limiting (Nginx)
- SQL injection prevention (Prisma)
- XSS prevention

## 📝 Code Style

- ESLint for linting
- Prettier for formatting
- TypeScript strict mode
- Absolute imports (`@/`)
- Clean architecture principles

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Run tests and linting
4. Submit a pull request

## 📄 License

[Specify license]

## 🆘 Support

For issues and questions, please open an issue on GitHub.

---

**Built with ❤️ for Kenyan neighborhoods**
