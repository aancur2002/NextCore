const { Pool } = require('pg');

// IMPORTANT: Helps avoid TLS handshake issues in some Render + Aiven setups
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

// Read DATABASE_URL from Render environment
const connectionString = process.env.DATABASE_URL;

// Safety check
if (!connectionString) {
  console.error('❌ DATABASE_URL is missing in environment variables');
  process.exit(1);
}

console.log('🔄 Connecting to PostgreSQL database...');

// Create PostgreSQL pool (production safe)
const pool = new Pool({
  connectionString,

  ssl: {
    rejectUnauthorized: false, // REQUIRED for Aiven / Render
  },

  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000,
});

// Test connection on startup
pool.connect()
  .then(client => {
    console.log('✅ PostgreSQL connected successfully');
    client.release();
  })
  .catch(err => {
    console.error('❌ PostgreSQL connection error:', err.message);
  });

// Graceful shutdown (Render safe)
process.on('SIGINT', async () => {
  console.log('🔻 Closing DB pool...');
  await pool.end();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('🔻 Closing DB pool...');
  await pool.end();
  process.exit(0);
});

// Export helper
module.exports = {
  query: (text, params) => pool.query(text, params),
  pool,
};
