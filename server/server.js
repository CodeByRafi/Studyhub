const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const pool = require('./config/db');
const authRoutes = require('./modules/auth/auth.routes');
const analyticsRoutes = require('./modules/analytics/analytics.routes');
const studyRoutes = require('./modules/study/study.routes');
const researchRoutes = require('./modules/research/research.routes');
const jobsRoutes = require('./modules/jobs/jobs.routes');
const blogRoutes = require('./modules/blog/blog.routes');

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json());

// Static file serving for uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Health check - Test DB connection
app.get('/test-db', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');
    res.json({
      success: true,
      message: 'Database connection successful',
      time: result.rows[0],
    });
  } catch (error) {
    console.error('Database test error full:', error);
    console.error('Database test error message:', error?.message);
    console.error('Database test error stack:', error?.stack);

    res.status(500).json({
      success: false,
      message: 'Database connection failed',
      error: error?.message || 'Unknown error',
    });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is healthy',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
  });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', require('./modules/auth/user.routes'));
app.use('/api', analyticsRoutes);
app.use('/api/study', studyRoutes);
app.use('/api/research', researchRoutes);
app.use('/api/jobs', jobsRoutes);
app.use('/api/blog', blogRoutes);
app.use('/api/networking', require('./modules/networking/networking.routes'));
app.use('/api/mentoring', require('./modules/mentoring/mentoring.routes'));


// Basic route
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'StudyHub Backend Server',
    version: '1.0.0',
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined,
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`📍 Test DB: http://localhost:${PORT}/test-db`);
  console.log(`📍 Signup: POST http://localhost:${PORT}/api/auth/signup`);
  console.log(`📍 Login: POST http://localhost:${PORT}/api/auth/login`);
});

module.exports = app;