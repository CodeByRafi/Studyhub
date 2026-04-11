const pool = require('../../config/db');

// Get all networking profiles
exports.getAllProfiles = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT
        np.id,
        np.user_id,
        u.first_name,
        u.last_name,
        d.name AS department_name,
        np.headline,
        np.current_status,
        np.skills,
        np.linkedin_url,
        np.github_url,
        np.portfolio_url,
        u.profile_image as profile_photo_url,
        np.cover_photo_url
      FROM networking_profiles np
      JOIN users u ON np.user_id = u.id
      LEFT JOIN departments d ON u.department_id = d.id`
    );
    res.status(200).json({ success: true, data: result.rows });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get a single networking profile by user ID
exports.getProfileByUserId = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT
        np.*,
        u.first_name,
        u.last_name,
        u.profile_image as profile_photo_url,
        d.name AS department_name
      FROM networking_profiles np
      JOIN users u ON np.user_id = u.id
      LEFT JOIN departments d ON u.department_id = d.id
      WHERE np.user_id = $1`,
      [req.params.userId]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Profile not found' });
    }
    res.status(200).json({ success: true, data: result.rows[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Create or update a networking profile
exports.createOrUpdateProfile = async (req, res) => {
  const {
    headline = "",
    current_status = "",
    bio = "",
    skills = [],
    current_company = null,
    role_designation = null,
    linkedin_url = null,
    github_url = null,
    portfolio_url = null,
    graduation_year = null,
    open_to = [],
  } = req.body;

  const userId = req.userId;
  
  // Handle file uploads
  let profile_photo_url = req.body.profile_photo_url;
  let cover_photo_url = req.body.cover_photo_url;

  if (req.files) {
    if (req.files.profile_photo) {
      profile_photo_url = `/uploads/profiles/${req.files.profile_photo[0].filename}`;
    }
    if (req.files.cover_photo) {
      cover_photo_url = `/uploads/profiles/${req.files.cover_photo[0].filename}`;
    }
  }

  try {
    // Check if a profile already exists for the user
    const existingProfile = await pool.query(
      'SELECT id FROM networking_profiles WHERE user_id = $1',
      [userId]
    );

    if (existingProfile.rows.length > 0) {
      // Update existing profile
      const result = await pool.query(
        `UPDATE networking_profiles
        SET
          profile_photo_url = $1,
          cover_photo_url = $2,
          headline = $3,
          current_status = $4,
          bio = $5,
          skills = $6,
          current_company = $7,
          role_designation = $8,
          linkedin_url = $9,
          github_url = $10,
          portfolio_url = $11,
          graduation_year = $12,
          open_to = $13,
          updated_at = CURRENT_TIMESTAMP
        WHERE user_id = $14
        RETURNING *`,
        [
          profile_photo_url,
          cover_photo_url,
          headline,
          current_status,
          bio,
          skills ? (Array.isArray(skills) ? skills : skills.split(',').map(s => s.trim())) : [],
          current_company,
          role_designation,
          linkedin_url,
          github_url,
          portfolio_url,
          graduation_year,
          open_to ? (Array.isArray(open_to) ? open_to : open_to.split(',').map(s => s.trim())) : [],
          userId,
        ]
      );
      return res.status(200).json({ success: true, data: result.rows[0] });
    } else {
      // Create new profile
      const result = await pool.query(
        `INSERT INTO networking_profiles (
          user_id,
          profile_photo_url,
          cover_photo_url,
          headline,
          current_status,
          bio,
          skills,
          current_company,
          role_designation,
          linkedin_url,
          github_url,
          portfolio_url,
          graduation_year,
          open_to
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
        RETURNING *`,
        [
          userId,
          profile_photo_url,
          cover_photo_url,
          headline,
          current_status,
          bio,
          skills ? (Array.isArray(skills) ? skills : skills.split(',').map(s => s.trim())) : [],
          current_company,
          role_designation,
          linkedin_url,
          github_url,
          portfolio_url,
          graduation_year,
          open_to ? (Array.isArray(open_to) ? open_to : open_to.split(',').map(s => s.trim())) : [],
        ]
      );
      return res.status(201).json({ success: true, data: result.rows[0] });
    }
  } catch (error) {
    console.error('Networking Profile DB Error:', error);
    res.status(500).json({ success: false, message: 'Database error: ' + error.message });
  }
};