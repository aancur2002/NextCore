const db = require('./db/client');

async function updateDb() {
  try {
    console.log('Adding contact_email to customers table...');
    await db.query(`
      ALTER TABLE customers 
      ADD COLUMN IF NOT EXISTS contact_email VARCHAR(150);
    `);
    console.log('Successfully added contact_email column.');
  } catch (err) {
    console.error('Failed to update DB:', err);
  } finally {
    process.exit(0);
  }
}

updateDb();
