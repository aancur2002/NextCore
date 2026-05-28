const express = require('express');
const router = express.Router();
const db = require('../db/client');
const { authenticateToken, requireRole } = require('../middleware/auth');

// GET /api/tickets - Fetch tickets based on user role
// - Admin & Staff see all tickets.
// - Customers see only their own tickets.
router.get('/', authenticateToken, async (req, res) => {
  try {
    let queryText = '';
    let params = [];

    if (req.user.role === 'admin' || req.user.role === 'staff') {
      queryText = `
        SELECT t.id, t.ticket_number, t.category, t.priority, t.subject, t.status, t.sla_due, t.created_at, t.resolved_at,
               c.organization, u_cust.name as customer_name,
               u_staff.name as assigned_staff_name
        FROM tickets t
        JOIN customers c ON t.customer_id = c.id
        JOIN users u_cust ON c.user_id = u_cust.id
        LEFT JOIN users u_staff ON t.assigned_to = u_staff.id
        ORDER BY t.created_at DESC
      `;
    } else {
      // It is a customer. First, get their customer profile ID.
      const custResult = await db.query('SELECT id FROM customers WHERE user_id = $1', [req.user.id]);
      if (custResult.rows.length === 0) {
        return res.status(404).json({ error: 'Customer profile not found.' });
      }
      const customerId = custResult.rows[0].id;

      queryText = `
        SELECT t.id, t.ticket_number, t.category, t.priority, t.subject, t.status, t.sla_due, t.created_at, t.resolved_at,
               u_staff.name as assigned_staff_name
        FROM tickets t
        LEFT JOIN users u_staff ON t.assigned_to = u_staff.id
        WHERE t.customer_id = $1
        ORDER BY t.created_at DESC
      `;
      params = [customerId];
    }

    const result = await db.query(queryText, params);
    res.json(result.rows);
  } catch (error) {
    console.error('List tickets error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/tickets/:id - View single ticket details
router.get('/:id', authenticateToken, async (req, res) => {
  const ticketId = req.params.id;

  try {
    // 1. Fetch Ticket
    const ticketQuery = `
      SELECT t.*, 
             c.organization, c.notes as customer_notes,
             u_cust.name as customer_name, u_cust.email as customer_email, u_cust.phone as customer_phone,
             u_staff.name as assigned_staff_name
      FROM tickets t
      JOIN customers c ON t.customer_id = c.id
      JOIN users u_cust ON c.user_id = u_cust.id
      LEFT JOIN users u_staff ON t.assigned_to = u_staff.id
      WHERE t.id = $1
    `;
    const ticketResult = await db.query(ticketQuery, [ticketId]);
    if (ticketResult.rows.length === 0) {
      return res.status(404).json({ error: 'Ticket not found.' });
    }

    const ticket = ticketResult.rows[0];

    // Check authorization: Customer can only view their own ticket
    if (req.user.role === 'customer') {
      const custResult = await db.query('SELECT id FROM customers WHERE user_id = $1', [req.user.id]);
      if (custResult.rows.length === 0 || custResult.rows[0].id !== ticket.customer_id) {
        return res.status(403).json({ error: 'Access forbidden. You do not own this ticket.' });
      }
    }

    // 2. Fetch Ticket Updates (Comments)
    // Customers only see public updates. Admin/Staff see all.
    let updatesQuery = '';
    let updatesParams = [ticketId];

    if (req.user.role === 'admin' || req.user.role === 'staff') {
      updatesQuery = `
        SELECT tu.*, u.name as author_name, u.role as author_role
        FROM ticket_updates tu
        JOIN users u ON tu.author_id = u.id
        WHERE tu.ticket_id = $1
        ORDER BY tu.created_at ASC
      `;
    } else {
      updatesQuery = `
        SELECT tu.*, u.name as author_name, u.role as author_role
        FROM ticket_updates tu
        JOIN users u ON tu.author_id = u.id
        WHERE tu.ticket_id = $1 AND tu.is_public = TRUE
        ORDER BY tu.created_at ASC
      `;
    }
    const updatesResult = await db.query(updatesQuery, updatesParams);

    // 3. Fetch Remote Devices (If Admin/Staff, let them see client's AnyDesk info)
    let devices = [];
    if (req.user.role === 'admin' || req.user.role === 'staff') {
      const devicesResult = await db.query(
        'SELECT nickname, device_type, anydesk_id, teamviewer_id, pin_encrypted, os FROM remote_devices WHERE customer_id = $1',
        [ticket.customer_id]
      );
      devices = devicesResult.rows;
    }

    // 4. Fetch Feedback
    const feedbackResult = await db.query('SELECT * FROM feedback WHERE ticket_id = $1', [ticketId]);
    const feedback = feedbackResult.rows.length > 0 ? feedbackResult.rows[0] : null;

    res.json({
      ticket,
      updates: updatesResult.rows,
      devices,
      feedback
    });

  } catch (error) {
    console.error('Get ticket error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/tickets - Create a new ticket
router.post('/', authenticateToken, async (req, res) => {
  const { customer_id, category, priority, subject, description } = req.body;

  if (!category || !subject || !description) {
    return res.status(400).json({ error: 'Category, subject, and description are required.' });
  }

  try {
    let finalCustomerId = customer_id;

    if (req.user.role === 'customer') {
      // Customer is submitting. Fetch their customer ID.
      const custResult = await db.query('SELECT id FROM customers WHERE user_id = $1', [req.user.id]);
      if (custResult.rows.length === 0) {
        return res.status(404).json({ error: 'Customer profile not found.' });
      }
      finalCustomerId = custResult.rows[0].id;
    } else {
      // Admin/Staff is submitting on behalf of a customer. Must provide customer_id.
      if (!finalCustomerId) {
        return res.status(400).json({ error: 'Customer ID is required when creating a ticket as Admin or Staff.' });
      }
    }

    // Generate a unique ticket number: NCS-YYYY-RANDOM
    const date = new Date();
    const year = date.getFullYear();
    const randDigits = Math.floor(1000 + Math.random() * 9000);
    const ticketNumber = `NCS-${year}-${randDigits}`;

    const result = await db.query(
      `INSERT INTO tickets (ticket_number, customer_id, category, priority, subject, description, status)
       VALUES ($1, $2, $3, $4, $5, $6, 'Open')
       RETURNING *`,
      [ticketNumber, finalCustomerId, category, priority || 'Medium', subject, description]
    );

    res.status(201).json({
      message: 'Support ticket opened successfully!',
      ticket: result.rows[0]
    });

  } catch (error) {
    console.error('Create ticket error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PATCH /api/tickets/:id - Update ticket properties (Admin & Staff only)
router.patch('/:id', authenticateToken, requireRole(['admin', 'staff']), async (req, res) => {
  const ticketId = req.params.id;
  const { assigned_to, priority, status, sla_due } = req.body;

  try {
    const checkTicket = await db.query('SELECT * FROM tickets WHERE id = $1', [ticketId]);
    if (checkTicket.rows.length === 0) {
      return res.status(404).json({ error: 'Ticket not found.' });
    }

    const currentTicket = checkTicket.rows[0];

    // Build update parameters dynamically
    let updates = [];
    let values = [];
    let idx = 1;

    if (assigned_to !== undefined) {
      updates.push(`assigned_to = $${idx++}`);
      values.push(assigned_to === null ? null : assigned_to);
      // Automatically transition Open status to Assigned when a staff member is assigned
      if (currentTicket.status === 'Open' && assigned_to !== null && status === undefined) {
        updates.push(`status = $${idx++}`);
        values.push('Assigned');
      }
    }

    if (priority !== undefined) {
      updates.push(`priority = $${idx++}`);
      values.push(priority);
    }

    if (status !== undefined) {
      updates.push(`status = $${idx++}`);
      values.push(status);
      
      // Set resolved_at if status transitions to Resolved
      if (status === 'Resolved' && currentTicket.status !== 'Resolved') {
        updates.push(`resolved_at = $${idx++}`);
        values.push(new Date());
      }
      // Set closed_at if status transitions to Closed
      if (status === 'Closed' && currentTicket.status !== 'Closed') {
        updates.push(`closed_at = $${idx++}`);
        values.push(new Date());
      }
    }

    if (sla_due !== undefined) {
      updates.push(`sla_due = $${idx++}`);
      values.push(sla_due);
    }

    if (updates.length === 0) {
      return res.status(400).json({ error: 'No update parameters provided.' });
    }

    values.push(ticketId);
    const queryText = `
      UPDATE tickets 
      SET ${updates.join(', ')} 
      WHERE id = $${idx}
      RETURNING *
    `;

    const result = await db.query(queryText, values);

    // If reassigned or status updated, create an internal notification/update log
    let updateLogMsg = `Ticket properties updated by ${req.user.name}:`;
    if (assigned_to !== undefined) updateLogMsg += ` Assigned to: ${assigned_to || 'None'}.`;
    if (status !== undefined) updateLogMsg += ` Status changed to: ${status}.`;
    if (priority !== undefined) updateLogMsg += ` Priority changed to: ${priority}.`;

    await db.query(
      `INSERT INTO ticket_updates (ticket_id, author_id, message, is_public)
       VALUES ($1, $2, $3, FALSE)`,
      [ticketId, req.user.id, updateLogMsg]
    );

    res.json({
      message: 'Ticket updated successfully!',
      ticket: result.rows[0]
    });

  } catch (error) {
    console.error('Update ticket error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/tickets/:id/updates - Add public/private comments
router.post('/:id/updates', authenticateToken, async (req, res) => {
  const ticketId = req.params.id;
  const { message, is_public } = req.body;

  if (!message) {
    return res.status(400).json({ error: 'Message content is required.' });
  }

  try {
    // Check ticket exists
    const checkTicket = await db.query('SELECT customer_id FROM tickets WHERE id = $1', [ticketId]);
    if (checkTicket.rows.length === 0) {
      return res.status(404).json({ error: 'Ticket not found.' });
    }

    const ticket = checkTicket.rows[0];

    // Customers can only comment on their own tickets
    if (req.user.role === 'customer') {
      const custResult = await db.query('SELECT id FROM customers WHERE user_id = $1', [req.user.id]);
      if (custResult.rows.length === 0 || custResult.rows[0].id !== ticket.customer_id) {
        return res.status(403).json({ error: 'Access forbidden. You do not own this ticket.' });
      }
    }

    // Force public updates for customers
    const finalIsPublic = req.user.role === 'customer' ? true : (is_public !== undefined ? is_public : true);

    const result = await db.query(
      `INSERT INTO ticket_updates (ticket_id, author_id, message, is_public)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [ticketId, req.user.id, message, finalIsPublic]
    );

    // If ticket is updated by customer, transition status back to 'Open' (if resolved or assigned) to alert staff
    if (req.user.role === 'customer') {
      await db.query(
        `UPDATE tickets SET status = 'In Progress' WHERE id = $1 AND status IN ('Open', 'Assigned', 'On Hold')`,
        [ticketId]
      );
    }

    res.status(201).json({
      message: 'Comment added successfully!',
      update: result.rows[0]
    });

  } catch (error) {
    console.error('Add ticket update error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/tickets/:id/feedback - Customer feedback submission
router.post('/:id/feedback', authenticateToken, requireRole(['customer']), async (req, res) => {
  const ticketId = req.params.id;
  const { rating, comment } = req.body;

  if (!rating || rating < 1 || rating > 5) {
    return res.status(400).json({ error: 'Rating between 1 and 5 is required.' });
  }

  try {
    // Check ticket ownership and status
    const checkTicket = await db.query('SELECT customer_id, status FROM tickets WHERE id = $1', [ticketId]);
    if (checkTicket.rows.length === 0) {
      return res.status(404).json({ error: 'Ticket not found.' });
    }

    const ticket = checkTicket.rows[0];

    // Verify ownership
    const custResult = await db.query('SELECT id FROM customers WHERE user_id = $1', [req.user.id]);
    if (custResult.rows.length === 0 || custResult.rows[0].id !== ticket.customer_id) {
      return res.status(403).json({ error: 'Access forbidden. You do not own this ticket.' });
    }

    // Insert feedback
    const result = await db.query(
      `INSERT INTO feedback (ticket_id, customer_id, rating, comment)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (ticket_id) 
       DO UPDATE SET rating = EXCLUDED.rating, comment = EXCLUDED.comment, created_at = CURRENT_TIMESTAMP
       RETURNING *`,
      [ticketId, ticket.customer_id, rating, comment || null]
    );

    res.json({
      message: 'Thank you for your feedback!',
      feedback: result.rows[0]
    });

  } catch (error) {
    console.error('Submit feedback error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
