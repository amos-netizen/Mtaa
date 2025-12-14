"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const path_1 = require("path");
const app_module_1 = require("./app.module");
const http_exception_filter_1 = require("./common/filters/http-exception.filter");
const transform_interceptor_1 = require("./common/interceptors/transform.interceptor");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.useStaticAssets((0, path_1.join)(__dirname, '..', 'public'), {
        prefix: '/',
    });
    const isDevelopment = process.env.NODE_ENV !== 'production';
    app.enableCors({
        origin: isDevelopment
            ? true
            : process.env.FRONTEND_URL || 'http://localhost:3000',
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization'],
    });
    app.setGlobalPrefix('api/v1', {
        exclude: [{ path: '/', method: common_1.RequestMethod.GET }],
    });
    app.getHttpAdapter().get('/', (req, res) => {
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
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
        transformOptions: {
            enableImplicitConversion: true,
        },
    }));
    app.useGlobalFilters(new http_exception_filter_1.HttpExceptionFilter());
    app.useGlobalInterceptors(new transform_interceptor_1.TransformInterceptor());
    const config = new swagger_1.DocumentBuilder()
        .setTitle('Mtaa API')
        .setDescription('Mtaa - Hyperlocal Kenyan Neighborhood Social Network API')
        .setVersion('1.0')
        .addBearerAuth()
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup('api/docs', app, document);
    const port = process.env.PORT || 3001;
    await app.listen(port);
    console.log(`🚀 Mtaa API is running on: http://localhost:${port}`);
    console.log(`📚 Swagger docs available at: http://localhost:${port}/api/docs`);
}
bootstrap();
//# sourceMappingURL=main.js.map