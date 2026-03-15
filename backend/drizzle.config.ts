import type { Config } from 'drizzle-kit';

export default {
  schema: './src/db/schema.ts',
  out: './src/db/migrations',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL || 'postgresql://zenit:zenit_password@localhost:5432/zenit_db',
  },
  verbose: true,
  strict: true,
} satisfies Config;
