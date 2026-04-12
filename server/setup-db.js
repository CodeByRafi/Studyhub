const { Pool } = require('pg');
const fs = require('fs');
require('dotenv').config();

// Read the schema file
const schema = fs.readFileSync('./db/schema.sql', 'utf8');

// First, connect to default postgres database to create studyhub database
const adminPool = new Pool({
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: 'postgres', // Connect to default postgres database first
});

async function setupDatabase() {
  try {
    console.log('🔄 Checking if database exists...');
    
    // Check if database exists
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

    // Now connect to the studyhub database and run schema + migrations
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

setupDatabase();
