const express = require('express');
const multer = require('multer');
const path = require('path');
const { requireAuth } = require('../../middleware/authMiddleware');
const { uploadResearchController, getResearchController, getResearchByIdController } = require('./research.controller');
const { addResearchCommentController, getResearchCommentsController, addResearchRatingController } = require('./research-comments-ratings.controller');

const router = express.Router();

// Multer configuration for research papers
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../../uploads'));
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${Math.random().toString(36).substr(2, 9)}.pdf`);
  },
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are allowed'));
    }
  },
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB limit
});

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