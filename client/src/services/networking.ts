import { getToken } from '@/lib/auth';
import { API_URL } from './api';

export async function getNetworkingProfiles() {
  try {
    const response = await fetch(`${API_URL}/api/networking`);
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Server error: ${response.status}`);
    }
    const data = await response.json();
    return data.data || [];
  } catch (error: any) {
    console.error('Failed to fetch networking profiles:', error);
    return [];
  }
}

export async function getNetworkingProfileByUserId(userId: string) {
  try {
    const response = await fetch(`${API_URL}/api/networking/${userId}`);
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Server error: ${response.status}`);
    }
    const data = await response.json();
    return data.data;
  } catch (error: any) {
    console.error('Failed to fetch networking profile:', error);
    throw error;
  }
}

export async function createOrUpdateNetworkingProfile(profileData: any) {
  try {
    const token = getToken();
    const isFormData = profileData instanceof FormData;
    
    const headers: any = {
      Authorization: `Bearer ${token}`,
    };

    // If it's not FormData, we need to set Content-Type to application/json
    if (!isFormData) {
      headers['Content-Type'] = 'application/json';
    }

    const response = await fetch(`${API_URL}/api/networking`, {
      method: 'POST',
      headers,
      body: isFormData ? profileData : JSON.stringify(profileData),
    });

    const data = await response.json().catch(() => ({}));
    
    if (!response.ok) {
      throw new Error(data.message || `Failed to save profile: ${response.status}`);
    }

    return data.data;
  } catch (error: any) {
    console.error('Create/Update Networking Profile Error:', error);
    if (error.name === 'TypeError' && error.message === 'Failed to fetch') {
      throw new Error("Cannot connect to server. Please check if the backend is running on port 5001.");
    }
    throw error;
  }
}