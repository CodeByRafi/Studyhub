const pool = require('../../config/db');

const addResearchComment = async (researchId, userId, text) => {
  const query = `
    INSERT INTO research_comments (research_id, user_id, content)
    VALUES ($1, $2, $3)
    RETURNING *
  `;
  const values = [researchId, userId, text];
  const result = await pool.query(query, values);
  return result.rows[0];
};

const getResearchCommentsById = async (researchId) => {
  const query = `
    SELECT rc.*, u.first_name, u.last_name
    FROM research_comments rc
    LEFT JOIN users u ON rc.user_id = u.id
    WHERE rc.research_id = $1
    ORDER BY rc.created_at DESC
  `;
  const result = await pool.query(query, [researchId]);
  return result.rows;
};

const addResearchRating = async (researchId, userId, ratingValue) => {
  const query = `
    INSERT INTO research_ratings (research_id, user_id, rating)
    VALUES ($1, $2, $3)
    ON CONFLICT (user_id, research_id)
    DO UPDATE SET rating = EXCLUDED.rating, created_at = CURRENT_TIMESTAMP
    RETURNING *
  `;
  const values = [researchId, userId, ratingValue];
  const result = await pool.query(query, values);
  return result.rows[0];
};

const getResearchRatingsById = async (researchId) => {
  const query = `
    SELECT AVG(rating) as average_rating, COUNT(*) as total_ratings
    FROM research_ratings
    WHERE research_id = $1
  `;
  const result = await pool.query(query, [researchId]);
  return result.rows[0];
};

module.exports = {
  addResearchComment,
  getResearchCommentsById,
  addResearchRating,
  getResearchRatingsById,
};