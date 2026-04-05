const pool = require('../../config/db');

const getDepartments = async () => {
  try {
    const result = await pool.query('SELECT id, name, description FROM departments ORDER BY name');
    return result.rows;
  } catch (error) {
    console.error('Error fetching departments:', error);
    throw error;
  }
};

const getCoursesByDepartment = async (departmentId) => {
  try {
    // Handle both numeric ID and department name strings
    let query = 'SELECT id, name, code, department_id FROM courses WHERE ';
    let params = [];

    // Check if departmentId is a number or string
    if (!isNaN(departmentId) && departmentId !== '') {
      // It's a numeric ID
      query += 'department_id = $1';
      params.push(parseInt(departmentId));
    } else {
      // It might be a department name - try to match
      query += `department_id = (SELECT id FROM departments WHERE LOWER(name) = LOWER($1))`;
      params.push(departmentId);
    }

    query += ' ORDER BY name';

    const result = await db.query(query, params);
    return result.rows || [];
  } catch (error) {
    console.error('Error fetching courses:', error);
    return [];
  }
};

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

module.exports = {
  getDepartments,
  getCoursesByDepartment,
  getCourseById,
};
