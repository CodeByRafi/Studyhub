const { uploadResearch, getResearch, getResearchById } = require('./research.service');

const uploadResearchController = async (req, res) => {
  try {
    const { title, abstract, course_id } = req.body;
    const userId = req.userId;
    const file = req.file;

    if (!title || !file) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: title, file',
      });
    }

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized: user not authenticated',
      });
    }

    const fileUrl = `/uploads/${file.filename}`;
    const research = await uploadResearch(title, abstract, fileUrl, userId, course_id || null);

    res.status(201).json({
      success: true,
      data: research,
      message: 'Research paper uploaded successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error uploading research paper',
      error: error.message,
    });
  }
};

const getResearchController = async (req, res) => {
  try {
    const research = await getResearch();

    res.status(200).json({
      success: true,
      data: research,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching research papers',
      error: error.message,
    });
  }
};

const getResearchByIdController = async (req, res) => {
  try {
    const { id } = req.params;
    const research = await getResearchById(id);

    if (!research) {
      return res.status(404).json({
        success: false,
        message: 'Research paper not found',
      });
    }

    res.status(200).json({
      success: true,
      data: research,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching research paper',
      error: error.message,
    });
  }
};

module.exports = {
  uploadResearchController,
  getResearchController,
  getResearchByIdController,
};