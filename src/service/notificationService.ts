import apiClient from './apiClient';

// Define types for Notification
interface Notification {
  id: string;
  title: string;
  message: string;
  // Add other relevant fields as needed
}

interface CreateNotificationRequest {
  title: string;
  message: string;
  // Add other relevant fields as needed
}

export const getAllNotifications = async (): Promise<Notification[]> => {
  const response = await apiClient.get<Notification[]>('/notifications');
  return response.data;
};

export const getNotificationById = async (
  id: string
): Promise<Notification> => {
  const response = await apiClient.get<Notification>(`/notifications/${id}`);
  return response.data;
};

export const createNotification = async (
  data: CreateNotificationRequest
): Promise<Notification> => {
  const response = await apiClient.post<Notification>('/notifications', data, {
    headers: {
      'Content-Type': 'application/json',
    },
  });
  return response.data;
};

export const updateNotification = async (
  id: string,
  data: Partial<CreateNotificationRequest>
): Promise<Notification> => {
  const response = await apiClient.put<Notification>(
    `/notifications/${id}`,
    data
  );
  return response.data;
};

export const deleteNotificationById = async (id: string): Promise<void> => {
  await apiClient.delete(`/notifications/${id}`);
};
