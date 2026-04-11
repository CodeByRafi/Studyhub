const express = require('express');
const { requireAuth } = require('../../middleware/authMiddleware');
const {
  createJobController,
  getJobsController,
  getJobByIdController,
  applyForJobController,
  getUserApplicationsController,
} = require('./jobs.controller');

const router = express.Router();

// Routes
// POST /api/jobs
router.post('/', requireAuth, createJobController);

// GET /api/jobs?type=internship
router.get('/', getJobsController);

// GET /api/jobs/:id
router.get('/:id', getJobByIdController);

// POST /api/jobs/apply
router.post('/apply', requireAuth, applyForJobController);

// GET /api/jobs/applications (user's applications)
router.get('/applications', requireAuth, getUserApplicationsController);

module.exports = router;