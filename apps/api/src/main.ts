import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());
  app.enableCors({
    origin: ['https://parallel-psi.vercel.app', 'http://localhost:3000'],
    credentials: true, // permite enviar cookies
  });
  console.log(
    `🚀 Starting in ${process.env.NODE_ENV} mode, PORT ${process.env.PORT}`,
  );
  await app.listen(process.env.PORT!);
}
bootstrap();
