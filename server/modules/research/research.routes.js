const express = require('express');
const { requireAuth } = require('../../middleware/authMiddleware');
const upload = require('../../config/multer');
const { uploadResearchController, getResearchController, getResearchByIdController } = require('./research.controller');
const { addResearchCommentController, getResearchCommentsController, addResearchRatingController } = require('./research-comments-ratings.controller');

const router = express.Router();



// Routes
// POST /api/research/upload
router.post('/upload', requireAuth, upload.single('file'), uploadResearchController);

// GET /api/research
router.get('/', getResearchController);

// GET /api/research/:id
router.get('/:id', getResearchByIdController);

// POST /api/research/comments
router.post('/comments', requireAuth, addResearchCommentController);

// GET /api/research/comments?research_id=ID
router.get('/comments', getResearchCommentsController);

// POST /api/research/ratings
router.post('/ratings', requireAuth, addResearchRatingController);

module.exports = router;