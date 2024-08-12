import apiClient from './apiClient';

const assetEndpoint = '/assets';

export const getAllAssets = async () => {
  const response = await apiClient.get(assetEndpoint);
  return response?.data;
};

export const getAssetById = async (id: string) => {
  const response = await apiClient.get(`${assetEndpoint}/${id}`);
  return response?.data;
};

export const createAsset = async (data: unknown) => {
  const response = await apiClient.post(assetEndpoint, data, {
    headers: {
      'Content-Type': 'application/json', // Adjust the content type as needed
    },
  });
  return response?.data;
};

export const updateAsset = async (data: { id: string }) => {
  const response = await apiClient.put(`${assetEndpoint}/${data.id}`, data);
  return response?.data;
};

export const deleteAssetById = async (id: string) => {
  const response = await apiClient.delete(`${assetEndpoint}/${id}`);
  return response?.data;
};

export const getAssetStatus = async (id: string) => {
  const response = await apiClient.get(`${assetEndpoint}/${id}/status`);
  return response?.data;
};

const assetStatusEndpoint = '/asset-statuses';

export const getAllAssetStatuses = async () => {
  const response = await apiClient.get(assetStatusEndpoint);
  return response?.data;
};

export const getAssetStatusById = async (id: string) => {
  const response = await apiClient.get(`${assetStatusEndpoint}/${id}`);
  return response?.data;
};

export const createAssetStatus = async (data: unknown) => {
  const response = await apiClient.post(assetStatusEndpoint, data, {
    headers: {
      'Content-Type': 'application/json', // Adjust the content type as needed
    },
  });
  return response?.data;
};

export const updateAssetStatus = async (data: { id: string }) => {
  const response = await apiClient.put(
    `${assetStatusEndpoint}/${data.id}`,
    data
  );
  return response?.data;
};

export const deleteAssetStatusById = async (id: string) => {
  const response = await apiClient.delete(`${assetStatusEndpoint}/${id}`);
  return response?.data;
};
