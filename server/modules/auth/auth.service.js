const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../../config/db');

// Hash password
const hashPassword = async (password) => {
  const saltRounds = 10;
  return bcrypt.hash(password, saltRounds);
};

// Compare password
const comparePassword = async (password, hashedPassword) => {
  return bcrypt.compare(password, hashedPassword);
};

// Generate JWT token
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

// Signup service
const signup = async (email, password, firstName, lastName, departmentId) => {
  try {
    // Check if user already exists
    const userExists = await pool.query(
      'SELECT id FROM users WHERE email = $1',
      [email]
    );

    if (userExists.rows.length > 0) {
      throw new Error('Email already registered');
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Insert new user
    const result = await pool.query(
      'INSERT INTO users (email, password, first_name, last_name, department_id) VALUES ($1, $2, $3, $4, $5) RETURNING id, email, first_name, last_name',
      [email, hashedPassword, firstName, lastName, departmentId]
    );

    const user = result.rows[0];
    const token = generateToken(user.id);

    return { success: true, user, token };
  } catch (error) {
    throw error;
  }
};

// Login service
const login = async (email, password) => {
  try {
    // Find user by email
    const result = await pool.query(
      'SELECT id, email, password, first_name, last_name FROM users WHERE email = $1',
      [email]
    );

    if (result.rows.length === 0) {
      throw new Error('Invalid email or password');
    }

    const user = result.rows[0];

    // Compare password
    const isPasswordValid = await comparePassword(password, user.password);

    if (!isPasswordValid) {
      throw new Error('Invalid email or password');
    }

    const token = generateToken(user.id);

    // Remove password from response
    delete user.password;

    return { success: true, user, token };
  } catch (error) {
    throw error;
  }
};

// Verify token
const verifyToken = (token) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  signup,
  login,
  verifyToken,
  hashPassword,
  comparePassword,
};