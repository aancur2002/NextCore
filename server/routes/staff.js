const express = require('express');
const router = express.Router();
const db = require('../db/client');
const bcrypt = require('bcryptjs');
const { authenticateToken } = require('../middleware/auth');

// GET /api/staff (Admin only)
router.get('/', authenticateToken, async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Only admins can view staff members' });
  }

  try {
    const result = await db.query(`
      SELECT id, name, email, phone, role, is_active, created_at 
      FROM users 
      WHERE role = 'staff' 
      ORDER BY created_at DESC
    `);
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching staff:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/staff (Admin only)
router.post('/', authenticateToken, async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Only admins can create staff members' });
  }

  const { name, email, phone, password, role } = req.body;
  if (!name || !email || !phone || !password) {
    return res.status(400).json({ error: 'Name, email, phone, and password are required' });
  }

  const staffRole = role || 'staff';

  try {
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const result = await db.query(`
      INSERT INTO users (name, email, phone, password_hash, role)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id, name, email, phone, role, is_active, created_at
    `, [name, email, phone, passwordHash, staffRole]);

    res.status(201).json(result.rows[0]);
  } catch (err) {
    if (err.code === '23505') {
      return res.status(409).json({ error: 'A user with this email already exists' });
    }
    console.error('Error creating staff member:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// DELETE /api/staff/:id (Admin only - soft delete / deactivate)
router.delete('/:id', authenticateToken, async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Only admins can deactivate staff members' });
  }

  try {
    const result = await db.query(`
      UPDATE users SET is_active = FALSE 
      WHERE id = $1 AND role = 'staff' 
      RETURNING id, name, email, is_active
    `, [req.params.id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Staff member not found' });
    }
    res.json({ message: 'Staff member deactivated successfully', staff: result.rows[0] });
  } catch (err) {
    console.error('Error deactivating staff member:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});
// PUT /api/staff/:id/password (Admin only - change password)
router.put('/:id/password', authenticateToken, async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Only admins can change staff passwords' });
  }

  const { newPassword } = req.body;
  if (!newPassword || newPassword.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters long' });
  }

  try {
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(newPassword, salt);

    const result = await db.query(`
      UPDATE users SET password_hash = $1 
      WHERE id = $2 AND role = 'staff' 
      RETURNING id, name, email
    `, [passwordHash, req.params.id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Staff member not found' });
    }
    res.json({ message: 'Password updated successfully' });
  } catch (err) {
    console.error('Error updating staff password:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
