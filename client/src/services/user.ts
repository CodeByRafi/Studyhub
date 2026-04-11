import { getToken } from '@/lib/auth';
import { API_URL } from './api';

/**
 * Upload user profile image
 * Sends a multipart/form-data request with the image file
 */
export async function uploadProfileImage(file: File): Promise<any> {
  const token = getToken();
  if (!token) throw new Error('Not authenticated');

  const formData = new FormData();
  formData.append('profile_image', file);

  const response = await fetch(`${API_URL}/api/users/upload-profile-image`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || 'Failed to upload image');
  }

  return data.data;
}

/**
 * Get current authenticated user profile
 */
export async function getCurrentUser(): Promise<any> {
  const token = getToken();
  if (!token) throw new Error('Not authenticated');

  const response = await fetch(`${API_URL}/api/users/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || 'Failed to fetch user');
  }

  return data.data;
}
