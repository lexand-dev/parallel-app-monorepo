// src/config/env.ts
import { z } from 'zod';

export const envSchema = z.object({
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),
  PORT: z.coerce.number().default(4000),
  DATABASE_URL: z
    .string()
    .url()
    .refine((url) => url.startsWith('postgres'), {
      message: 'DATABASE_URL must be a PostgreSQL URL',
    }),
  JWT_EXPIRES_IN: z.string().default('7d'),
  JWT_SECRET: z.string().min(1, 'JWT_SECRET is required'),
  COOKIE_SECRET: z.string().min(1, 'COOKIE_SECRET is required'),
  BCRYPT_SALT_ROUNDS: z.coerce.number().default(10),
});

type Env = z.infer<typeof envSchema>;
export type ConfigType = Env;

export const validateEnv = (config: Record<string, unknown>): Env => {
  const parsed = envSchema.safeParse(config);

  if (!parsed.success) {
    console.error('❌ Invalid environment variables:');
    parsed.error.issues.forEach((issue) =>
      console.error(` - ${issue.path.join('.')}: ${issue.message}`),
    );
    throw new Error('Environment validation failed');
  }

  return parsed.data;
};
