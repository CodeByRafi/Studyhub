const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';

export async function recordVisit(page: string) {
  try {
    const response = await fetch(`${API_URL}/api/visit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ page }),
    });
    return response.ok;
  } catch (error) {
    console.error('Error recording visit:', error);
    return false;
  }
}

export async function getStats() {
  try {
    const response = await fetch(`${API_URL}/api/stats`);
    if (!response.ok) throw new Error('Failed to fetch stats');
    const data = await response.json();
    return data.data || {
      totalUsers: 0,
      totalVisits: 0,
      totalNotes: 0,
      totalResearchPapers: 0,
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
}

export async function getUserStats(token: string) {
  try {
    const response = await fetch(`${API_URL}/api/user-stats`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) throw new Error('Failed to fetch user stats');
    const data = await response.json();
    return data.data || {
      totalNotesUploaded: 0,
      totalQuestionsUploaded: 0,
      totalResearchUploaded: 0,
      ratingsReceived: 0,
      commentsReceived: 0,
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
}
