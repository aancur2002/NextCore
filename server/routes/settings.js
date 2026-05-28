const express = require('express');
const router = express.Router();
const db = require('../db/client');
const { authenticateToken, requireRole } = require('../middleware/auth');

// Get all settings (Admin only)
router.get('/', authenticateToken, requireRole(['admin']), async (req, res) => {
  try {
    const result = await db.query('SELECT key, value FROM settings');
    const settings = {};
    result.rows.forEach(row => {
      settings[row.key] = row.value;
    });
    res.json(settings);
  } catch (err) {
    console.error('Error fetching settings:', err);
    res.status(500).json({ error: 'Server error fetching settings' });
  }
});

// Update settings (Admin only)
router.put('/', authenticateToken, requireRole(['admin']), async (req, res) => {
  const settings = req.body;
  if (!settings || typeof settings !== 'object') {
    return res.status(400).json({ error: 'Invalid settings data format.' });
  }

  try {
    // Start transaction if we want, or just loop
    await db.query('BEGIN');
    for (const [key, value] of Object.entries(settings)) {
      await db.query(`
        INSERT INTO settings (key, value)
        VALUES ($1, $2)
        ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;
      `, [key, value]);
    }
    await db.query('COMMIT');
    res.json({ message: 'Settings updated successfully' });
  } catch (err) {
    await db.query('ROLLBACK');
    console.error('Error updating settings:', err);
    res.status(500).json({ error: 'Failed to update settings' });
  }
});

module.exports = router;
