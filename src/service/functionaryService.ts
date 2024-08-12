import apiClient from './apiClient';

const positionEndpoint = '/positions';

export const getAllPositions = async () => {
  const response = await apiClient.get(positionEndpoint);
  return response?.data;
};

export const getPositionById = async (id: string) => {
  const response = await apiClient.get(`${positionEndpoint}/${id}`);
  return response?.data;
};

export const createPosition = async (data: unknown) => {
  const response = await apiClient.post(positionEndpoint, data, {
    headers: {
      'Content-Type': 'application/json', // Adjust the content type as needed
    },
  });
  return response?.data;
};

export const updatePosition = async (data: { id: string }) => {
  const response = await apiClient.put(`${positionEndpoint}/${data.id}`, data);
  return response?.data;
};

export const deletePositionById = async (id: string) => {
  const response = await apiClient.delete(`${positionEndpoint}/${id}`);
  return response?.data;
};
