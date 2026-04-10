const { uploadNote, getNotes, getNoteById } = require('./notes.service');

const uploadNoteController = async (req, res) => {
  try {
    const { title, course_id } = req.body;
    const userId = req.userId;
    const file = req.file;

    if (!title || !course_id || !file) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: title, course_id, or file',
      });
    }

    const fileUrl = `/uploads/${file.filename}`;
    // Explicitly parse course_id as integer to avoid DB type mismatches
    const note = await uploadNote(title, fileUrl, userId, parseInt(course_id, 10));

    res.status(201).json({
      success: true,
      data: note,
      message: 'Note uploaded successfully',
    });
  } catch (error) {
    console.error('Upload Note Error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error uploading note',
    });
  }
};

const getNotesController = async (req, res) => {
  try {
    const { department, course, searchQuery } = req.query;
    // Pass filters to service layer
    const notes = await getNotes({ 
      department: department ? (isNaN(Number(department)) ? department : parseInt(department, 10)) : undefined, 
      course: course ? (isNaN(Number(course)) ? course : parseInt(course, 10)) : undefined, 
      searchQuery 
    });

    res.status(200).json({
      success: true,
      data: notes,
    });
  } catch (error) {
    console.error('Get Notes Error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching notes',
    });
  }
};

const getNoteController = async (req, res) => {
  try {
    const { id } = req.params;
    const note = await getNoteById(id);

    if (!note) {
      return res.status(404).json({
        success: false,
        message: 'Note not found',
      });
    }

    res.status(200).json({
      success: true,
      data: note,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching note',
      error: error.message,
    });
  }
};

module.exports = {
  uploadNoteController,
  getNotesController,
  getNoteController,
};