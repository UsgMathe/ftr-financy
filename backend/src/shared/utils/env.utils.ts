import 'dotenv/config';

import z from 'zod';

const envSchema = z.object({
  DATABASE_URL: z.string(),
  PORT: z.coerce.number().default(4000),
  ADMIN_EMAIL: z.string(),
  ADMIN_PASSWORD: z.string(),
  ADMIN_NAME: z.string(),
});

export const env = envSchema.parse(process.env);
