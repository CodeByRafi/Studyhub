const pool = require('../../config/db');
const fs = require('fs');
const path = require('path');

/**
 * Upload or update user profile image
 * POST /api/users/upload-profile-image
 */
exports.uploadProfileImage = async (req, res) => {
  try {
    const userId = req.userId;

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No image file provided.',
      });
    }

    const imageUrl = `/uploads/profile/${req.file.filename}`;

    // Fetch old image path so we can delete it
    const oldResult = await pool.query(
      'SELECT profile_image FROM users WHERE id = $1',
      [userId]
    );
    const oldImage = oldResult.rows[0]?.profile_image;

    // Update user record
    const result = await pool.query(
      `UPDATE users
       SET profile_image = $1, updated_at = CURRENT_TIMESTAMP
       WHERE id = $2
       RETURNING id, email, first_name, last_name, profile_image`,
      [imageUrl, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    // Delete old image file from disk (best-effort)
    if (oldImage && oldImage !== imageUrl) {
      const oldPath = path.join(__dirname, '..', '..', oldImage);
      fs.unlink(oldPath, () => {}); // silent fail if file doesn't exist
    }

    return res.status(200).json({
      success: true,
      message: 'Profile image updated successfully.',
      data: result.rows[0],
    });
  } catch (error) {
    console.error('Upload profile image error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Get current user profile
 * GET /api/users/me
 */
exports.getMe = async (req, res) => {
  try {
    const userId = req.userId;

    const result = await pool.query(
      `SELECT u.id, u.email, u.first_name, u.last_name, u.profile_image,
              d.name AS department_name
       FROM users u
       LEFT JOIN departments d ON u.department_id = d.id
       WHERE u.id = $1`,
      [userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    return res.status(200).json({
      success: true,
      data: result.rows[0],
    });
  } catch (error) {
    console.error('Get user error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};
