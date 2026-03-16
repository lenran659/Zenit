import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import { eq } from 'drizzle-orm';

import * as schema from './mvp-schema';

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is required');
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ...(process.env.NODE_ENV === 'production' && {
    ssl: {
      rejectUnauthorized: false,
    },
  }),
});

export const db = drizzle(pool, { schema });

export * from './mvp-schema';
export { pool };

function nowIso() {
  return new Date().toISOString();
}

export async function ensureDefaultUser() {
  const defaultUserId = 'user_alice';
  const existing = await db.select().from(schema.users).where(eq(schema.users.id, defaultUserId)).limit(1);
  if (existing.length > 0) return;

  const t = nowIso();
  await db.insert(schema.users).values({
    id: defaultUserId,
    name: 'Alice',
    email: 'alice@zenit.dev',
    createdAt: new Date(t),
    updatedAt: new Date(t),
  });
}
