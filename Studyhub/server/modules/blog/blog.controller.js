const {
  getBlogPosts,
  getBlogPostById,
  createBlogPost,
  updateBlogPost,
  deleteBlogPost,
} = require('./blog.service');

const getBlogPostsController = async (req, res) => {
  try {
    const { limit = 20, offset = 0 } = req.query;
    const posts = await getBlogPosts(parseInt(limit), parseInt(offset));

    res.status(200).json({
      success: true,
      data: posts || [],
    });
  } catch (error) {
    console.error('Error in getBlogPostsController:', error);
    res.status(200).json({
      success: true,
      data: [],
    });
  }
};

const getBlogPostController = async (req, res) => {
  try {
    const { id } = req.params;
    const post = await getBlogPostById(id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Blog post not found',
      });
    }

    res.status(200).json({
      success: true,
      data: post,
    });
  } catch (error) {
    console.error('Error in getBlogPostController:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching blog post',
      error: error.message,
    });
  }
};

const createBlogPostController = async (req, res) => {
  try {
    const { title, content, excerpt } = req.body;
    const userId = req.userId; // Set by auth middleware

    if (!title || !content) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: title, content',
      });
    }

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized: user not authenticated',
      });
    }

    const post = await createBlogPost(title, content, excerpt, userId);

    res.status(201).json({
      success: true,
      data: post,
      message: 'Blog post created successfully',
    });
  } catch (error) {
    console.error('Error in createBlogPostController:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating blog post',
      error: error.message,
    });
  }
};

const updateBlogPostController = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, excerpt } = req.body;
    const userId = req.userId; // Set by auth middleware

    if (!title || !content) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: title, content',
      });
    }

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized: user not authenticated',
      });
    }

    const post = await updateBlogPost(id, title, content, excerpt, userId);

    res.status(200).json({
      success: true,
      data: post,
      message: 'Blog post updated successfully',
    });
  } catch (error) {
    console.error('Error in updateBlogPostController:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error updating blog post',
      error: error.message,
    });
  }
};

const deleteBlogPostController = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId; // Set by auth middleware

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized: user not authenticated',
      });
    }

    await deleteBlogPost(id, userId);

    res.status(200).json({
      success: true,
      message: 'Blog post deleted successfully',
    });
  } catch (error) {
    console.error('Error in deleteBlogPostController:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error deleting blog post',
      error: error.message,
    });
  }
};

module.exports = {
  getBlogPostsController,
  getBlogPostController,
  createBlogPostController,
  updateBlogPostController,
  deleteBlogPostController,
};
