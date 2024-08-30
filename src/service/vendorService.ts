import apiClient from './apiClient';

const endpoint = '/vendors';

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
      'Content-Type': 'application/json',
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
