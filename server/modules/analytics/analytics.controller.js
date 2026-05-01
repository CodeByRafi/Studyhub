const { recordVisit, getStats, getUserStats, getUserActivity } = require('./analytics.service');

// Record visit
const recordVisitController = async (req, res) => {
  try {
    const { page } = req.body;
    const ipAddress = req.ip || req.connection.remoteAddress || 'unknown';
    const userAgent = req.get('user-agent') || 'unknown';
    const userId = req.userId || null;

    // Fire and forget, or handle it resiliently
    recordVisit(page, ipAddress, userAgent, userId).catch(err => 
      console.error('Safe-catch: Analytics recording failed:', err)
    );

    // Always respond with success to the client for analytics pings
    res.status(200).json({
      success: true,
      message: 'Processing visit',
    });
  } catch (error) {
    // This catch only triggers if the request processing itself fails
    console.error('Analytics controller error:', error);
    res.status(200).json({
      success: true,
      message: 'Analytics request received',
    });
  }
};

// Get stats (global or user-specific)
const getStatsController = async (req, res) => {
  try {
    const stats = await getStats();
    res.status(200).json({
      success: true,
      data: stats,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching stats',
      error: error.message,
    });
  }
};

// Get user stats
const getUserStatsController = async (req, res) => {
  try {
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized: user not authenticated',
      });
    }

    const stats = await getUserStats(userId);
    res.status(200).json({
      success: true,
      data: stats,
    });
  } catch (error) {
    console.error('Error in getUserStatsController:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching user stats',
      error: error.message,
    });
  }
};

// Get user activity
const getUserActivityController = async (req, res) => {
  try {
    const userId = req.userId;
    const { limit = 10 } = req.query;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized: user not authenticated',
      });
    }

    const activity = await getUserActivity(userId, parseInt(limit));
    res.status(200).json({
      success: true,
      data: activity,
    });
  } catch (error) {
    console.error('Error in getUserActivityController:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching user activity',
      error: error.message,
    });
  }
};

module.exports = {
  recordVisitController,
  getStatsController,
  getUserStatsController,
  getUserActivityController,
};
