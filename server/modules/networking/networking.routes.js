const express = require('express');
const router = express.Router();
const networkingController = require('./networking.controller');
const { requireAuth } = require('../../middleware/authMiddleware');

// Get all networking profiles
router.get('/', networkingController.getAllProfiles);

// Get a single networking profile by user ID
router.get('/:userId', networkingController.getProfileByUserId);

// Create or update a networking profile
router.post('/', requireAuth, networkingController.createOrUpdateProfile);

module.exports = router;