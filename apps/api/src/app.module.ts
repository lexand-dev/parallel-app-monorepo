import { join } from 'node:path';
import { Module } from '@nestjs/common';
import { APP_PIPE } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';
import { ZodValidationPipe } from 'nestjs-zod';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';

import { validateEnv } from './config/env';
import { DatabaseModule } from '@/db/db.module';
import { AuthModule } from '@/graphql/auth/auth.module';
import { UsersModule } from '@/graphql/users/users.module';
import { MembersModule } from './graphql/members/members.module';
import { ProjectsModule } from './graphql/projects/projects.module';
import { TasksModule } from './graphql/tasks/tasks.module';
import { WorkspacesModule } from './graphql/workspaces/workspaces.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate: validateEnv,
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      playground: false,
      plugins: [ApolloServerPluginLandingPageLocalDefault()],
      // Schema first:
      typePaths: ['./**/*.graphql'],
      definitions: {
        path: join(process.cwd(), 'src/graphql.ts'),
        enumsAsTypes: true,
        outputAs: 'class',
      },
    }),
    // Global Module
    DatabaseModule,
    // App Modules
    UsersModule,
    AuthModule,
    MembersModule,
    ProjectsModule,
    TasksModule,
    WorkspacesModule,
  ],
  providers: [
    {
      provide: APP_PIPE,
      useClass: ZodValidationPipe,
    },
  ],
})
export class AppModule {}
