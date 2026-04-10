const express = require('express');
const upload = require('../../config/multer');
const { requireAuth } = require('../../middleware/authMiddleware');
const { getDepartmentsController, getCoursesController } = require('./study.controller');
const { uploadNoteController, getNotesController, getNoteController } = require('./notes.controller');
const { addCommentController, getCommentsController, addRatingController } = require('./comments-ratings.controller');
const {
  uploadQuestionController,
  getQuestionsController,
  getQuestionController,
  addQuestionCommentController,
  getQuestionCommentsController,
  addQuestionRatingController,
} = require('./questions.controller');

const router = express.Router();



// Routes
// GET /api/study/departments
router.get('/departments', getDepartmentsController);

// GET /api/study/courses?department_id=ID
router.get('/courses', getCoursesController);

// POST /api/study/notes/upload
router.post('/notes/upload', requireAuth, upload.single('file'), uploadNoteController);

// GET /api/study/notes?course_id=ID
router.get('/notes', getNotesController);

// GET /api/study/notes/:id
router.get('/notes/:id', getNoteController);

// POST /api/study/comments
router.post('/comments', requireAuth, addCommentController);

// GET /api/study/comments?note_id=ID
router.get('/comments', getCommentsController);

// POST /api/study/ratings
router.post('/ratings', requireAuth, addRatingController);

// POST /api/study/questions/upload
router.post('/questions/upload', requireAuth, upload.single('file'), uploadQuestionController);

// GET /api/study/questions?course_id=ID
router.get('/questions', getQuestionsController);

// GET /api/study/questions/:id
router.get('/questions/:id', getQuestionController);

// POST /api/study/question-comments
router.post('/question-comments', requireAuth, addQuestionCommentController);

// GET /api/study/question-comments?question_id=ID
router.get('/question-comments', getQuestionCommentsController);

// POST /api/study/question-ratings
router.post('/question-ratings', requireAuth, addQuestionRatingController);

module.exports = router;