const express = require('express');
const router = express.Router();
const networkingController = require('./networking.controller');
const { requireAuth } = require('../../middleware/authMiddleware');

const upload = require('../../config/multer-images');

const networkingUpload = (req, res, next) => {
  const contentType = (req.headers['content-type'] || '').toString();
  if (contentType.includes('multipart/form-data')) {
    return upload.fields([
      { name: 'profile_photo', maxCount: 1 },
      { name: 'cover_photo', maxCount: 1 }
    ])(req, res, next);
  }
  next();
};

// Get all networking profiles
router.get('/', networkingController.getAllProfiles);

// Get a single networking profile by user ID
router.get('/:userId', networkingController.getProfileByUserId);

// Create or update a networking profile with photos
router.post('/', 
  requireAuth, 
  networkingUpload,
  networkingController.createOrUpdateProfile
);

module.exports = router;