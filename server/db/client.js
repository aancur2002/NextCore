const { Pool } = require('pg');

// Use only Render environment variable
const connectionString = process.env.DATABASE_URL;

// Safety check
if (!connectionString) {
  console.error('❌ DATABASE_URL is missing in environment variables');
  process.exit(1);
}

console.log('🔄 Connecting to PostgreSQL database...');

// Create pool (production-safe)
const pool = new Pool({
  connectionString,
  ssl: {
    rejectUnauthorized: false, // REQUIRED for Aiven + Render
  },
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000,
});

// Test DB connection on startup
(async () => {
  try {
    const client = await pool.connect();
    console.log('✅ PostgreSQL connected successfully');
    client.release();
  } catch (err) {
    console.error('❌ PostgreSQL connection error:', err.message);
  }
})();

// Graceful shutdown handling (important for Render stability)
process.on('SIGINT', async () => {
  console.log('🔻 Closing PostgreSQL pool...');
  await pool.end();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('🔻 Closing PostgreSQL pool...');
  await pool.end();
  process.exit(0);
});

// Export DB helper
module.exports = {
  query: (text, params) => pool.query(text, params),
  pool,
};
