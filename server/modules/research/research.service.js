const pool = require('../../config/db');

const uploadResearch = async (title, abstract, fileUrl, userId, departmentName, courseName) => {
  try {
    // Try to parse courseName as courseId if it's numeric, otherwise keep it as null.
    const courseId = isNaN(parseInt(courseName, 10)) ? null : parseInt(courseName, 10);

    const query = `
      INSERT INTO research (title, abstract, file_url, user_id, course_id, department_name, course_name)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *;
    `;
    const values = [title, abstract, fileUrl, userId, courseId, departmentName, courseName];
    const result = await pool.query(query, values);
    return result.rows[0];
  } catch (error) {
    console.error('Research service error:', error);
    throw error;
  }
};

const getResearch = async () => {
  const query = `
    SELECT
      r.*, 
      u.first_name,
      u.last_name,
      COALESCE(r.department_name, d.name) as department_name,
      COALESCE(r.course_name, c.name) as course_name,
      COALESCE(ROUND(AVG(rr.rating)::numeric, 1), 0) as average_rating,
      COUNT(DISTINCT rc.id) as comment_count
    FROM research r
    LEFT JOIN users u ON r.user_id = u.id
    LEFT JOIN courses c ON r.course_id = c.id
    LEFT JOIN departments d ON c.department_id = d.id
    LEFT JOIN research_ratings rr ON r.id = rr.research_id
    LEFT JOIN research_comments rc ON r.id = rc.research_id
    GROUP BY r.id, u.first_name, u.last_name, d.name, c.name
    ORDER BY r.created_at DESC
  `;
  const result = await pool.query(query);
  return result.rows;
};

const getResearchById = async (researchId) => {
  const query = `
    SELECT
      r.*,
      u.first_name,
      u.last_name,
      COALESCE(r.department_name, d.name) as department_name,
      COALESCE(r.course_name, c.name) as course_name,
      COALESCE(ROUND(AVG(rr.rating)::numeric, 1), 0) as average_rating,
      COUNT(DISTINCT rc.id) as comment_count
    FROM research r
    LEFT JOIN users u ON r.user_id = u.id
    LEFT JOIN courses c ON r.course_id = c.id
    LEFT JOIN departments d ON c.department_id = d.id
    LEFT JOIN research_ratings rr ON r.id = rr.research_id
    LEFT JOIN research_comments rc ON r.id = rc.research_id
    WHERE r.id = $1
    GROUP BY r.id, u.first_name, u.last_name, d.name, c.name
  `;
  const result = await pool.query(query, [researchId]);
  return result.rows[0];
};

module.exports = {
  uploadResearch,
  getResearch,
  getResearchById,
};