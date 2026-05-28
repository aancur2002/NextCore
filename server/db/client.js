const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

let connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  // Try reading connection string from pgsql.txt
  try {
    const pgsqlPath = path.join(__dirname, '../../pgsql.txt');
    if (fs.existsSync(pgsqlPath)) {
      const content = fs.readFileSync(pgsqlPath, 'utf8');
      // Extract URI matching postgres://...
      const match = content.match(/postgres:\/\/[^\s]+/);
      if (match) {
        connectionString = match[0].trim();
      }
    }
  } catch (err) {
    console.error('Error reading pgsql.txt:', err);
  }
}

// Fallback: throw a clear error if no connection string is found
if (!connectionString) {
  console.error('ERROR: DATABASE_URL is not set. Please configure it in server/.env');
  process.exit(1);
}

// CRITICAL FIX: Strip sslmode parameter from the connection string.
// If it contains ?sslmode=require or &sslmode=require, the pg library overrides 
// the custom ssl config and fails with a self-signed certificate error.
if (connectionString) {
  connectionString = connectionString.replace(/[\?&]sslmode=[^&]+/g, '');
}

console.log('Connecting to PostgreSQL database with SSL safety...');

const pool = new Pool({
  connectionString: connectionString,
  ssl: {
    rejectUnauthorized: false // Bypasses self-signed certificate error for Aiven
  }
});

module.exports = {
  query: (text, params) => pool.query(text, params),
  pool: pool
};
