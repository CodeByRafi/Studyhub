const express = require('express');
const { requireAuth } = require('../../middleware/authMiddleware');
const {
  getBlogPostsController,
  getBlogPostController,
  createBlogPostController,
  updateBlogPostController,
  deleteBlogPostController,
} = require('./blog.controller');

const router = express.Router();

// GET /api/blog - List all blog posts
router.get('/', getBlogPostsController);

// GET /api/blog/:id - Get a single blog post
router.get('/:id', getBlogPostController);

// POST /api/blog - Create a new blog post (requires auth)
router.post('/', requireAuth, createBlogPostController);

// PUT /api/blog/:id - Update a blog post (requires auth, only author)
router.put('/:id', requireAuth, updateBlogPostController);

// DELETE /api/blog/:id - Delete a blog post (requires auth, only author)
router.delete('/:id', requireAuth, deleteBlogPostController);

module.exports = router;
