const {
  uploadQuestion,
  getQuestions,
  getQuestionById,
  addQuestionComment,
  getQuestionComments,
  addQuestionRating,
} = require('./questions.service');

const uploadQuestionController = async (req, res) => {
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
    const question = await uploadQuestion(title, fileUrl, userId, course_id);

    res.status(201).json({
      success: true,
      data: question,
      message: 'Question uploaded successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error uploading question',
      error: error.message,
    });
  }
};

const getQuestionsController = async (req, res) => {
  try {
    const { course_id } = req.query;
    const questions = await getQuestions(course_id);

    res.status(200).json({
      success: true,
      data: questions,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching questions',
      error: error.message,
    });
  }
};

const getQuestionController = async (req, res) => {
  try {
    const { id } = req.params;
    const question = await getQuestionById(id);

    if (!question) {
      return res.status(404).json({
        success: false,
        message: 'Question not found',
      });
    }

    res.status(200).json({
      success: true,
      data: question,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching question',
      error: error.message,
    });
  }
};

const addQuestionCommentController = async (req, res) => {
  try {
    const { question_id, content } = req.body;
    const userId = req.userId;

    if (!question_id || !content) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: question_id, content',
      });
    }

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized: user not authenticated',
      });
    }

    const comment = await addQuestionComment(question_id, userId, content);

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

const getQuestionCommentsController = async (req, res) => {
  try {
    const { question_id } = req.query;

    if (!question_id) {
      return res.status(400).json({
        success: false,
        message: 'question_id is required',
      });
    }

    const comments = await getQuestionComments(question_id);

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

const addQuestionRatingController = async (req, res) => {
  try {
    const { question_id, value } = req.body;
    const userId = req.userId;

    if (!question_id || !value) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: question_id, value',
      });
    }

    if (value < 1 || value > 5) {
      return res.status(400).json({
        success: false,
        message: 'Rating must be between 1 and 5',
      });
    }

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized: user not authenticated',
      });
    }

    const rating = await addQuestionRating(question_id, userId, value);

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
  uploadQuestionController,
  getQuestionsController,
  getQuestionController,
  addQuestionCommentController,
  getQuestionCommentsController,
  addQuestionRatingController,
};
