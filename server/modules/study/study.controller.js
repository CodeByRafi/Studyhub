const { getDepartments, getCoursesByDepartment, getNotes, createCourse } = require('./study.service');

const getDepartmentsController = async (req, res) => {
  try {
    const departments = await getDepartments();
    res.status(200).json({
      success: true,
      data: departments,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching departments',
      error: error.message,
    });
  }
};

const getCoursesController = async (req, res) => {
  try {
    const { department_id } = req.query;

    if (!department_id) {
      return res.status(400).json({
        success: false,
        message: 'department_id is required',
      });
    }

    const courses = await getCoursesByDepartment(department_id);
    res.status(200).json({
      success: true,
      data: courses || [],
    });
  } catch (error) {
    console.error('Error in getCoursesController:', error);
    res.status(200).json({
      success: true,
      data: [],
      message: 'No courses found for this department',
    });
  }
};

const addCourseController = async (req, res) => {
  try {
    const { department_id, name } = req.body;

    if (!department_id || !name) {
      return res.status(400).json({
        success: false,
        message: 'department_id and name are required',
      });
    }

    // Explicitly parse department_id as integer
    const course = await createCourse(parseInt(department_id, 10), name);
    res.status(201).json({
      success: true,
      data: course,
    });
  } catch (error) {
    console.error('Add Course Controller Error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error adding course',
    });
  }
};

const getNotesController = async (req, res) => {
  try {
    const { department, course, searchQuery } = req.query;
    const notes = await getNotes({ department, course, searchQuery });
    res.status(200).json({ success: true, data: notes });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching notes', error: error.message });
  }
};

module.exports = {
  getDepartmentsController,
  getCoursesController,
  addCourseController,
  getNotesController,
};