const express = require('express');
const router = express.Router();
const mentoringController = require('./mentoring.controller');
const { requireAuth } = require('../../middleware/authMiddleware');

// Get all mentors (Public)
router.get('/', mentoringController.getAllMentors);

// Get mentor by userId (Public)
router.get('/:userId', mentoringController.getMentorByUserId);

// Create or update mentor profile (Required Auth)
router.post('/', requireAuth, mentoringController.createOrUpdateMentor);

module.exports = router;
