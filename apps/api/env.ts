import { z } from 'zod';
import { env as loadEnv } from 'custom-env';

process.env.APP_STAGE = process.env.APP_STAGE || 'dev';

if (process.env.APP_STAGE === 'dev') {
  loadEnv();
} else {
  loadEnv('test');
}

const envSchema = z.object({
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),
  APP_STAGE: z.enum(['dev', 'prod', 'test']).default('dev'),
  PORT: z.coerce.number().default(3000),
  DATABASE_URL: z.string().startsWith('postgresql://'),
  COOKIE_SECRET: z.string().min(1, 'COOKIE_SECRET is required'),
  JWT_SECRET: z.string().min(1, 'JWT_SECRET is required'),
  JWT_EXPIRES_IN: z.string().default('7d'),
  BCRYPT_SALT_ROUNDS: z.coerce.number().default(10),
});

export type Env = z.infer<typeof envSchema>;
let env: Env;

try {
  env = envSchema.parse(process.env);
} catch (e) {
  if (e instanceof z.ZodError) {
    console.error('❌ Invalid environment variables');

    e.issues.forEach((issue) => {
      console.error(` - ${issue.path.join('.')}: ${issue.message}`);
    });

    throw e;
  }
  process.exit(1);
}

// Helper functions for environment checks
export const isProd = () => env.NODE_ENV === 'production';
export const isDev = () => env.NODE_ENV === 'development';
export const isTestEnv = () => env.NODE_ENV === 'test';

export { env };
