const {
  addResearchComment,
  getResearchCommentsById,
  addResearchRating,
  getResearchRatingsById,
} = require('./research-comments-ratings.service');

const addResearchCommentController = async (req, res) => {
  try {
    const { research_id, text } = req.body;
    const userId = req.userId;

    if (!research_id || !text) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: research_id, text',
      });
    }

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized: user not authenticated',
      });
    }

    const comment = await addResearchComment(research_id, userId, text);

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

const getResearchCommentsController = async (req, res) => {
  try {
    const { research_id } = req.query;

    if (!research_id) {
      return res.status(400).json({
        success: false,
        message: 'research_id is required',
      });
    }

    const comments = await getResearchCommentsById(research_id);

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

const addResearchRatingController = async (req, res) => {
  try {
    const { research_id, value } = req.body;
    const userId = req.userId;

    if (!research_id || !value) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: research_id, value',
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

    const rating = await addResearchRating(research_id, userId, value);

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
  addResearchCommentController,
  getResearchCommentsController,
  addResearchRatingController,
};