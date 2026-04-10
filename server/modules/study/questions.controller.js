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
    const userId = req.userId;
    const file = req.file;

    console.log('Question upload request:', { title, course_id, userId, file: file ? file.filename : 'missing' });

    if (!title || !course_id || !file) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: title, course_id, or file',
      });
    }

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized: user not authenticated',
      });
    }

    const fileUrl = `/uploads/${file.filename}`;
    const parsedCourseId = parseInt(course_id, 10);
    
    if (isNaN(parsedCourseId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid course_id: must be a number',
      });
    }

    const question = await uploadQuestion(title, fileUrl, userId, parsedCourseId);

    res.status(201).json({
      success: true,
      data: question,
      message: 'Question uploaded successfully',
    });
  } catch (error) {
    console.error('Upload Question Controller Error:', error);
    
    // Extract specific database error if possible
    let errorMsg = error.message;
    if (error.code === '23502') {
      errorMsg = `Column ${error.column} cannot be empty.`;
    } else if (error.code === '23503') {
      errorMsg = 'Foreign key violation: linked record (e.g., course or user) does not exist.';
    } else if (error.code === '23505') {
      errorMsg = 'This record already exists (Unique constraint violation).';
    }

    res.status(500).json({
      success: false,
      message: 'Error uploading question: ' + errorMsg,
    });
  }
};

const getQuestionsController = async (req, res) => {
  try {
    const { department, course, searchQuery } = req.query;
    const questions = await getQuestions({ 
      department: department ? (isNaN(Number(department)) ? department : parseInt(department, 10)) : undefined, 
      course: course ? (isNaN(Number(course)) ? course : parseInt(course, 10)) : undefined, 
      searchQuery 
    });

    res.status(200).json({
      success: true,
      data: questions,
    });
  } catch (error) {
    console.error('Get Questions Error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching questions',
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
