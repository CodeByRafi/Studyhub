const express = require('express');
const router = express.Router();
const { requireAuth } = require('../../middleware/authMiddleware');
const profileUpload = require('../../config/multer-profile');
const userController = require('./user.controller');

// GET /api/users/me — get current authenticated user
router.get('/me', requireAuth, userController.getMe);

// POST /api/users/upload-profile-image — upload/update avatar
router.post(
  '/upload-profile-image',
  requireAuth,
  profileUpload.single('profile_image'),
  userController.uploadProfileImage
);

module.exports = router;
