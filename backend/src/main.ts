import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  app.enableCors({
    origin: (origin, cb) => {
      if (
        !origin ||
        /localhost/.test(origin) ||
        /\.vercel\.app$/.test(origin) ||
        /\.railway\.app$/.test(origin) ||
        /\.up\.railway\.app$/.test(origin)
      ) {
        cb(null, true);
      } else {
        cb(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
  });

  const port = process.env.PORT ?? 3000;
  await app.listen(port);
  console.log(`Backend rodando em http://localhost:${port}/api`);
}

bootstrap();
