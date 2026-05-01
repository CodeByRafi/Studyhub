const pool = require('../../config/db');

const addComment = async (noteId, userId, text) => {
  try {
    const result = await pool.query(
      'INSERT INTO comments (content, user_id, note_id) VALUES ($1, $2, $3) RETURNING id, content, user_id, note_id, created_at',
      [text, userId, noteId]
    );
    return result.rows[0];
  } catch (error) {
    console.error('Error adding comment:', error);
    throw error;
  }
};

const getCommentsByNote = async (noteId) => {
  try {
    const result = await pool.query(
      `SELECT c.id, c.content, c.user_id, c.created_at,
              u.first_name, u.last_name
       FROM comments c
       LEFT JOIN users u ON c.user_id = u.id
       WHERE c.note_id = $1
       ORDER BY c.created_at DESC`,
      [noteId]
    );
    return result.rows;
  } catch (error) {
    console.error('Error fetching comments:', error);
    throw error;
  }
};

const addRating = async (noteId, userId, ratingValue) => {
  try {
    const result = await pool.query(
      `INSERT INTO ratings (rating, user_id, note_id) 
       VALUES ($1, $2, $3)
       ON CONFLICT (user_id, note_id) DO UPDATE SET rating = $1
       RETURNING id, rating, user_id, note_id`,
      [ratingValue, userId, noteId]
    );
    return result.rows[0];
  } catch (error) {
    console.error('Error adding rating:', error);
    throw error;
  }
};

const getRatingsByNote = async (noteId) => {
  try {
    const result = await pool.query(
      `SELECT ROUND(AVG(rating)::numeric, 1) as average_rating, COUNT(*) as total_ratings
       FROM ratings
       WHERE note_id = $1`,
      [noteId]
    );
    return result.rows[0];
  } catch (error) {
    console.error('Error fetching ratings:', error);
    throw error;
  }
};

module.exports = {
  addComment,
  getCommentsByNote,
  addRating,
  getRatingsByNote,
};
