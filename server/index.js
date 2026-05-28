const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const leadsRoutes = require('./routes/leads');
const customersRoutes = require('./routes/customers');
const ticketsRoutes = require('./routes/tickets');
const blogsRoutes = require('./routes/blogs');
const staffRoutes = require('./routes/staff');
const clientsRoutes = require('./routes/clients');
const settingsRoutes = require('./routes/settings');

const app = express();
const PORT = process.env.PORT || 5000;

// HTTP security headers
app.use(helmet());

// CORS — restrict to the configured frontend origin in production
const allowedOrigin = process.env.FRONTEND_URL || 'http://localhost:5173';
app.use(cors({
  origin: allowedOrigin,
  methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Rate limiting on auth endpoints — prevent brute-force attacks
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests. Please try again later.' }
});

app.use(express.json());

// Request logging middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Mount Routes
app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/leads', leadsRoutes);
app.use('/api/customers', customersRoutes);
app.use('/api/tickets', ticketsRoutes);
app.use('/api/blogs', blogsRoutes);
app.use('/api/staff', staffRoutes);
app.use('/api/clients', clientsRoutes);
app.use('/api/settings', settingsRoutes);

const db = require('./db/client');

// Config endpoint to expose necessary public settings
app.get('/api/config', async (req, res) => {
  try {
    const result = await db.query('SELECT key, value FROM settings WHERE key IN ($1, $2, $3, $4, $5)', 
      ['contact_email', 'social_facebook', 'social_twitter', 'social_linkedin', 'social_instagram']
    );
    const config = {};
    result.rows.forEach(r => config[r.key] = r.value);
    
    res.json({
      contactEmail: config.contact_email || 'anupghimire@gmail.com',
      socialFacebook: config.social_facebook || '',
      socialTwitter: config.social_twitter || '',
      socialLinkedin: config.social_linkedin || '',
      socialInstagram: config.social_instagram || ''
    });
  } catch (err) {
    console.error('Error fetching public config:', err);
    res.json({
      contactEmail: 'anupghimire@gmail.com'
    });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date(),
    service: 'NextCoreSystem API'
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error occurred.' });
});

app.listen(PORT, '0.0.0.0' ,() => {
  console.log(`=================================================`);
  console.log(` NextCoreSystem Server running on port ${PORT} `);
  console.log(`=================================================`);
});
