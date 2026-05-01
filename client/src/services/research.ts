const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:5001';

export const getResearch = async (): Promise<any[]> => {
  try {
    const response = await fetch(`${API_BASE}/api/research`);
    const data = await response.json();
    return data.success ? data.data : [];
  } catch (error) {
    console.error('Error fetching research:', error);
    return [];
  }
};

export const getResearchById = async (researchId: string): Promise<any | null> => {
  try {
    const response = await fetch(`${API_BASE}/api/research/${researchId}`);
    const data = await response.json();
    return data.success ? data.data : null;
  } catch (error) {
    console.error('Error fetching research by ID:', error);
    return null;
  }
};

export const uploadResearch = async (
  title: string,
  abstract: string,
  department: string,
  course: string,
  file: File,
  token: string
): Promise<any | null> => {
  try {
    const formData = new FormData();
    formData.append('title', title);
    formData.append('abstract', abstract);
    formData.append('department', department);
    formData.append('course', course);
    formData.append('file', file);

    const response = await fetch(`${API_BASE}/api/research/upload`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to upload research paper');
    }

    return data.data || null;
  } catch (error: any) {
    console.error('Error uploading research:', error);
    throw error;
  }
};

export const getResearchComments = async (researchId: string): Promise<any[]> => {
  try {
    const response = await fetch(`${API_BASE}/api/research/comments?research_id=${researchId}`);
    const data = await response.json();
    return data.success ? data.data : [];
  } catch (error) {
    console.error('Error fetching research comments:', error);
    return [];
  }
};

export const addResearchComment = async (
  researchId: string,
  text: string,
  token: string
): Promise<any | null> => {
  try {
    const response = await fetch(`${API_BASE}/api/research/comments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ research_id: researchId, text }),
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to add comment');
    }

    return data.data || null;
  } catch (error: any) {
    console.error('Error adding research comment:', error);
    throw error;
  }
};

export const addResearchRating = async (
  researchId: string,
  value: number,
  token: string
): Promise<any | null> => {
  try {
    const response = await fetch(`${API_BASE}/api/research/ratings`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ research_id: researchId, value }),
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to add rating');
    }

    return data.data || null;
  } catch (error: any) {
    console.error('Error adding research rating:', error);
    throw error;
  }
};