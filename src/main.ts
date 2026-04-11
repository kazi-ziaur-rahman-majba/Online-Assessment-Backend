import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, ClassSerializerInterceptor, INestApplication } from '@nestjs/common';

let cachedApp: INestApplication;

async function bootstrap() {
  if (cachedApp) return cachedApp;

  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

  await app.init();
  cachedApp = app;
  return app;
}

// Export for Vercel serverless function
export default async (req: any, res: any) => {
  const app = await bootstrap();
  const instance = app.getHttpAdapter().getInstance();
  instance(req, res);
};

// Start locally if not running on Vercel
if (!process.env.VERCEL) {
  bootstrap().then((app) => {
    const port = process.env.PORT ?? 5000;
    app.listen(port).then(() => {
      console.log(`Application is running on: http://localhost:${port}`);
    });
  });
}
