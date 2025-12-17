import { NestFactory } from '@nestjs/core';
import { ValidationPipe, RequestMethod } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  
  // Serve static files from public directory
  app.useStaticAssets(join(__dirname, '..', 'public'), {
    prefix: '/',
  });

  // Enable CORS
  const isDevelopment = process.env.NODE_ENV !== 'production';
  
  // Parse allowed origins from FRONTEND_URL (comma-separated) or use defaults
  const getAllowedOrigins = (): string[] | boolean => {
    if (isDevelopment) return true; // Allow all origins in development
    
    const frontendUrl = process.env.FRONTEND_URL || '';
    const origins = frontendUrl
      .split(',')
      .map(url => url.trim())
      .filter(Boolean);
    
    // Add common Vercel patterns if main domain is set
    if (origins.length > 0) {
      return origins;
    }
    
    return ['http://localhost:3000'];
  };

  app.enableCors({
    origin: (origin, callback) => {
      const allowed = getAllowedOrigins();
      
      // Allow requests with no origin (like mobile apps or curl)
      if (!origin) {
        callback(null, true);
        return;
      }
      
      // In development, allow all
      if (allowed === true) {
        callback(null, true);
        return;
      }
      
      // Check if origin matches allowed list or Vercel preview pattern
      const isAllowed = (allowed as string[]).some(allowedOrigin => {
        if (origin === allowedOrigin) return true;
        // Allow Vercel preview deployments (*.vercel.app)
        if (origin.endsWith('.vercel.app')) return true;
        return false;
      });
      
      if (isAllowed) {
        callback(null, true);
      } else {
        console.warn(`CORS blocked origin: ${origin}`);
        callback(null, true); // Still allow but log warning (for debugging)
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  // Global prefix (exclude root path)
  app.setGlobalPrefix('api/v1', {
    exclude: [{ path: '/', method: RequestMethod.GET }],
  });

  // Root route handler (before global prefix)
  app.getHttpAdapter().get('/', (req: any, res: any) => {
    res.json({
      name: 'Mtaa API',
      version: '1.0.0',
      description: 'Hyperlocal Kenyan Neighborhood Social Network API',
      message: 'API is available at /api/v1',
      endpoints: {
        health: '/api/v1/health',
        docs: '/api/docs',
        auth: '/api/v1/auth',
        users: '/api/v1/users',
        posts: '/api/v1/posts',
        notifications: '/api/v1/notifications',
        marketplace: '/api/v1/marketplace/listings',
        jobs: '/api/v1/jobs',
        services: '/api/v1/services',
        bookings: '/api/v1/bookings',
        messages: '/api/v1/conversations',
        neighborhoods: '/api/v1/neighborhoods',
      },
    });
  });

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    })
  );

  // Global exception filter
  app.useGlobalFilters(new HttpExceptionFilter());

  // Global interceptor
  app.useGlobalInterceptors(new TransformInterceptor());

  // Swagger documentation
  const config = new DocumentBuilder()
    .setTitle('Mtaa API')
    .setDescription('Mtaa - Hyperlocal Kenyan Neighborhood Social Network API')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const port = process.env.PORT || 3001;
  await app.listen(port);
  console.log(`🚀 Mtaa API is running on: http://localhost:${port}`);
  console.log(`📚 Swagger docs available at: http://localhost:${port}/api/docs`);
}

bootstrap();



