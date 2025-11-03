import * as schema from './schema';
import { Inject } from '@nestjs/common';
import { NeonHttpDatabase } from 'drizzle-orm/neon-http';

export const DB_CONNECTION = 'DB_CONNECTION';

// Custom provider
export const InjectDb = () => Inject(DB_CONNECTION);
export type DB = NeonHttpDatabase<typeof schema>;
