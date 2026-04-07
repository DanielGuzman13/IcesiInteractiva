import { Pool } from 'pg';

const globalForPostgres = globalThis as typeof globalThis & {
  __icesiPool?: Pool;
};

const createPool = () => {
  const connectionString = process.env.DATABASE_URL;

  if (!connectionString) {
    throw new Error('DATABASE_URL no está configurada');
  }

  return new Pool({
    connectionString,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  });
};

export const getPostgresPool = (): Pool => {
  if (globalForPostgres.__icesiPool) {
    return globalForPostgres.__icesiPool;
  }

  const pool = createPool();

  if (process.env.NODE_ENV !== 'production') {
    globalForPostgres.__icesiPool = pool;
  }

  return pool;
};
