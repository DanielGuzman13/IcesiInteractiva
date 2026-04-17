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
    ssl: false,
    max: 20, // Reducido para evitar agotar conexiones en red local con múltiples clientes
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
  });
};

export const getPostgresPool = (): Pool => {
  if (globalForPostgres.__icesiPool) {
    return globalForPostgres.__icesiPool;
  }

  const pool = createPool();

  // Siempre guardamos en globalThis para reutilizar el pool en todas las peticiones
  globalForPostgres.__icesiPool = pool;

  return pool;
};
