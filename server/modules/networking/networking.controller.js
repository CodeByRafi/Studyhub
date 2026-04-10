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
        np.profile_photo_url
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
    profile_photo_url = null,
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

  console.log('Receiving profile update for user:', userId, { headline, current_status });

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
          headline = $2,
          current_status = $3,
          bio = $4,
          skills = $5,
          current_company = $6,
          role_designation = $7,
          linkedin_url = $8,
          github_url = $9,
          portfolio_url = $10,
          graduation_year = $11,
          open_to = $12,
          updated_at = CURRENT_TIMESTAMP
        WHERE user_id = $13
        RETURNING *`,
        [
          profile_photo_url,
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
          open_to,
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
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
        RETURNING *`,
        [
          userId,
          profile_photo_url,
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
          open_to,
        ]
      );
      return res.status(201).json({ success: true, data: result.rows[0] });
    }
  } catch (error) {
    console.error('Networking Profile DB Error:', error);
    res.status(500).json({ success: false, message: 'Database error: ' + error.message });
  }
};