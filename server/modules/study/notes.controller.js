const { uploadNote, getNotes, getNoteById } = require('./notes.service');

const uploadNoteController = async (req, res) => {
  try {
    const { title, course_id } = req.body;
    const userId = req.userId; // Should be set by auth middleware
    const file = req.file;

    if (!title || !course_id || !file) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: title, course_id, file',
      });
    }

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized: user not authenticated',
      });
    }

    const fileUrl = `/uploads/${file.filename}`;
    const note = await uploadNote(title, fileUrl, userId, course_id);

    res.status(201).json({
      success: true,
      data: note,
      message: 'Note uploaded successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error uploading note',
      error: error.message,
    });
  }
};

const getNotesController = async (req, res) => {
  try {
    const { course_id } = req.query;
    const notes = await getNotes(course_id);

    res.status(200).json({
      success: true,
      data: notes,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching notes',
      error: error.message,
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
