const pool = require('../../config/db');

const uploadQuestion = async (title, fileUrl, userId, courseId) => {
  try {
    const result = await pool.query(
      'INSERT INTO questions (title, file_url, user_id, course_id) VALUES ($1, $2, $3, $4) RETURNING *',
      [title, fileUrl, userId, courseId]
    );
    return result.rows[0];
  } catch (error) {
    console.error('Error uploading question:', error);
    throw error;
  }
};

const getQuestions = async ({ department, course, searchQuery }) => {
  try {
    let query = `
      SELECT q.id, q.title, q.file_url, q.user_id, q.course_id, q.created_at, q.updated_at,
             u.first_name, u.last_name,
             c.name as course_name,
             d.name as department_name,
             COALESCE(ROUND(AVG(qr.rating)::numeric, 1), 0) as average_rating,
             COUNT(DISTINCT qr.id) as rating_count,
             COUNT(DISTINCT qc.id) as comment_count
      FROM questions q
      LEFT JOIN users u ON q.user_id = u.id
      LEFT JOIN courses c ON q.course_id = c.id
      LEFT JOIN departments d ON c.department_id = d.id
      LEFT JOIN question_ratings qr ON q.id = qr.question_id
      LEFT JOIN question_comments qc ON q.id = qc.question_id
      WHERE 1=1
    `;
    let params = [];

    if (department) {
      params.push(department);
      query += ` AND c.department_id = $${params.length}`;
    }

    if (course) {
      params.push(course);
      query += ` AND q.course_id = $${params.length}`;
    }

    if (searchQuery) {
      params.push(`%${searchQuery}%`);
      query += ` AND q.title ILIKE $${params.length}`;
    }

    query += ` GROUP BY q.id, u.id, c.id, d.id ORDER BY q.created_at DESC`;

    const result = await pool.query(query, params);
    return result.rows || [];
  } catch (error) {
    console.error('Error fetching questions:', error.message);
    return [];
  }
};

const getQuestionById = async (questionId) => {
  try {
    const result = await pool.query(
      `SELECT q.id, q.title, q.file_url, q.user_id, q.course_id, q.exam_year, q.exam_type, q.created_at, q.updated_at,
              u.first_name, u.last_name,
              c.name as course_name,
              d.name as department_name,
              COALESCE(ROUND(AVG(qr.rating)::numeric, 1), 0) as average_rating,
              COUNT(DISTINCT qr.id) as rating_count,
              COUNT(DISTINCT qc.id) as comment_count
       FROM questions q
       LEFT JOIN users u ON q.user_id = u.id
       LEFT JOIN courses c ON q.course_id = c.id
       LEFT JOIN departments d ON c.department_id = d.id
       LEFT JOIN question_ratings qr ON q.id = qr.question_id
       LEFT JOIN question_comments qc ON q.id = qc.question_id
       WHERE q.id = $1
       GROUP BY q.id, u.id, c.id, d.id`,
      [questionId]
    );
    return result.rows[0] || null;
  } catch (error) {
    console.error('Error fetching question:', error.message);
    return null;
  }
};

const addQuestionComment = async (questionId, userId, content) => {
  try {
    const result = await pool.query(
      `INSERT INTO question_comments (question_id, user_id, content, created_at, updated_at)
       VALUES ($1, $2, $3, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
       RETURNING id, question_id, user_id, content, created_at`,
      [questionId, userId, content]
    );
    return result.rows[0] || null;
  } catch (error) {
    console.error('Error adding question comment:', error.message);
    throw error;
  }
};

const getQuestionComments = async (questionId) => {
  try {
    const result = await pool.query(
      `SELECT qc.id, qc.content, qc.user_id, qc.question_id, qc.created_at,
              u.first_name, u.last_name, u.email
       FROM question_comments qc
       LEFT JOIN users u ON qc.user_id = u.id
       WHERE qc.question_id = $1
       ORDER BY qc.created_at DESC`,
      [questionId]
    );
    return result.rows;
  } catch (error) {
    console.error('Error fetching question comments:', error.message);
    throw error;
  }
};

const addQuestionRating = async (questionId, userId, rating) => {
  try {
    const result = await pool.query(
      `INSERT INTO question_ratings (question_id, user_id, rating, created_at, updated_at)
       VALUES ($1, $2, $3, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
       ON CONFLICT (user_id, question_id) DO UPDATE SET rating = $3, updated_at = CURRENT_TIMESTAMP
       RETURNING id, question_id, user_id, rating, created_at`,
      [questionId, userId, rating]
    );
    return result.rows[0] || null;
  } catch (error) {
    console.error('Error adding question rating:', error.message);
    throw error;
  }
};

module.exports = {
  uploadQuestion,
  getQuestions,
  getQuestionById,
  addQuestionComment,
  getQuestionComments,
  addQuestionRating,
};