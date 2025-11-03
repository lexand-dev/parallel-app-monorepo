import { Global, Module } from '@nestjs/common';
import { dbProvider } from './db.provider';

// This module provides the DatabaseService globally
@Global()
@Module({
  providers: [dbProvider],
  exports: [dbProvider],
})
export class DatabaseModule {}
