import { Inject } from '@nestjs/common';
import { db } from '.';

// Define a constant for the database provider token
export const DB_PROVIDER = 'DbProvider';

// Create a custom decorator to inject the database instance
export const InjectDb = () => Inject(DB_PROVIDER);

export const dbProvider = {
  // Use the defined token for the provider
  provide: DB_PROVIDER,
  // Use the existing database instance
  useValue: db,
};
