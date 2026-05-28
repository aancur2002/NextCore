const express = require('express');
const router = express.Router();
const db = require('../db/client');
const bcrypt = require('bcryptjs');
const { authenticateToken } = require('../middleware/auth');

// POST /api/clients (Admin only - manual client creation)
router.post('/', authenticateToken, async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Only admins can create clients' });
  }

  const { name, email, phone, password, organization, address, customer_type, amc_status, amc_start, amc_end, notes } = req.body;
  if (!name || !email || !phone || !password) {
    return res.status(400).json({ error: 'Name, email, phone, and password are required' });
  }

  try {
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Create user record
    const userResult = await db.query(`
      INSERT INTO users (name, email, phone, password_hash, role)
      VALUES ($1, $2, $3, $4, 'customer')
      RETURNING id, name, email, phone, role, is_active, created_at
    `, [name, email, phone, passwordHash]);

    const user = userResult.rows[0];

    // Create customer record linked to user
    const customerResult = await db.query(`
      INSERT INTO customers (user_id, organization, address, customer_type, amc_status, amc_start, amc_end, notes)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *
    `, [user.id, organization || null, address || null, customer_type || 'individual', amc_status || 'none', amc_start || null, amc_end || null, notes || null]);

    res.status(201).json({
      message: 'Client created successfully',
      user: user,
      customer: customerResult.rows[0]
    });
  } catch (err) {
    if (err.code === '23505') {
      return res.status(409).json({ error: 'A user with this email already exists' });
    }
    console.error('Error creating client:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
