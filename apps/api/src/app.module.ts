import { join } from 'node:path';
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { APP_PIPE, APP_INTERCEPTOR, APP_FILTER } from '@nestjs/core';
import { ZodValidationPipe, ZodSerializerInterceptor } from 'nestjs-zod';

import { DatabaseModule } from '@/db/db.module';
import { AuthModule } from '@/modules/auth/auth.module';
import { UsersModule } from '@/modules/users/users.module';
import { HttpExceptionFilter } from '@/modules/auth/interceptor/http-exception.filter';
import { AuthService } from '@/modules/auth/auth.service';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      graphiql: true,
      // Automatically generate schema.gql file
      // autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      // sortSchema: true,
      typePaths: ['./**/*.graphql'],
      // Load GraphQL definitions from a specific file
      definitions: {
        path: join(process.cwd(), 'src/graphql.ts'),
        enumsAsTypes: true,
        outputAs: 'class',
      },
    }),
    // DB Global Module
    DatabaseModule,

    UsersModule,
    AuthModule,
  ],
  providers: [
    {
      provide: APP_PIPE,
      useClass: ZodValidationPipe,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ZodSerializerInterceptor,
    },
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
    AuthService,
  ],
  controllers: [],
})
export class AppModule {}
