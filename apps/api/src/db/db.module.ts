import { ConfigService } from '@nestjs/config';
import { Global, Module } from '@nestjs/common';
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';

import * as schema from './schema';
import { ConfigType } from '@/config/env';
import { DB_CONNECTION } from './db.provider';

@Global()
@Module({
  providers: [
    {
      provide: DB_CONNECTION,
      useFactory(config: ConfigService<ConfigType>) {
        const sql = neon(config.get('DATABASE_URL')!);
        const db = drizzle(sql, { schema });
        return db;
      },
      inject: [ConfigService],
    },
  ],
  exports: [DB_CONNECTION],
})
export class DatabaseModule {}
