# Mtaa Backend

Production-ready NestJS backend API for Mtaa - Hyperlocal Kenyan Neighborhood Social Network.

## 🏗️ Architecture

- **Framework**: NestJS (Node.js, TypeScript)
- **Database**: PostgreSQL 15
- **ORM**: Prisma
- **Authentication**: JWT (Access + Refresh Tokens)
- **Password Hashing**: BCrypt
- **Validation**: class-validator + Joi
- **API Documentation**: Swagger/OpenAPI

## 📁 Project Structure

```
apps/backend/
├── src/
│   ├── config/              # Configuration management
│   │   ├── config.module.ts
│   │   ├── config.service.ts
│   │   └── config.validation.ts
│   ├── common/              # Shared utilities
│   │   ├── decorators/      # Custom decorators
│   │   ├── filters/         # Exception filters
│   │   ├── guards/          # Auth guards
│   │   ├── interceptors/    # Response interceptors
│   │   └── utils/           # Utility functions
│   ├── modules/
│   │   ├── auth/           # Authentication module
│   │   ├── users/          # User management module
│   │   └── health/         # Health check module
│   ├── prisma/             # Prisma service
│   ├── database/           # Database module
│   ├── app.module.ts       # Root module
│   └── main.ts            # Application entry point
├── prisma/
│   └── schema.prisma      # Database schema
├── docker-compose.yml      # Docker setup
├── Dockerfile             # Production Docker image
└── package.json
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- PostgreSQL 15+ (or use Docker)
- npm or yarn

### Option 1: Using Docker (Recommended)

1. **Start PostgreSQL and pgAdmin**
   ```bash
   docker-compose up -d
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Setup environment variables**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your configuration
   ```

4. **Run database migrations**
   ```bash
   npm run prisma:generate
   npm run prisma:migrate
   ```

5. **Start development server**
   ```bash
   npm run dev
   ```

### Option 2: Local Development

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Setup PostgreSQL**
   - Install PostgreSQL 15+
   - Create database: `CREATE DATABASE mtaa;`
   - Update `DATABASE_URL` in `.env.local`

3. **Setup environment variables**
   ```bash
   cp .env.example .env.local
   # Edit .env.local
   ```

4. **Run migrations**
   ```bash
   npm run prisma:generate
   npm run prisma:migrate
   ```

5. **Start server**
   ```bash
   npm run dev
   ```

## 📝 Environment Variables

Create `.env.local` file:

```env
# Application
NODE_ENV=development
PORT=3001

# Database
DATABASE_URL=postgresql://mtaa:mtaa_password@localhost:5432/mtaa

# JWT
JWT_SECRET=your-super-secret-jwt-key-minimum-32-characters
JWT_EXPIRES_IN=15m
JWT_REFRESH_SECRET=your-refresh-token-secret
JWT_REFRESH_EXPIRES_IN=30d

# CORS
FRONTEND_URL=http://localhost:3000

# BCrypt
BCRYPT_ROUNDS=10
```

## 🗄️ Database

### Prisma Commands

```bash
# Generate Prisma Client
npm run prisma:generate

# Create and run migration
npm run prisma:migrate

# Open Prisma Studio (Database GUI)
npm run prisma:studio

# Reset database (WARNING: Deletes all data)
npx prisma migrate reset
```

### Access pgAdmin

1. Start Docker containers: `docker-compose up -d`
2. Open http://localhost:5050
3. Login with credentials from `.env.local`
4. Add server:
   - Host: `postgres` (container name)
   - Port: `5432`
   - Username: `mtaa`
   - Password: `mtaa_password`

## 📚 API Documentation

Once the server is running, access Swagger documentation at:

**http://localhost:3001/api/docs**

## 🔐 Authentication

### Register

```bash
POST /api/v1/auth/register
Content-Type: application/json

{
  "phoneNumber": "+254712345678",
  "fullName": "John Doe",
  "username": "johndoe",
  "password": "SecurePassword123!",
  "email": "john@example.com" // optional
}
```

### Login

```bash
POST /api/v1/auth/login
Content-Type: application/json

{
  "phoneNumber": "+254712345678",
  "password": "SecurePassword123!"
}
```

### Refresh Token

```bash
POST /api/v1/auth/refresh-token
Content-Type: application/json

{
  "refreshToken": "your-refresh-token"
}
```

### Protected Routes

Include access token in Authorization header:

```bash
GET /api/v1/users/me
Authorization: Bearer <access-token>
```

## 📋 API Routes

### Authentication

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/v1/auth/register` | Register new user | No |
| POST | `/api/v1/auth/login` | Login with password | No |
| POST | `/api/v1/auth/login/otp` | Request login OTP | No |
| POST | `/api/v1/auth/verify-otp` | Verify OTP | No |
| POST | `/api/v1/auth/refresh-token` | Refresh access token | No |
| GET | `/api/v1/auth/me` | Get current user | Yes |
| DELETE | `/api/v1/auth/logout` | Logout | Yes |

### Users

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/v1/users` | Get all users (paginated) | Yes |
| GET | `/api/v1/users/:id` | Get user by ID | Yes |
| GET | `/api/v1/users/me` | Get current user profile | Yes |
| POST | `/api/v1/users` | Create user | Yes |
| PUT | `/api/v1/users/me` | Update current user | Yes |
| PUT | `/api/v1/users/me/password` | Update password | Yes |
| PUT | `/api/v1/users/:id` | Update user by ID | Yes |
| DELETE | `/api/v1/users/:id` | Delete user | Yes |

### Health Check

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/v1/health` | Basic health check | No |
| GET | `/api/v1/health/detailed` | Detailed health check | No |

## 🛠️ Development

### Available Scripts

```bash
# Development
npm run dev              # Start in watch mode
npm run start:debug     # Start with debugger

# Building
npm run build           # Build for production
npm run start:prod      # Start production server

# Code Quality
npm run lint            # Lint code
npm run format          # Format code with Prettier
npm run type-check      # Type check TypeScript

# Database
npm run prisma:generate # Generate Prisma Client
npm run prisma:migrate  # Run migrations
npm run prisma:studio   # Open Prisma Studio

# Testing
npm test                # Run tests
npm run test:watch      # Run tests in watch mode
npm run test:cov        # Run tests with coverage
```

## 🐳 Docker

### Development

```bash
# Start PostgreSQL and pgAdmin
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### Production

```bash
# Build Docker image
docker build -t mtaa-backend .

# Run container
docker run -p 3001:3001 --env-file .env.production mtaa-backend
```

## 🔒 Security Features

- **JWT Authentication**: Access and refresh tokens
- **Password Hashing**: BCrypt with configurable rounds
- **Input Validation**: class-validator + Joi
- **CORS**: Configurable origins
- **Error Handling**: Global exception filters
- **SQL Injection Prevention**: Prisma ORM parameterized queries

## 📦 Dependencies

### Core
- `@nestjs/core` - NestJS framework
- `@nestjs/common` - Common utilities
- `@prisma/client` - Prisma ORM client
- `passport` + `passport-jwt` - Authentication
- `bcrypt` - Password hashing
- `class-validator` - DTO validation

### Development
- `@nestjs/cli` - NestJS CLI
- `prisma` - Prisma CLI
- `typescript` - TypeScript compiler
- `eslint` - Code linting
- `prettier` - Code formatting

## 🧪 Testing

```bash
# Unit tests
npm test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov
```

## 📖 Code Structure

### Clean Architecture Principles

- **Separation of Concerns**: Each module handles its own domain
- **Dependency Injection**: Services are injected via NestJS DI
- **DTOs**: Data Transfer Objects for validation
- **Guards**: Route protection
- **Interceptors**: Response transformation
- **Filters**: Exception handling

### Best Practices

- ✅ TypeScript strict mode
- ✅ Absolute imports (`@/`)
- ✅ Comprehensive error handling
- ✅ Input validation
- ✅ JSDoc comments
- ✅ Consistent code style

## 🚢 Deployment

### Production Checklist

- [ ] Set `NODE_ENV=production`
- [ ] Use strong `JWT_SECRET` (minimum 32 characters)
- [ ] Configure CORS properly
- [ ] Set up database backups
- [ ] Enable HTTPS
- [ ] Configure rate limiting
- [ ] Set up monitoring and logging
- [ ] Run database migrations

### Environment Variables (Production)

```env
NODE_ENV=production
PORT=3001
DATABASE_URL=postgresql://user:password@host:5432/mtaa
JWT_SECRET=<strong-secret-min-32-chars>
JWT_REFRESH_SECRET=<strong-secret-min-32-chars>
FRONTEND_URL=https://your-frontend-domain.com
```

## 📞 Support

For issues and questions, please open an issue on GitHub.

---

**Built with ❤️ for Mtaa**



