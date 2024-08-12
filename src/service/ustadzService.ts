import apiClient from './apiClient';

const ustadzEndpoint = '/ustadz';

export const getAllUstadz = async () => {
  const response = await apiClient.get(ustadzEndpoint);
  return response?.data;
};

export const getUstadzById = async (id: string) => {
  const response = await apiClient.get(`${ustadzEndpoint}/${id}`);
  return response?.data;
};

export const createUstadz = async (data: unknown) => {
  const response = await apiClient.post(ustadzEndpoint, data, {
    headers: {
      'Content-Type': 'application/json', // Adjust the content type as needed
    },
  });
  return response?.data;
};

export const updateUstadz = async (data: { id: string }) => {
  const response = await apiClient.put(`${ustadzEndpoint}/${data.id}`, data);
  return response?.data;
};

export const deleteUstadzById = async (id: string) => {
  const response = await apiClient.delete(`${ustadzEndpoint}/${id}`);
  return response?.data;
};

const ustadzEventEndpoint = '/ustadz-events';

export const getAllUstadzEvents = async () => {
  const response = await apiClient.get(ustadzEventEndpoint);
  return response?.data;
};

export const getUstadzEventById = async (id: string) => {
  const response = await apiClient.get(`${ustadzEventEndpoint}/${id}`);
  return response?.data;
};

export const createUstadzEvent = async (data: unknown) => {
  const response = await apiClient.post(ustadzEventEndpoint, data, {
    headers: {
      'Content-Type': 'application/json', // Adjust the content type as needed
    },
  });
  return response?.data;
};

export const updateUstadzEvent = async (data: { id: string }) => {
  const response = await apiClient.put(
    `${ustadzEventEndpoint}/${data.id}`,
    data
  );
  return response?.data;
};

export const deleteUstadzEventById = async (id: string) => {
  const response = await apiClient.delete(`${ustadzEventEndpoint}/${id}`);
  return response?.data;
};
