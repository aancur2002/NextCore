const express = require('express');
const router = express.Router();
const db = require('../db/client');
const { authenticateToken, requireRole } = require('../middleware/auth');

// GET /api/customers - Admin and Staff only
router.get('/', authenticateToken, requireRole(['admin', 'staff']), async (req, res) => {
  try {
    const queryText = `
      SELECT c.id, c.organization, c.address, c.customer_type, c.amc_status, c.amc_start, c.amc_end, c.notes,
             u.name, u.email, u.phone, u.is_active
      FROM customers c
      JOIN users u ON c.user_id = u.id
      ORDER BY u.name ASC
    `;
    const result = await db.query(queryText);
    res.json(result.rows);
  } catch (error) {
    console.error('List customers error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/customers/me/profile - Logged-in Customer only
router.get('/me/profile', authenticateToken, requireRole(['customer']), async (req, res) => {
  try {
    const queryText = `
      SELECT c.id, c.organization, c.address, c.customer_type, c.amc_status, c.amc_start, c.amc_end, c.notes, c.contact_email,
             u.name, u.email, u.phone
      FROM customers c
      JOIN users u ON c.user_id = u.id
      WHERE u.id = $1
    `;
    const result = await db.query(queryText, [req.user.id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Customer profile not found.' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Get self customer profile error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PUT /api/customers/me/profile - Logged-in Customer only (Update profile)
router.put('/me/profile', authenticateToken, requireRole(['customer']), async (req, res) => {
  const { name, phone, address, notes, contact_email } = req.body;
  const userId = req.user.id;

  try {
    await db.query('BEGIN');
    
    // Update Users table (Name, Phone)
    if (name || phone) {
      const uRes = await db.query('SELECT name, phone FROM users WHERE id = $1', [userId]);
      if (uRes.rows.length === 0) {
        await db.query('ROLLBACK');
        return res.status(404).json({ error: 'User not found.' });
      }
      const currentU = uRes.rows[0];
      await db.query(
        'UPDATE users SET name = $1, phone = $2 WHERE id = $3',
        [name || currentU.name, phone || currentU.phone, userId]
      );
    }

    // Update Customers table (Address, Notes, Contact Email)
    if (address !== undefined || notes !== undefined || contact_email !== undefined) {
      const cRes = await db.query('SELECT address, notes, contact_email FROM customers WHERE user_id = $1', [userId]);
      if (cRes.rows.length === 0) {
        await db.query('ROLLBACK');
        return res.status(404).json({ error: 'Customer profile not found.' });
      }
      const currentC = cRes.rows[0];
      await db.query(
        'UPDATE customers SET address = $1, notes = $2, contact_email = $3 WHERE user_id = $4',
        [
          address !== undefined ? address : currentC.address,
          notes !== undefined ? notes : currentC.notes,
          contact_email !== undefined ? contact_email : currentC.contact_email,
          userId
        ]
      );
    }
    
    await db.query('COMMIT');
    res.json({ message: 'Profile updated successfully' });
  } catch (error) {
    await db.query('ROLLBACK');
    console.error('Update self customer profile error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/customers/me/devices - Logged-in Customer only
router.get('/me/devices', authenticateToken, requireRole(['customer']), async (req, res) => {
  try {
    // First, find customer ID
    const custResult = await db.query('SELECT id FROM customers WHERE user_id = $1', [req.user.id]);
    if (custResult.rows.length === 0) {
      return res.status(404).json({ error: 'Customer profile not found.' });
    }
    const customerId = custResult.rows[0].id;

    // Fetch devices (excluding secure details like pin if needed, but for simplicity let's show all or just decrypt)
    const result = await db.query('SELECT * FROM remote_devices WHERE customer_id = $1', [customerId]);
    res.json(result.rows);
  } catch (error) {
    console.error('List self devices error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/customers/me/devices - Customer adding their own device
router.post('/me/devices', authenticateToken, requireRole(['customer']), async (req, res) => {
  const { nickname, device_type, anydesk_id, teamviewer_id, os, hardware_notes, notes } = req.body;

  if (!nickname) return res.status(400).json({ error: 'Device nickname is required.' });

  try {
    const custResult = await db.query('SELECT id FROM customers WHERE user_id = $1', [req.user.id]);
    if (custResult.rows.length === 0) return res.status(404).json({ error: 'Customer profile not found.' });
    const customerId = custResult.rows[0].id;

    const result = await db.query(
      `INSERT INTO remote_devices (customer_id, nickname, device_type, anydesk_id, teamviewer_id, os, hardware_notes, notes)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
      [customerId, nickname, device_type || 'Desktop', anydesk_id || null, teamviewer_id || null, os || 'Windows 11', hardware_notes || null, notes || null]
    );

    res.status(201).json({ message: 'Device added to Vault.', device: result.rows[0] });
  } catch (error) {
    console.error('Create self device error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PUT /api/customers/me/devices/:deviceId - Customer editing their own device
router.put('/me/devices/:deviceId', authenticateToken, requireRole(['customer']), async (req, res) => {
  const { nickname, device_type, anydesk_id, teamviewer_id, os, hardware_notes, notes } = req.body;
  const { deviceId } = req.params;

  try {
    const custResult = await db.query('SELECT id FROM customers WHERE user_id = $1', [req.user.id]);
    if (custResult.rows.length === 0) return res.status(404).json({ error: 'Customer profile not found.' });
    const customerId = custResult.rows[0].id;

    const currentDevice = await db.query('SELECT * FROM remote_devices WHERE id = $1 AND customer_id = $2', [deviceId, customerId]);
    if (currentDevice.rows.length === 0) return res.status(404).json({ error: 'Device not found.' });
    
    const curr = currentDevice.rows[0];

    const result = await db.query(
      `UPDATE remote_devices SET 
        nickname = $1, device_type = $2, anydesk_id = $3, teamviewer_id = $4, os = $5, hardware_notes = $6, notes = $7
       WHERE id = $8 AND customer_id = $9 RETURNING *`,
      [
        nickname || curr.nickname, 
        device_type || curr.device_type, 
        anydesk_id !== undefined ? anydesk_id : curr.anydesk_id,
        teamviewer_id !== undefined ? teamviewer_id : curr.teamviewer_id,
        os || curr.os,
        hardware_notes !== undefined ? hardware_notes : curr.hardware_notes,
        notes !== undefined ? notes : curr.notes,
        deviceId, customerId
      ]
    );

    res.json({ message: 'Device updated.', device: result.rows[0] });
  } catch (error) {
    console.error('Update self device error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// DELETE /api/customers/me/devices/:deviceId - Customer deleting their own device
router.delete('/me/devices/:deviceId', authenticateToken, requireRole(['customer']), async (req, res) => {
  const { deviceId } = req.params;

  try {
    const custResult = await db.query('SELECT id FROM customers WHERE user_id = $1', [req.user.id]);
    if (custResult.rows.length === 0) return res.status(404).json({ error: 'Customer profile not found.' });
    const customerId = custResult.rows[0].id;

    const result = await db.query('DELETE FROM remote_devices WHERE id = $1 AND customer_id = $2 RETURNING *', [deviceId, customerId]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Device not found.' });

    res.json({ message: 'Device removed from Vault.' });
  } catch (error) {
    console.error('Delete self device error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/customers/:id - Admin and Staff only
router.get('/:id', authenticateToken, requireRole(['admin', 'staff']), async (req, res) => {
  const customerId = req.params.id;

  try {
    // 1. Fetch Profile
    const profileQuery = `
      SELECT c.id, c.organization, c.address, c.customer_type, c.amc_status, c.amc_start, c.amc_end, c.notes,
             u.name, u.email, u.phone, u.is_active
      FROM customers c
      JOIN users u ON c.user_id = u.id
      WHERE c.id = $1
    `;
    const profileResult = await db.query(profileQuery, [customerId]);
    if (profileResult.rows.length === 0) {
      return res.status(404).json({ error: 'Customer not found.' });
    }

    // 2. Fetch Devices
    const devicesResult = await db.query('SELECT * FROM remote_devices WHERE customer_id = $1', [customerId]);

    // 3. Fetch Tickets
    const ticketsQuery = `
      SELECT t.id, t.ticket_number, t.category, t.priority, t.subject, t.status, t.created_at, t.resolved_at,
             u.name as assigned_staff_name
      FROM tickets t
      LEFT JOIN users u ON t.assigned_to = u.id
      WHERE t.customer_id = $1
      ORDER BY t.created_at DESC
    `;
    const ticketsResult = await db.query(ticketsQuery, [customerId]);

    res.json({
      profile: profileResult.rows[0],
      devices: devicesResult.rows,
      tickets: ticketsResult.rows
    });

  } catch (error) {
    console.error('Get customer detail error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PUT /api/customers/:id - Admin only (Update customer info, AMC, password)
router.put('/:id', authenticateToken, requireRole(['admin']), async (req, res) => {
  const customerId = req.params.id;
  const { name, email, phone, address, organization, customer_type, amc_status, amc_start, amc_end, notes, password } = req.body;

  try {
    // Get user_id from customer record
    const custResult = await db.query('SELECT user_id FROM customers WHERE id = $1', [customerId]);
    if (custResult.rows.length === 0) {
      return res.status(404).json({ error: 'Customer not found.' });
    }
    const userId = custResult.rows[0].user_id;

    await db.query('BEGIN');

    // Update users table (name, email, phone, password)
    const userFields = [];
    const userValues = [];
    let paramCount = 1;

    if (name !== undefined) { userFields.push(`name = $${paramCount++}`); userValues.push(name); }
    if (email !== undefined) { userFields.push(`email = $${paramCount++}`); userValues.push(email); }
    if (phone !== undefined) { userFields.push(`phone = $${paramCount++}`); userValues.push(phone); }

    if (password && password.trim() !== '') {
      const bcrypt = require('bcryptjs');
      const hashedPassword = await bcrypt.hash(password, 10);
      userFields.push(`password_hash = $${paramCount++}`);
      userValues.push(hashedPassword);
    }

    if (userFields.length > 0) {
      userValues.push(userId);
      await db.query(
        `UPDATE users SET ${userFields.join(', ')} WHERE id = $${paramCount}`,
        userValues
      );
    }

    // Update customers table
    const custFields = [];
    const custValues = [];
    let custParam = 1;

    if (address !== undefined) { custFields.push(`address = $${custParam++}`); custValues.push(address); }
    if (organization !== undefined) { custFields.push(`organization = $${custParam++}`); custValues.push(organization); }
    if (customer_type !== undefined) { custFields.push(`customer_type = $${custParam++}`); custValues.push(customer_type); }
    if (amc_status !== undefined) { custFields.push(`amc_status = $${custParam++}`); custValues.push(amc_status); }
    if (amc_start !== undefined) { custFields.push(`amc_start = $${custParam++}`); custValues.push(amc_start || null); }
    if (amc_end !== undefined) { custFields.push(`amc_end = $${custParam++}`); custValues.push(amc_end || null); }
    if (notes !== undefined) { custFields.push(`notes = $${custParam++}`); custValues.push(notes); }

    if (custFields.length > 0) {
      custValues.push(customerId);
      await db.query(
        `UPDATE customers SET ${custFields.join(', ')} WHERE id = $${custParam}`,
        custValues
      );
    }

    await db.query('COMMIT');

    // Fetch updated profile to return
    const updatedProfile = await db.query(`
      SELECT c.id, c.organization, c.address, c.customer_type, c.amc_status, c.amc_start, c.amc_end, c.notes,
             u.name, u.email, u.phone, u.is_active
      FROM customers c
      JOIN users u ON c.user_id = u.id
      WHERE c.id = $1
    `, [customerId]);

    res.json({ message: 'Customer updated successfully.', profile: updatedProfile.rows[0] });
  } catch (error) {
    await db.query('ROLLBACK');
    console.error('Update customer error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/customers/:id/devices - Admin and Staff only (Add remote device)
router.post('/:id/devices', authenticateToken, requireRole(['admin', 'staff']), async (req, res) => {
  const customerId = req.params.id;
  const { nickname, device_type, anydesk_id, teamviewer_id, pin_encrypted, os, hardware_notes, notes } = req.body;

  if (!nickname) {
    return res.status(400).json({ error: 'Device nickname is required.' });
  }

  try {
    const checkCust = await db.query('SELECT id FROM customers WHERE id = $1', [customerId]);
    if (checkCust.rows.length === 0) {
      return res.status(404).json({ error: 'Customer not found.' });
    }

    const result = await db.query(
      `INSERT INTO remote_devices (customer_id, nickname, device_type, anydesk_id, teamviewer_id, pin_encrypted, os, hardware_notes, notes)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       RETURNING *`,
      [
        customerId,
        nickname,
        device_type || 'Desktop',
        anydesk_id || null,
        teamviewer_id || null,
        pin_encrypted || null,
        os || 'Windows 11',
        hardware_notes || null,
        notes || null
      ]
    );

    res.status(201).json({
      message: 'Remote device registered successfully in Vault!',
      device: result.rows[0]
    });
  } catch (error) {
    console.error('Create remote device error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// DELETE /api/customers/:id/devices/:deviceId - Admin only
router.delete('/:id/devices/:deviceId', authenticateToken, requireRole(['admin']), async (req, res) => {
  const { id, deviceId } = req.params;

  try {
    const result = await db.query('DELETE FROM remote_devices WHERE id = $1 AND customer_id = $2 RETURNING *', [deviceId, id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Device not found in this customer vault.' });
    }

    res.json({ message: 'Remote device successfully removed from Vault.' });
  } catch (error) {
    console.error('Delete remote device error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
