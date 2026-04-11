const pool = require('../../config/db');

// Get all mentors
exports.getAllMentors = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT 
        mp.*,
        u.first_name,
        u.last_name,
        u.profile_image as profile_photo_url,
        d.name AS department_name
      FROM mentor_profiles mp
      JOIN users u ON mp.user_id = u.id
      LEFT JOIN departments d ON u.department_id = d.id
      ORDER BY mp.created_at DESC`
    );
    res.status(200).json({ success: true, data: result.rows });
  } catch (error) {
    console.error('Get Mentors Error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get mentor by user ID
exports.getMentorByUserId = async (req, res) => {
  try {
    const { userId } = req.params;
    const result = await pool.query(
      `SELECT 
        mp.*,
        u.first_name,
        u.last_name,
        u.profile_image as profile_photo_url,
        d.name AS department_name
      FROM mentor_profiles mp
      JOIN users u ON mp.user_id = u.id
      LEFT JOIN departments d ON u.department_id = d.id
      WHERE mp.user_id = $1`,
      [userId]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Mentor profile not found' });
    }
    
    res.status(200).json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error('Get Mentor Error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Create or update mentor profile
exports.createOrUpdateMentor = async (req, res) => {
  const {
    profile_photo_url = null,
    headline = "",
    current_status = "",
    bio = "",
    skills = [],
    expertise = [],
    whatsapp_number = null,
    linkedin_url = null,
    github_url = null,
    portfolio_url = null,
    open_to = [],
    availability_text = null
  } = req.body;

  const userId = req.userId;

  try {
    const existingProfile = await pool.query(
      'SELECT id FROM mentor_profiles WHERE user_id = $1',
      [userId]
    );

    if (existingProfile.rows.length > 0) {
      const result = await pool.query(
        `UPDATE mentor_profiles 
        SET 
          profile_photo_url = $1,
          headline = $2,
          current_status = $3,
          bio = $4,
          skills = $5,
          expertise = $6,
          whatsapp_number = $7,
          linkedin_url = $8,
          github_url = $9,
          portfolio_url = $10,
          open_to = $11,
          availability_text = $12,
          updated_at = CURRENT_TIMESTAMP
        WHERE user_id = $13
        RETURNING *`,
        [
          profile_photo_url,
          headline,
          current_status,
          bio,
          skills,
          expertise,
          whatsapp_number,
          linkedin_url,
          github_url,
          portfolio_url,
          open_to,
          availability_text,
          userId
        ]
      );
      res.status(200).json({ success: true, data: result.rows[0] });
    } else {
      const result = await pool.query(
        `INSERT INTO mentor_profiles (
          user_id, profile_photo_url, headline, current_status, bio, 
          skills, expertise, whatsapp_number, linkedin_url, 
          github_url, portfolio_url, open_to, availability_text
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
        RETURNING *`,
        [
          userId,
          profile_photo_url,
          headline,
          current_status,
          bio,
          skills,
          expertise,
          whatsapp_number,
          linkedin_url,
          github_url,
          portfolio_url,
          open_to,
          availability_text
        ]
      );
      res.status(201).json({ success: true, data: result.rows[0] });
    }
  } catch (error) {
    console.error('Mentor Profile DB Error:', error);
    res.status(500).json({ success: false, message: 'Database error: ' + error.message });
  }
};
