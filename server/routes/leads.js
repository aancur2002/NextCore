const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const db = require('../db/client');
const { authenticateToken, requireRole } = require('../middleware/auth');
const rateLimit = require('express-rate-limit');
const { sendAdminNotification, sendUserConfirmation } = require('../utils/emailService');

const contactFormLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 requests per windowMs
  message: { error: 'Too many support requests created from this IP, please try again after 15 minutes' }
});

// POST /api/leads - Public contact form submission (No auth required)
router.post('/', contactFormLimiter, async (req, res) => {
  const { name, phone, email, organization, service_type, description, source } = req.body;

  if (!name || !phone || !description) {
    return res.status(400).json({ error: 'Name, phone number, and description are required.' });
  }

  try {
    const result = await db.query(
      `INSERT INTO leads (name, phone, email, organization, service_type, description, source, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7, 'new')
       RETURNING *`,
      [
        name,
        phone,
        email || null,
        organization || null,
        service_type || 'other',
        description,
        source || 'website'
      ]
    );

    res.status(201).json({
      message: 'Inquiry submitted successfully! Reference number: NCS-LEAD-' + result.rows[0].id,
      lead: result.rows[0]
    });

    // Send emails asynchronously (do not block the response)
    sendAdminNotification(result.rows[0]).catch(err => console.error(err));
    if (email) {
      sendUserConfirmation(email, result.rows[0]).catch(err => console.error(err));
    }
  } catch (error) {
    console.error('Create lead error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/leads - Admin and Staff only
router.get('/', authenticateToken, requireRole(['admin', 'staff']), async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM leads ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (error) {
    console.error('List leads error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/leads/:id/convert - Admin only
// Converts a lead to a registered customer, creating a user login and customer profile.
router.post('/:id/convert', authenticateToken, requireRole(['admin']), async (req, res) => {
  const leadId = req.params.id;
  const { address, customer_type, amc_status, amc_start, amc_end, notes } = req.body;

  try {
    // 1. Fetch lead details
    const leadResult = await db.query('SELECT * FROM leads WHERE id = $1', [leadId]);
    if (leadResult.rows.length === 0) {
      return res.status(404).json({ error: 'Lead not found.' });
    }

    const lead = leadResult.rows[0];

    if (lead.status === 'converted') {
      return res.status(400).json({ error: 'This lead has already been converted to a customer.' });
    }

    // 2. Generate a temporary password (e.g. Nxt@12345 using last digits of phone or random)
    const phoneDigits = lead.phone.replace(/\D/g, '');
    const lastFour = phoneDigits.slice(-4) || '1234';
    const tempPassword = `Nxt@${lastFour}`;

    // 3. Hash temporary password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(tempPassword, salt);

    // 4. Set up an email-based username. If no email exists, generate one
    const normalizedEmail = lead.email ? lead.email.toLowerCase().trim() : `${lead.name.toLowerCase().replace(/\s+/g, '')}@nextcore-client.com`;

    // Perform database transaction to ensure atomic creation
    await db.query('BEGIN');

    // Check if user already exists
    let userId;
    const existingUser = await db.query('SELECT id FROM users WHERE email = $1', [normalizedEmail]);
    
    if (existingUser.rows.length > 0) {
      userId = existingUser.rows[0].id;
    } else {
      // Insert User
      const userResult = await db.query(
        `INSERT INTO users (name, email, phone, password_hash, role)
         VALUES ($1, $2, $3, $4, 'customer')
         RETURNING id`,
        [lead.name, normalizedEmail, lead.phone, passwordHash]
      );
      userId = userResult.rows[0].id;
    }

    // Check if customer profile exists
    let customerId;
    const existingCust = await db.query('SELECT id FROM customers WHERE user_id = $1', [userId]);
    
    if (existingCust.rows.length > 0) {
      customerId = existingCust.rows[0].id;
    } else {
      // Insert Customer profile
      const custResult = await db.query(
        `INSERT INTO customers (user_id, organization, address, customer_type, amc_status, amc_start, amc_end, notes)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
         RETURNING id`,
        [
          userId,
          lead.organization || null,
          address || 'Bharatpur, Chitwan',
          customer_type || (lead.organization ? 'business' : 'individual'),
          amc_status || 'none',
          amc_start || null,
          amc_end || null,
          notes || `Converted from Lead reference NCS-LEAD-${lead.id}. ${lead.description}`
        ]
      );
      customerId = custResult.rows[0].id;
    }

    // 5. Update Lead status and link to customer
    await db.query(
      `UPDATE leads 
       SET status = 'converted', converted_customer_id = $1 
       WHERE id = $2`,
      [customerId, leadId]
    );

    await db.query('COMMIT');

    res.json({
      message: 'Lead successfully converted to Customer!',
      credentials: {
        username: normalizedEmail,
        temporaryPassword: tempPassword
      },
      customer: {
        id: customerId,
        userId: userId,
        name: lead.name,
        organization: lead.organization
      }
    });

  } catch (error) {
    await db.query('ROLLBACK');
    console.error('Convert lead error:', error);
    res.status(500).json({ error: 'Internal server error during conversion.' });
  }
});

module.exports = router;
