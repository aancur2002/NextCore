const { Pool } = require('pg');

// Read DATABASE_URL from Render environment variables
const connectionString = process.env.DATABASE_URL;

// Safety check (fail fast if missing)
if (!connectionString) {
  console.error('❌ ERROR: DATABASE_URL is not set in environment variables');
  process.exit(1);
}

console.log('🔄 Connecting to PostgreSQL database...');

// Create PostgreSQL connection pool
const pool = new Pool({
  connectionString,
  ssl: {
    rejectUnauthorized: false, // Required for Aiven / Render SSL
  },
  max: 10, // optional: connection pool size
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000,
});

// Test connection on startup (optional but helpful)
pool.connect()
  .then(client => {
    console.log('✅ PostgreSQL connected successfully');
    client.release();
  })
  .catch(err => {
    console.error('❌ PostgreSQL connection error:', err.message);
  });

// Export query helper
module.exports = {
  query: (text, params) => pool.query(text, params),
  pool,
};
