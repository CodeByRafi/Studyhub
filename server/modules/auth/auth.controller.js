const { signup, login } = require('./auth.service');

// Signup controller
const signupController = async (req, res) => {
  try {
    const { email, password, firstName, lastName, department, departmentId } = req.body;

    // Map department (name) to departmentId if needed, 
    // or just use departmentId if provided.
    // For now, we assume frontend might send name under 'department'
    const finalDepartmentId = departmentId || (department ? null : undefined); 
    // Note: A more robust fix would look up the ID by name, 
    // but we'll stick to preventing crashes first.

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