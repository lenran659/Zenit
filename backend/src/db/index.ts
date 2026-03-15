import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';

import * as schema from './schema';

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is required');
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export const db = drizzle(pool, { schema });
export { pool };
export * from './schema';
