const db = require('../../config/db');

const getBlogPosts = async (limit = 20, offset = 0) => {
  try {
    const result = await db.query(
      `SELECT bp.id, bp.title, bp.content, bp.excerpt, bp.author_id, bp.created_at, bp.updated_at,
              u.first_name, u.last_name
       FROM blog_posts bp
       LEFT JOIN users u ON bp.author_id = u.id
       ORDER BY bp.created_at DESC
       LIMIT $1 OFFSET $2`,
      [limit, offset]
    );
    return result.rows || [];
  } catch (error) {
    console.error('Error fetching blog posts:', error.message);
    return [];
  }
};

const getBlogPostById = async (postId) => {
  try {
    const result = await db.query(
      `SELECT bp.id, bp.title, bp.content, bp.excerpt, bp.author_id, bp.created_at, bp.updated_at,
              u.first_name, u.last_name
       FROM blog_posts bp
       LEFT JOIN users u ON bp.author_id = u.id
       WHERE bp.id = $1`,
      [postId]
    );
    return result.rows[0] || null;
  } catch (error) {
    console.error('Error fetching blog post:', error.message);
    return null;
  }
};

const createBlogPost = async (title, content, excerpt, authorId) => {
  try {
    if (!title || !content || !authorId) {
      throw new Error('Missing required fields: title, content, authorId');
    }

    const result = await db.query(
      `INSERT INTO blog_posts (title, content, excerpt, author_id, created_at, updated_at)
       VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
       RETURNING id, title, content, excerpt, author_id, created_at, updated_at`,
      [title, content, excerpt || content.substring(0, 200), authorId]
    );
    return result.rows[0] || null;
  } catch (error) {
    console.error('Error creating blog post:', error.message);
    throw error;
  }
};

const updateBlogPost = async (postId, title, content, excerpt, authorId) => {
  try {
    // Check if user is the author
    const post = await getBlogPostById(postId);
    if (!post || post.author_id !== authorId) {
      throw new Error('Unauthorized: only the author can edit this post');
    }

    const result = await db.query(
      `UPDATE blog_posts 
       SET title = $1, content = $2, excerpt = $3, updated_at = CURRENT_TIMESTAMP
       WHERE id = $4
       RETURNING id, title, content, excerpt, author_id, created_at, updated_at`,
      [title, content, excerpt || content.substring(0, 200), postId]
    );
    return result.rows[0] || null;
  } catch (error) {
    console.error('Error updating blog post:', error.message);
    throw error;
  }
};

const deleteBlogPost = async (postId, authorId) => {
  try {
    // Check if user is the author
    const post = await getBlogPostById(postId);
    if (!post || post.author_id !== authorId) {
      throw new Error('Unauthorized: only the author can delete this post');
    }

    const result = await db.query(
      'DELETE FROM blog_posts WHERE id = $1 RETURNING id',
      [postId]
    );
    return result.rows[0] || null;
  } catch (error) {
    console.error('Error deleting blog post:', error.message);
    throw error;
  }
};

module.exports = {
  getBlogPosts,
  getBlogPostById,
  createBlogPost,
  updateBlogPost,
  deleteBlogPost,
};
