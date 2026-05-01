const { Pool } = require('pg');
const fs = require('fs');
require('dotenv').config();

// Read the schema file
const schema = fs.readFileSync('./db/schema.sql', 'utf8');

/**
 * Database Setup Script
 * Supports both cloud (DATABASE_URL) and local (individual env vars) connections
 * 
 * For cloud DBs (Neon, Supabase): The database already exists, so we skip creation
 * For local PostgreSQL: We create the database if it doesn't exist
 */

async function setupDatabase() {
  const isCloudDB = !!process.env.DATABASE_URL;

  if (isCloudDB) {
    // Cloud database — database already exists, just run schema + migrations
    console.log('☁️  Cloud database detected (DATABASE_URL)');
    console.log('🔄 Connecting to cloud database...');

    const dbPool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false },
    });

    try {
      // Test connection
      const testResult = await dbPool.query('SELECT NOW()');
      console.log(`✅ Connected! Server time: ${testResult.rows[0].now}`);

      // Run schema
      console.log('🔄 Running schema...');
      await dbPool.query(schema);
      console.log('✅ Schema created successfully!');

      // Run migrations
      const migrationFiles = fs.readdirSync('./db')
        .filter((file) => file.endsWith('.sql') && file !== 'schema.sql')
        .sort();

      for (const migrationFile of migrationFiles) {
        console.log(`🔄 Applying migration: ${migrationFile}`);
        const migrationSql = fs.readFileSync(`./db/${migrationFile}`, 'utf8');
        await dbPool.query(migrationSql);
        console.log(`✅ Migration applied: ${migrationFile}`);
      }

      await dbPool.end();
      console.log('\n✅ Cloud database setup complete!');
      console.log('📍 Run "npm run dev" to start the server');
      process.exit(0);
    } catch (error) {
      console.error('❌ Error:', error.message);
      console.error('\n💡 Make sure:');
      console.error('   1. DATABASE_URL in .env is correct');
      console.error('   2. Cloud database service is running');
      console.error('   3. Your IP is not blocked by firewall');
      await dbPool.end();
      process.exit(1);
    }
  } else {
    // Local PostgreSQL — create database if needed
    console.log('🏠 Local database detected');

    const adminPool = new Pool({
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      database: 'postgres',
    });

    try {
      console.log('🔄 Checking if database exists...');

      const dbResult = await adminPool.query(
        `SELECT 1 FROM pg_database WHERE datname = $1`,
        [process.env.DB_NAME]
      );

      if (dbResult.rows.length === 0) {
        console.log(`✅ Creating database "${process.env.DB_NAME}"...`);
        await adminPool.query(`CREATE DATABASE ${process.env.DB_NAME};`);
        console.log(`✅ Database created successfully!`);
      } else {
        console.log(`✅ Database "${process.env.DB_NAME}" already exists!`);
      }

      const dbPool = new Pool({
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        database: process.env.DB_NAME,
      });

      console.log('🔄 Running schema...');
      await dbPool.query(schema);
      console.log('✅ Schema created successfully!');

      const migrationFiles = fs.readdirSync('./db')
        .filter((file) => file.endsWith('.sql') && file !== 'schema.sql')
        .sort();

      for (const migrationFile of migrationFiles) {
        console.log(`🔄 Applying migration: ${migrationFile}`);
        const migrationSql = fs.readFileSync(`./db/${migrationFile}`, 'utf8');
        await dbPool.query(migrationSql);
        console.log(`✅ Migration applied: ${migrationFile}`);
      }

      await dbPool.end();
      await adminPool.end();

      console.log('\n✅ Database setup complete!');
      console.log(`📍 Run "npm run dev" to start the server`);
      process.exit(0);
    } catch (error) {
      console.error('❌ Error:', error.message);
      console.error('\n💡 Make sure:');
      console.error('   1. PostgreSQL is installed and running');
      console.error('   2. .env file has correct DB credentials');
      console.error('   3. Default postgres user has password set');

      await adminPool.end();
      process.exit(1);
    }
  }
}

setupDatabase();
