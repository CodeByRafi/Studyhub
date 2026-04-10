const pool = require('../../config/db');

const uploadNote = async (title, fileUrl, userId, courseId) => {
  try {
    const result = await pool.query(
      'INSERT INTO notes (title, content, file_url, user_id, course_id) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [title, '', fileUrl, userId, courseId]
    );
    return result.rows[0];
  } catch (error) {
    console.error('Error uploading note:', error);
    throw error;
  }
};

const getNotes = async ({ department, course, searchQuery }) => {
  try {
    let query = `
      SELECT n.id, n.title, n.file_url, n.user_id, n.course_id, n.created_at,
             u.first_name, u.last_name,
             c.name as course_name,
             d.name as department_name,
             COUNT(DISTINCT com.id) as comment_count,
             ROUND(AVG(r.rating)::numeric, 1) as average_rating
      FROM notes n
      LEFT JOIN users u ON n.user_id = u.id
      LEFT JOIN courses c ON n.course_id = c.id
      LEFT JOIN departments d ON c.department_id = d.id
      LEFT JOIN comments com ON n.id = com.note_id
      LEFT JOIN ratings r ON n.id = r.note_id
    `;
    const params = [];
    const conditions = [];

    if (department) {
      params.push(department);
      if (typeof department === 'string' && isNaN(Number(department))) {
        conditions.push(`d.name = $${params.length}`);
      } else {
        conditions.push(`d.id = $${params.length}`);
      }
    }
    if (course) {
      params.push(course);
      if (typeof course === 'string' && isNaN(Number(course))) {
        conditions.push(`c.name = $${params.length}`);
      } else {
        conditions.push(`c.id = $${params.length}`);
      }
    }
    if (searchQuery) {
      params.push(`%${searchQuery}%`);
      conditions.push(`n.title ILIKE $${params.length}`);
    }

    if (conditions.length > 0) {
      query += ` WHERE ` + conditions.join(' AND ');
    }

    query += ` GROUP BY n.id, u.id, c.id, d.id ORDER BY n.created_at DESC`;

    const result = await pool.query(query, params);
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
              u.first_name, u.last_name,
              c.name as course_name,
              d.name as department_name,
              COUNT(DISTINCT com.id) as comment_count,
              ROUND(AVG(r.rating)::numeric, 1) as average_rating
       FROM notes n
       LEFT JOIN users u ON n.user_id = u.id
       LEFT JOIN courses c ON n.course_id = c.id
       LEFT JOIN departments d ON c.department_id = d.id
       LEFT JOIN comments com ON n.id = com.note_id
       LEFT JOIN ratings r ON n.id = r.note_id
       WHERE n.id = $1
       GROUP BY n.id, u.id, c.id, d.id`,
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