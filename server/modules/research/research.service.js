const pool = require('../../config/db');

const uploadResearch = async (title, abstract, fileUrl, userId, courseId = null) => {
  const query = `
    INSERT INTO research (title, abstract, file_url, user_id, course_id)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING *
  `;
  const values = [title, abstract, fileUrl, userId, courseId];
  const result = await pool.query(query, values);
  return result.rows[0];
};

const getResearch = async () => {
  const query = `
    SELECT
      r.*,
      u.first_name,
      u.last_name,
      COALESCE(AVG(rr.rating), 0) as average_rating,
      COUNT(rc.id) as comment_count
    FROM research r
    LEFT JOIN users u ON r.user_id = u.id
    LEFT JOIN research_ratings rr ON r.id = rr.research_id
    LEFT JOIN research_comments rc ON r.id = rc.research_id
    GROUP BY r.id, u.first_name, u.last_name
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
      d.name as department_name,
      c.name as course_name
    FROM research r
    LEFT JOIN users u ON r.user_id = u.id
    LEFT JOIN courses c ON r.course_id = c.id
    LEFT JOIN departments d ON c.department_id = d.id
    WHERE r.id = $1
  `;
  const result = await pool.query(query, [researchId]);
  return result.rows[0];
};

module.exports = {
  uploadResearch,
  getResearch,
  getResearchById,
};