const pool = require('../../config/db');

const createJob = async (title, company, description, type, location, salaryRange, requirements, contactEmail, userId) => {
  const query = `
    INSERT INTO jobs (title, company, description, type, location, salary_range, requirements, contact_email, user_id)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
    RETURNING *
  `;
  const values = [title, company, description, type, location, salaryRange, requirements, contactEmail, userId];
  const result = await pool.query(query, values);
  return result.rows[0];
};

const getJobs = async (type) => {
  let query = `
    SELECT j.*, u.first_name, u.last_name
    FROM jobs j
    LEFT JOIN users u ON j.user_id = u.id
  `;
  const values = [];

  if (type) {
    query += ' WHERE j.type = $1';
    values.push(type);
  }

  query += ' ORDER BY j.created_at DESC';

  const result = await pool.query(query, values);
  return result.rows;
};

const getJobById = async (jobId) => {
  const query = `
    SELECT j.*, u.first_name, u.last_name
    FROM jobs j
    LEFT JOIN users u ON j.user_id = u.id
    WHERE j.id = $1
  `;
  const result = await pool.query(query, [jobId]);
  return result.rows[0];
};

const applyForJob = async (jobId, userId, message) => {
  const query = `
    INSERT INTO job_applications (job_id, user_id, message)
    VALUES ($1, $2, $3)
    ON CONFLICT (user_id, job_id)
    DO NOTHING
    RETURNING *
  `;
  const values = [jobId, userId, message];
  const result = await pool.query(query, values);
  return result.rows[0];
};

const getUserApplications = async (userId) => {
  const query = `
    SELECT ja.*, j.title, j.company, j.type
    FROM job_applications ja
    LEFT JOIN jobs j ON ja.job_id = j.id
    WHERE ja.user_id = $1
    ORDER BY ja.created_at DESC
  `;
  const result = await pool.query(query, [userId]);
  return result.rows;
};

module.exports = {
  createJob,
  getJobs,
  getJobById,
  applyForJob,
  getUserApplications,
};