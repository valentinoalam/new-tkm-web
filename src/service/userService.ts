import apiClient from './apiClient';

const endpoint = '/users';

export const getAll = async () => {
  const response = await apiClient.get(endpoint);
  return response?.data;
};

export const getById = async (id: string) => {
  const response = await apiClient.get(`${endpoint}/${id}`);
  return response?.data;
};

export const create = async (data: unknown) => {
  const response = await apiClient.post(endpoint, data, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response?.data;
};

export const update = async (data: { id: string }) => {
  const response = await apiClient.patch(`${endpoint}/${data.id}`, data);
  return response?.data;
};

export const deleteById = async (id: string) => {
  const response = await apiClient.delete(`${endpoint}/${id}`);
  return response?.data;
};

export const getUserNotifications = async (id: string) => {
  return apiClient.get(`/users/${id}/notifications`);
};

export const getUserProfile = async (id: string) => {
  return apiClient.get(`/users/${id}/profile`);
};

export const getUserPositions = async (id: string) => {
  return apiClient.get(`/users/${id}/positions`);
};
// Profile API
// POST /profiles: Create a new profile.
// GET /profiles: Retrieve a list of profiles.
// GET /profiles/{id}: Retrieve a specific profile by ID.
// PUT /profiles/{id}: Update a specific profile by ID.
// DELETE /profiles/{id}: Delete a specific profile by ID.
export const profileService = {
  createProfile(data: string) {
    return apiClient.post('/profiles', data);
  },
  getProfiles() {
    return apiClient.get('/profiles');
  },
  getProfileById(id: string) {
    return apiClient.get(`/profiles/${id}`);
  },
  updateProfile(id: string, data: object) {
    return apiClient.put(`/profiles/${id}`, data);
  },
  deleteProfile(id: string) {
    return apiClient.delete(`/profiles/${id}`);
  },
};
// 1. User API
// POST /users: Create a new user.
// GET /users: Retrieve a list of users.
// GET /users/{id}: Retrieve a specific user by ID.
// PUT /users/{id}: Update a specific user by ID.
// DELETE /users/{id}: Delete a specific user by ID.
// GET /users/{id}/notifications: Retrieve notifications for a specific user.
// GET /users/{id}/profile: Retrieve the profile of a specific user.
// GET /users/{id}/positions: Retrieve positions associated with a specific user.
// 2. UserNotification API
// POST /user-notifications: Create a new user notification.
// GET /user-notifications: Retrieve a list of user notifications.
// GET /user-notifications/{id}: Retrieve a specific user notification by ID.
// PUT /user-notifications/{id}: Update a specific user notification by ID.
// DELETE /user-notifications/{id}: Delete a specific user notification by ID.
