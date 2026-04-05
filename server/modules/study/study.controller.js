const { getDepartments, getCoursesByDepartment } = require('./study.service');

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

module.exports = {
  getDepartmentsController,
  getCoursesController,
};
