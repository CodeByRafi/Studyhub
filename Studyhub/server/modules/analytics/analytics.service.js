const pool = require('../../config/db');

// Record a visit
const recordVisit = async (page, ipAddress, userAgent, userId = null) => {
  try {
    await pool.query(
      'INSERT INTO visits (user_id, page, ip_address, user_agent) VALUES ($1, $2, $3, $4)',
      [userId, page, ipAddress, userAgent]
    );
  } catch (error) {
    console.error('Error recording visit:', error);
  }
};

// Get analytics stats (global/public stats)
const getStats = async () => {
  try {
    const [usersResult, visitsResult, notesResult, researchResult] = await Promise.all([
      pool.query('SELECT COUNT(*) as count FROM users'),
      pool.query('SELECT COUNT(*) as count FROM visits'),
      pool.query('SELECT COUNT(*) as count FROM notes'),
      pool.query('SELECT COUNT(*) as count FROM research'),
    ]);

    return {
      totalUsers: parseInt(usersResult.rows[0].count) || 0,
      totalVisits: parseInt(visitsResult.rows[0].count) || 0,
      totalNotes: parseInt(notesResult.rows[0].count) || 0,
      totalResearchPapers: parseInt(researchResult.rows[0].count) || 0,
    };
  } catch (error) {
    console.error('Error fetching stats:', error);
    return {
      totalUsers: 0,
      totalVisits: 0,
      totalNotes: 0,
      totalResearchPapers: 0,
    };
  }
};

// Get user-specific stats
const getUserStats = async (userId) => {
  try {
    const [notesResult, questionsResult, researchResult, ratingsResult, commentsResult] = await Promise.all([
      pool.query('SELECT COUNT(*) as count FROM notes WHERE user_id = $1', [userId]),
      pool.query('SELECT COUNT(*) as count FROM questions WHERE user_id = $1', [userId]),
      pool.query('SELECT COUNT(*) as count FROM research WHERE user_id = $1', [userId]),
      pool.query(`
        SELECT COUNT(*) as count FROM (
          SELECT r.id FROM ratings r 
          JOIN notes n ON r.note_id = n.id WHERE n.user_id = $1
          UNION ALL
          SELECT qr.id FROM question_ratings qr
          JOIN questions q ON qr.question_id = q.id WHERE q.user_id = $1
          UNION ALL
          SELECT rr.id FROM research_ratings rr
          JOIN research r ON rr.research_id = r.id WHERE r.user_id = $1
        ) as all_ratings
      `, [userId]),
      pool.query(`
        SELECT COUNT(*) as count FROM (
          SELECT c.id FROM comments c
          JOIN notes n ON c.note_id = n.id WHERE n.user_id = $1
          UNION ALL
          SELECT qc.id FROM question_comments qc
          JOIN questions q ON qc.question_id = q.id WHERE q.user_id = $1
          UNION ALL
          SELECT rc.id FROM research_comments rc
          JOIN research r ON rc.research_id = r.id WHERE r.user_id = $1
        ) as all_comments
      `, [userId]),
    ]);

    return {
      totalNotesUploaded: parseInt(notesResult.rows[0].count) || 0,
      totalQuestionsUploaded: parseInt(questionsResult.rows[0].count) || 0,
      totalResearchUploaded: parseInt(researchResult.rows[0].count) || 0,
      ratingsReceived: parseInt(ratingsResult.rows[0].count) || 0,
      commentsReceived: parseInt(commentsResult.rows[0].count) || 0,
    };
  } catch (error) {
    console.error('Error fetching user stats:', error);
    return {
      totalNotesUploaded: 0,
      totalQuestionsUploaded: 0,
      totalResearchUploaded: 0,
      ratingsReceived: 0,
      commentsReceived: 0,
    };
  }
};

// Get user activity
const getUserActivity = async (userId, limit = 10) => {
  try {
    const query = `
      SELECT 
        'note' as type,
        n.id,
        n.title as content_title,
        'uploaded a note' as action,
        n.created_at,
        n.created_at as timestamp
      FROM notes n
      WHERE n.user_id = $1
      UNION ALL
      SELECT 
        'question' as type,
        q.id,
        q.title as content_title,
        'uploaded a question' as action,
        q.created_at,
        q.created_at as timestamp
      FROM questions q
      WHERE q.user_id = $1
      UNION ALL
      SELECT 
        'research' as type,
        r.id,
        r.title as content_title,
        'uploaded a paper' as action,
        r.created_at,
        r.created_at as timestamp
      FROM research r
      WHERE r.user_id = $1
      ORDER BY timestamp DESC
      LIMIT $2
    `;

    const result = await pool.query(query, [userId, limit]);
    return result.rows || [];
  } catch (error) {
    console.error('Error fetching user activity:', error);
    return [];
  }
};

module.exports = {
  recordVisit,
  getStats,
  getUserStats,
  getUserActivity,
};
