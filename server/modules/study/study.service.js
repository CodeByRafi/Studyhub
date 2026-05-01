const pool = require('../../config/db');

/**
 * Get all departments
 */
const getDepartments = async () => {
  try {
    const result = await pool.query(`
      SELECT id, name, description FROM departments ORDER BY name
    `);
    return result.rows;
  } catch (error) {
    console.error('Error fetching departments:', error);
    throw error;
  }
};

/**
 * Get courses by department ID
 */
const getCoursesByDepartment = async (departmentId) => {
  try {
    const result = await pool.query(`
      SELECT id, name, code, description 
      FROM courses 
      WHERE department_id = $1 
      ORDER BY name
    `, [departmentId]);
    return result.rows;
  } catch (error) {
    console.error('Error fetching courses:', error);
    throw error;
  }
};

/**
 * Get course by ID
 */
const getCourseById = async (courseId) => {
  try {
    const result = await pool.query(
      'SELECT id, name, code, department_id FROM courses WHERE id = $1',
      [courseId]
    );
    return result.rows[0];
  } catch (error) {
    console.error('Error fetching course:', error);
    throw error;
  }
};

/**
 * Get notes with optional filtering
 */
const getNotes = async ({ department, course, searchQuery }) => {
  try {
    let query = `
      SELECT n.*, u.first_name, u.last_name, c.name as course_name
      FROM notes n
      JOIN users u ON n.user_id = u.id
      JOIN courses c ON n.course_id = c.id
      WHERE 1=1
    `;
    const params = [];

    if (department) {
      params.push(department);
      query += ` AND c.department_id = $${params.length}`;
    }

    if (course) {
      params.push(course);
      query += ` AND n.course_id = $${params.length}`;
    }

    if (searchQuery) {
      params.push(`%${searchQuery}%`);
      query += ` AND (n.title ILIKE $${params.length} OR n.content ILIKE $${params.length})`;
    }

    query += ' ORDER BY n.created_at DESC';

    const result = await pool.query(query, params);
    return result.rows;
  } catch (error) {
    console.error('Error fetching notes:', error);
    throw error;
  }
};

/**
 * Create a new course
 */
const createCourse = async (departmentId, name) => {
  try {
    const result = await pool.query(
      'INSERT INTO courses (department_id, name) VALUES ($1, $2) RETURNING *',
      [departmentId, name]
    );
    return result.rows[0];
  } catch (error) {
    console.error('Error creating course:', error);
    throw error;
  }
};

module.exports = {
  getDepartments,
  getCoursesByDepartment,
  getCourseById,
  getNotes,
  createCourse,
};