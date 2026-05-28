const express = require('express');
const router = express.Router();
const db = require('../db/client');
const { authenticateToken } = require('../middleware/auth');

// GET /api/blogs (Public)
router.get('/', async (req, res) => {
  try {
    const result = await db.query(`
      SELECT b.id, b.title, b.slug, b.excerpt, b.content, b.created_at, b.updated_at, u.name as author_name 
      FROM blogs b 
      LEFT JOIN users u ON b.author_id = u.id 
      WHERE b.is_published = TRUE 
      ORDER BY b.created_at DESC
    `);
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching blogs:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/blogs/admin/all (Admin only - must be before /:slug)
router.get('/admin/all', authenticateToken, async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Only admins can view all blog posts' });
  }

  try {
    const result = await db.query(`
      SELECT b.id, b.title, b.slug, b.excerpt, b.content, b.is_published, b.created_at, b.updated_at, u.name as author_name 
      FROM blogs b 
      LEFT JOIN users u ON b.author_id = u.id 
      ORDER BY b.created_at DESC
    `);
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching all blogs:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/blogs/:slug (Public)
router.get('/:slug', async (req, res) => {
  try {
    const { slug } = req.params;
    const result = await db.query(`
      SELECT b.id, b.title, b.slug, b.excerpt, b.content, b.created_at, b.updated_at, u.name as author_name 
      FROM blogs b 
      LEFT JOIN users u ON b.author_id = u.id 
      WHERE b.slug = $1 AND b.is_published = TRUE
    `, [slug]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Blog post not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error fetching blog post:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/blogs (Admin only)
router.post('/', authenticateToken, async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Only admins can create blog posts' });
  }
  
  const { title, excerpt, content, is_published } = req.body;
  if (!title || !content) {
    return res.status(400).json({ error: 'Title and content are required' });
  }

  // Generate slug from title
  const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') + '-' + Date.now();

  try {
    const result = await db.query(`
      INSERT INTO blogs (title, slug, excerpt, content, author_id, is_published)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `, [title, slug, excerpt, content, req.user.id, is_published !== false]);

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error creating blog post:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PUT /api/blogs/:id (Admin only)
router.put('/:id', authenticateToken, async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Only admins can update blog posts' });
  }

  const { title, excerpt, content, is_published } = req.body;
  if (!title || !content) {
    return res.status(400).json({ error: 'Title and content are required' });
  }

  try {
    const result = await db.query(`
      UPDATE blogs 
      SET title = $1, excerpt = $2, content = $3, is_published = $4, updated_at = NOW()
      WHERE id = $5
      RETURNING *
    `, [title, excerpt, content, is_published !== false, req.params.id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Blog not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error updating blog post:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// DELETE /api/blogs/:id (Admin only)
router.delete('/:id', authenticateToken, async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Only admins can delete blog posts' });
  }
  
  try {
    const result = await db.query('DELETE FROM blogs WHERE id = $1 RETURNING id', [req.params.id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Blog not found' });
    }
    res.json({ message: 'Blog deleted successfully' });
  } catch (err) {
    console.error('Error deleting blog:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
