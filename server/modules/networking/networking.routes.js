const express = require('express');
const router = express.Router();
const networkingController = require('./networking.controller');
const { requireAuth } = require('../../middleware/authMiddleware');

const upload = require('../../config/multer-images');

// Get all networking profiles
router.get('/', networkingController.getAllProfiles);

// Get a single networking profile by user ID
router.get('/:userId', networkingController.getProfileByUserId);

// Create or update a networking profile with photos
router.post('/', 
  requireAuth, 
  upload.fields([
    { name: 'profile_photo', maxCount: 1 },
    { name: 'cover_photo', maxCount: 1 }
  ]), 
  networkingController.createOrUpdateProfile
);

module.exports = router;