import apiClient from './apiClient';

const dataEndpoint = 'dari-appsheet';

export const getTransactionDataChart = async () => {
  const response = await apiClient.get(`${dataEndpoint}/data-chart`);
  return response?.data;
};

export const getAllTransactions = async (
  params:
    | { startDate: Date; endDate: Date; page: number; limit: number }
    | undefined
) => {
  const response = await apiClient.get(`${dataEndpoint}/transactions`, {
    params,
  });
  return response?.data;
};

export const getTransactionById = async (id: string) => {
  const response = await apiClient.get(`${dataEndpoint}/${id}`);
  return response?.data;
};

export const createTransaction = async (data: unknown) => {
  const response = await apiClient.post(dataEndpoint, data, {
    headers: {
      'Content-Type': 'application/json', // Adjust the content type as needed
    },
  });
  return response?.data;
};

export const updateTransaction = async (data: { id: string }) => {
  const response = await apiClient.put(`${dataEndpoint}/${data.id}`, data);
  return response?.data;
};

export const updateCategoryById = async (data: { id: string }) => {
  const response = await apiClient.put(
    `${dataEndpoint}/kategori/${data.id}`,
    data
  );
  return response?.data;
};

export const deleteTransactionById = async (id: string) => {
  const response = await apiClient.delete(`${dataEndpoint}/${id}`);
  return response?.data;
};
