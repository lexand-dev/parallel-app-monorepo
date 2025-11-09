/* import crypto from 'crypto';
(global as any).crypto = crypto; */
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());
  app.enableCors({
    origin: ['https://parallel-psi.vercel.app', 'http://localhost:3000'],
    credentials: true,
  });

  // Dynamic import for ES module
  const { default: graphqlUploadExpress } = await import(
    'graphql-upload/graphqlUploadExpress.mjs'
  );
  app.use(graphqlUploadExpress({ maxFileSize: 10000000, maxFiles: 1 }));
  console.log(
    `🚀 Starting in ${process.env.NODE_ENV} mode, PORT ${process.env.PORT}`,
  );
  await app.listen(process.env.PORT!);
}
bootstrap();
