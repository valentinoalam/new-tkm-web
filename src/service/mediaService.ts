import apiClient from './apiClient';

const mediaEndpoint = '/media';

export const getAllMedia = async () => {
  const response = await apiClient.get(mediaEndpoint);
  return response?.data;
};

export const getMediaById = async (id: string) => {
  const response = await apiClient.get(`${mediaEndpoint}/${id}`);
  return response?.data;
};

export const createMedia = async (data: unknown) => {
  const response = await apiClient.post(mediaEndpoint, data, {
    headers: {
      'Content-Type': 'application/json', // Adjust the content type as needed
    },
  });
  return response?.data;
};

export const updateMedia = async (data: { id: string }) => {
  const response = await apiClient.put(`${mediaEndpoint}/${data.id}`, data);
  return response?.data;
};

export const deleteMediaById = async (id: string) => {
  const response = await apiClient.delete(`${mediaEndpoint}/${id}`);
  return response?.data;
};

const imageEndpoint = '/images';

export const getAllImages = async () => {
  const response = await apiClient.get(imageEndpoint);
  return response?.data;
};

export const getImageById = async (id: string) => {
  const response = await apiClient.get(`${imageEndpoint}/${id}`);
  return response?.data;
};

export const createImage = async (data: unknown) => {
  const response = await apiClient.post(imageEndpoint, data, {
    headers: {
      'Content-Type': 'application/json', // Adjust the content type as needed
    },
  });
  return response?.data;
};

export const updateImage = async (data: { id: string }) => {
  const response = await apiClient.put(`${imageEndpoint}/${data.id}`, data);
  return response?.data;
};

export const deleteImageById = async (id: string) => {
  const response = await apiClient.delete(`${imageEndpoint}/${id}`);
  return response?.data;
};
