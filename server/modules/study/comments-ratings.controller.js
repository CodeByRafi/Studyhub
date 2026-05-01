const { addComment, getCommentsByNote, addRating, getRatingsByNote } = require('./comments-ratings.service');

const addCommentController = async (req, res) => {
  try {
    const { note_id, text } = req.body;
    const userId = req.userId;

    if (!note_id || !text) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: note_id, text',
      });
    }

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized: user not authenticated',
      });
    }

    const comment = await addComment(note_id, userId, text);

    res.status(201).json({
      success: true,
      data: comment,
      message: 'Comment added successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error adding comment',
      error: error.message,
    });
  }
};

const getCommentsController = async (req, res) => {
  try {
    const { note_id } = req.query;

    if (!note_id) {
      return res.status(400).json({
        success: false,
        message: 'note_id is required',
      });
    }

    const comments = await getCommentsByNote(note_id);

    res.status(200).json({
      success: true,
      data: comments,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching comments',
      error: error.message,
    });
  }
};

const addRatingController = async (req, res) => {
  try {
    const { note_id, value } = req.body;
    const userId = req.userId;

    if (!note_id || !value) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: note_id, value',
      });
    }

    if (value < 1 || value > 5) {
      return res.status(400).json({
        success: false,
        message: 'Rating value must be between 1 and 5',
      });
    }

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized: user not authenticated',
      });
    }

    const rating = await addRating(note_id, userId, value);

    res.status(201).json({
      success: true,
      data: rating,
      message: 'Rating added successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error adding rating',
      error: error.message,
    });
  }
};

module.exports = {
  addCommentController,
  getCommentsController,
  addRatingController,
};
