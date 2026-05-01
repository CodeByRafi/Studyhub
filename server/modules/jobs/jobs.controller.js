const { createJob, getJobs, getJobById, applyForJob, getUserApplications } = require('./jobs.service');

const createJobController = async (req, res) => {
  try {
    const {
      title,
      company,
      description,
      type,
      location,
      salary_range,
      requirements,
      contact_email,
    } = req.body;
    const userId = req.userId;

    if (!title || !company || !type) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: title, company, type',
      });
    }

    if (!['internship', 'tuition', 'part-time'].includes(type)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid job type. Must be: internship, tuition, or part-time',
      });
    }

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized: user not authenticated',
      });
    }

    const job = await createJob(
      title,
      company,
      description,
      type,
      location,
      salary_range,
      requirements,
      contact_email,
      userId
    );

    res.status(201).json({
      success: true,
      data: job,
      message: 'Job posted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating job',
      error: error.message,
    });
  }
};

const getJobsController = async (req, res) => {
  try {
    const { type } = req.query;
    const jobs = await getJobs(type);

    res.status(200).json({
      success: true,
      data: jobs,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching jobs',
      error: error.message,
    });
  }
};

const getJobByIdController = async (req, res) => {
  try {
    const { id } = req.params;
    const job = await getJobById(id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found',
      });
    }

    res.status(200).json({
      success: true,
      data: job,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching job',
      error: error.message,
    });
  }
};

const applyForJobController = async (req, res) => {
  try {
    const { job_id, message } = req.body;
    const userId = req.userId;

    if (!job_id) {
      return res.status(400).json({
        success: false,
        message: 'job_id is required',
      });
    }

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized: user not authenticated',
      });
    }

    const application = await applyForJob(job_id, userId, message);

    if (!application) {
      return res.status(409).json({
        success: false,
        message: 'You have already applied for this job',
      });
    }

    res.status(201).json({
      success: true,
      data: application,
      message: 'Application submitted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error applying for job',
      error: error.message,
    });
  }
};

const getUserApplicationsController = async (req, res) => {
  try {
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized: user not authenticated',
      });
    }

    const applications = await getUserApplications(userId);

    res.status(200).json({
      success: true,
      data: applications,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching applications',
      error: error.message,
    });
  }
};

module.exports = {
  createJobController,
  getJobsController,
  getJobByIdController,
  applyForJobController,
  getUserApplicationsController,
};