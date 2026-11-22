/**
 * Frontend Service Layer for User Profile
 * Communicates with existing backend endpoints:
 * - GET /api/profile
 * - PATCH /api/profile
 */

export async function getProfile() {
  try {
    const res = await fetch('/api/profile', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    return await res.json();
  } catch (error) {
    console.error('getProfile service error:', error);
    return { success: false, message: error.message };
  }
}

export async function updateProfile(profileData) {
  try {
    const res = await fetch('/api/profile', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(profileData)
    });
    return await res.json();
  } catch (error) {
    console.error('updateProfile service error:', error);
    return { success: false, message: error.message };
  }
}

