import { join } from 'node:path';
import { Module } from '@nestjs/common';
import { APP_PIPE } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';
import { ZodValidationPipe } from 'nestjs-zod';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';

import { validateEnv } from './config/env';
import { DatabaseModule } from './db/db.module';
import { AuthModule } from './graphql/auth/auth.module';
import { UsersModule } from './graphql/users/users.module';
import { TasksModule } from './graphql/tasks/tasks.module';
import { MembersModule } from './graphql/members/members.module';
import { ProjectsModule } from './graphql/projects/projects.module';
import { WorkspacesModule } from './graphql/workspaces/workspaces.module';
import { AnalyticsModule } from './graphql/analytics/analytics.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate: validateEnv,
    }),
    GraphQLModule.forRootAsync<ApolloDriverConfig>({
      driver: ApolloDriver,
      useFactory: async () => {
        const { default: GraphQLUpload } = await import(
          'graphql-upload/GraphQLUpload.mjs'
        );
        return {
          include: [
            UsersModule,
            AuthModule,
            MembersModule,
            ProjectsModule,
            TasksModule,
            WorkspacesModule,
            AnalyticsModule,
          ],
          context: ({ req, res }) => ({ req, res }),
          playground: false,
          plugins: [ApolloServerPluginLandingPageLocalDefault()],
          // Schema first:
          typePaths: [join(__dirname, './**/*.graphql')],
          definitions: {
            path: join(process.cwd(), 'src/graphql.ts'),
            /* outputAs: 'class', */
          },
          resolvers: { Upload: GraphQLUpload },
        };
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
    AnalyticsModule,
  ],
  providers: [
    {
      provide: APP_PIPE,
      useClass: ZodValidationPipe,
    },
  ],
})
export class AppModule {}
