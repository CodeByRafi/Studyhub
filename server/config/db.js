require('dotenv').config();
const { Pool } = require('pg');

/**
 * Database connection configuration
 * Supports both cloud (DATABASE_URL) and local (individual env vars) connections
 * 
 * Cloud providers (Neon, Supabase, etc.) provide a single DATABASE_URL.
 * Local PostgreSQL uses individual DB_HOST, DB_USER, etc.
 */

let poolConfig;

if (process.env.DATABASE_URL) {
  // Cloud database (Neon, Supabase, Render, etc.)
  console.log('📡 Using cloud database (DATABASE_URL)');
  poolConfig = {
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
    max: 10,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 10000,
  };
} else {
  // Local PostgreSQL
  const requiredEnv = ['DB_USER', 'DB_PASSWORD', 'DB_HOST', 'DB_PORT', 'DB_NAME'];
  requiredEnv.forEach((key) => {
    if (!process.env[key]) {
      throw new Error(`Missing required environment variable: ${key}`);
    }
  });

  console.log('🏠 Using local database');
  poolConfig = {
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: parseInt(process.env.DB_PORT, 10),
    ssl: false,
  };
}

const pool = new Pool(poolConfig);

// Log connection success/failure
pool.on('connect', () => {
  console.log('✅ Database connected successfully');
});

pool.on('error', (err) => {
  console.error('❌ Unexpected database error:', err.message);
});

module.exports = pool;