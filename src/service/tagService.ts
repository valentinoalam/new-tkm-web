import apiClient from './apiClient';

const tagEndpoint = '/tags';

export const getAllTags = async () => {
  const response = await apiClient.get(tagEndpoint);
  return response?.data;
};

export const getTagById = async (id: string) => {
  const response = await apiClient.get(`${tagEndpoint}/${id}`);
  return response?.data;
};

export const createTag = async (data: unknown) => {
  const response = await apiClient.post(tagEndpoint, data, {
    headers: {
      'Content-Type': 'application/json', // Adjust the content type as needed
    },
  });
  return response?.data;
};

export const updateTag = async (data: { id: string }) => {
  const response = await apiClient.put(`${tagEndpoint}/${data.id}`, data);
  return response?.data;
};

export const deleteTagById = async (id: string) => {
  const response = await apiClient.delete(`${tagEndpoint}/${id}`);
  return response?.data;
};
