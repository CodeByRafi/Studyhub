const pool = require('../../config/db');
const { signup, login } = require('./auth.service');

// Signup controller
const signupController = async (req, res) => {
  try {
    const { email, password, firstName, lastName, department, departmentId } = req.body;

    let finalDepartmentId = departmentId || null;

    if (!finalDepartmentId && department) {
      try {
        const departmentResult = await pool.query(
          'SELECT id FROM departments WHERE LOWER(name) = LOWER($1)',
          [department]
        );

        if (departmentResult.rows.length > 0) {
          finalDepartmentId = departmentResult.rows[0].id;
        }
      } catch (lookupError) {
        console.warn('Department lookup failed, proceeding without department:', lookupError.message);
        finalDepartmentId = null;
      }
    }

    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required',
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long',
      });
    }

    const result = await signup(email, password, firstName, lastName, finalDepartmentId);
    return res.status(201).json(result);
  } catch (error) {
    console.error('Signup Controller Error:', error);
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// Login controller
const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required',
      });
    }

    const result = await login(email, password);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  signupController,
  loginController,
};