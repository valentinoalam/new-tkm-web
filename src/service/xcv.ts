// services/apiService.js
import axios from 'axios';

// Set up a base URL for all requests
const apiClient = axios.create({
  baseURL: 'https://your-api-base-url.com/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Users API
export const userService = {
  createUser(data) {
    return apiClient.post('/users', data);
  },
  getUsers() {
    return apiClient.get('/users');
  },
  getUserById(id) {
    return apiClient.get(`/users/${id}`);
  },
  updateUser(id, data) {
    return apiClient.put(`/users/${id}`, data);
  },
  deleteUser(id) {
    return apiClient.delete(`/users/${id}`);
  },
  getUserNotifications(id) {
    return apiClient.get(`/users/${id}/notifications`);
  },
  getUserProfile(id) {
    return apiClient.get(`/users/${id}/profile`);
  },
  getUserPositions(id) {
    return apiClient.get(`/users/${id}/positions`);
  },
};

// UserNotification API
export const userNotificationService = {
  createUserNotification(data) {
    return apiClient.post('/user-notifications', data);
  },
  getUserNotifications() {
    return apiClient.get('/user-notifications');
  },
  getUserNotificationById(id) {
    return apiClient.get(`/user-notifications/${id}`);
  },
  updateUserNotification(id, data) {
    return apiClient.put(`/user-notifications/${id}`, data);
  },
  deleteUserNotification(id) {
    return apiClient.delete(`/user-notifications/${id}`);
  },
};

// Notifications API
export const notificationService = {
  createNotification(data) {
    return apiClient.post('/notifications', data);
  },
  getNotifications() {
    return apiClient.get('/notifications');
  },
  getNotificationById(id) {
    return apiClient.get(`/notifications/${id}`);
  },
  updateNotification(id, data) {
    return apiClient.put(`/notifications/${id}`, data);
  },
  deleteNotification(id) {
    return apiClient.delete(`/notifications/${id}`);
  },
};

// Similarly, implement other services following the same pattern
// Profiles API
export const profileService = {
  createProfile(data) {
    return apiClient.post('/profiles', data);
  },
  getProfiles() {
    return apiClient.get('/profiles');
  },
  getProfileById(id) {
    return apiClient.get(`/profiles/${id}`);
  },
  updateProfile(id, data) {
    return apiClient.put(`/profiles/${id}`, data);
  },
  deleteProfile(id) {
    return apiClient.delete(`/profiles/${id}`);
  },
};

// Continue for other APIs (Positions, Transactions, Accounts, etc.)
