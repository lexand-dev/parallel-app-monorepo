import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  console.log(`🚀 Starting in ${process.env.NODE_ENV} mode`);
  await app.listen(process.env.PORT!);
}
bootstrap();
