const pool = require('../../config/db');

const uploadNote = async (title, fileUrl, userId, courseId) => {
  try {
    const result = await pool.query(
      'INSERT INTO notes (title, content, file_url, user_id, course_id) VALUES ($1, $2, $3, $4, $5) RETURNING id, title, file_url, user_id, course_id, created_at',
      [title, '', fileUrl, userId, courseId]
    );
    return result.rows[0];
  } catch (error) {
    console.error('Error uploading note:', error);
    throw error;
  }
};

const getNotes = async (courseId = null) => {
  try {
    let query = `
      SELECT n.id, n.title, n.file_url, n.user_id, n.course_id, n.created_at,
             u.first_name, u.last_name,
             COUNT(DISTINCT c.id) as comment_count,
             ROUND(AVG(r.rating)::numeric, 1) as average_rating
      FROM notes n
      LEFT JOIN users u ON n.user_id = u.id
      LEFT JOIN comments c ON n.id = c.note_id
      LEFT JOIN ratings r ON n.id = r.note_id
    `;

    if (courseId) {
      query += ` WHERE n.course_id = $1`;
    }

    query += ` GROUP BY n.id, u.id ORDER BY n.created_at DESC`;

    const result = courseId
      ? await pool.query(query, [courseId])
      : await pool.query(query);

    return result.rows;
  } catch (error) {
    console.error('Error fetching notes:', error);
    throw error;
  }
};

const getNoteById = async (noteId) => {
  try {
    const result = await pool.query(
      `SELECT n.id, n.title, n.file_url, n.user_id, n.course_id, n.created_at,
              u.first_name, u.last_name, c.name as course_name, d.name as department_name
       FROM notes n
       LEFT JOIN users u ON n.user_id = u.id
       LEFT JOIN courses c ON n.course_id = c.id
       LEFT JOIN departments d ON c.department_id = d.id
       WHERE n.id = $1`,
      [noteId]
    );
    return result.rows[0];
  } catch (error) {
    console.error('Error fetching note:', error);
    throw error;
  }
};

module.exports = {
  uploadNote,
  getNotes,
  getNoteById,
};
