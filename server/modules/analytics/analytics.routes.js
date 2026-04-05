const express = require('express');
const { recordVisitController, getStatsController, getUserStatsController, getUserActivityController } = require('./analytics.controller');
const { requireAuth } = require('../../middleware/authMiddleware');

const router = express.Router();

// POST /api/visit → record a visit
router.post('/visit', recordVisitController);

// GET /api/stats → get analytics stats
router.get('/stats', getStatsController);

// GET /api/user-stats → get user-specific stats (requires auth)
router.get('/user-stats', requireAuth, getUserStatsController);

// GET /api/user-activity → get user activity (requires auth)
router.get('/user-activity', requireAuth, getUserActivityController);

module.exports = router;
