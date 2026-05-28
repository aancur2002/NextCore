const db = require('./client');

async function migrateSettings() {
  console.log('Migrating settings table...');
  try {
    await db.query(`
      CREATE TABLE IF NOT EXISTS settings (
        key VARCHAR(100) PRIMARY KEY,
        value TEXT
      );
    `);
    console.log('Settings table created.');

    const defaults = [
      ['smtp_host', 'smtp.gmail.com'],
      ['smtp_port', '587'],
      ['smtp_user', 'anupghimire@gmail.com'],
      ['smtp_pass', ''],
      ['admin_email', 'anupghimire@gmail.com'],
      ['social_facebook', 'https://facebook.com/nextcoresystem'],
      ['social_twitter', 'https://twitter.com/nextcoresystem'],
      ['social_linkedin', 'https://linkedin.com/company/nextcoresystem'],
      ['social_instagram', 'https://instagram.com/nextcoresystem'],
      ['contact_email', 'anupghimire@gmail.com']
    ];

    for (const [key, value] of defaults) {
      await db.query(`
        INSERT INTO settings (key, value)
        VALUES ($1, $2)
        ON CONFLICT (key) DO NOTHING;
      `, [key, value]);
    }
    
    console.log('Settings seeded.');
  } catch (err) {
    console.error('Error migrating settings:', err);
  } finally {
    db.pool.end();
  }
}

migrateSettings();
