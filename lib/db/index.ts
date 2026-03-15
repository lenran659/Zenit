import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from './schema';

// 创建 PostgreSQL 连接池
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  // 生产环境建议添加这些配置
  ...(process.env.NODE_ENV === 'production' && {
    ssl: {
      rejectUnauthorized: false,
    },
  }),
});

// 创建 Drizzle ORM 实例
export const db = drizzle(pool, { schema });

// 导出 schema 供使用
export * from './schema';

// 导出连接池（需要时可直接使用）
export { pool };
