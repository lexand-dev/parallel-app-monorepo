import { ConfigService } from '@nestjs/config';
import { Global, Module } from '@nestjs/common';
import { drizzle as drizzlePg } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';

import * as schema from './schema';
import { ConfigType } from '../config/env';
import { DB_CONNECTION } from './db.provider';

@Global()
@Module({
  providers: [
    {
      provide: DB_CONNECTION,
      useFactory(config: ConfigService<ConfigType>) {
        const databaseUrl = config.get('DATABASE_URL')!;

        const isLocal =
          databaseUrl.includes('@parallel-db') ||
          databaseUrl.includes('localhost');

        if (isLocal) {
          // Local connection (Docker/Postgres)
          const pool = new Pool({ connectionString: databaseUrl });
          return drizzlePg(pool, { schema });
        }

        // Neon connection (serverless)
        const sql = neon(databaseUrl);
        return drizzle(sql, { schema });
      },
      inject: [ConfigService],
    },
  ],
  exports: [DB_CONNECTION],
})
export class DatabaseModule {}
