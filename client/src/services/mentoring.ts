import { getToken } from '@/lib/auth';
import { API_URL } from './api';

export async function getMentors() {
  try {
    const response = await fetch(`${API_URL}/api/mentoring`);
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Server error: ${response.status}`);
    }
    const data = await response.json();
    return data.data || [];
  } catch (error: any) {
    console.error('Failed to fetch mentors:', error);
    return [];
  }
}

export async function getMentorByUserId(userId: string) {
  try {
    const response = await fetch(`${API_URL}/api/mentoring/${userId}`);
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Server error: ${response.status}`);
    }
    const data = await response.json();
    return data.data;
  } catch (error: any) {
    console.error('Failed to fetch mentor profile:', error);
    throw error;
  }
}

export async function createOrUpdateMentor(mentorData: any) {
  try {
    const token = getToken();
    const response = await fetch(`${API_URL}/api/mentoring`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(mentorData),
    });

    const data = await response.json().catch(() => ({}));
    
    if (!response.ok) {
      throw new Error(data.message || `Failed to save mentor profile: ${response.status}`);
    }

    return data.data;
  } catch (error: any) {
    console.error('Create/Update Mentor Profile Error:', error);
    if (error.name === 'TypeError' && error.message === 'Failed to fetch') {
      throw new Error("Cannot connect to server. Please check your internet connection.");
    }
    throw error;
  }
}
