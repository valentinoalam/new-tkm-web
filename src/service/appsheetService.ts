import apiClient from './apiClient';

const dataEndpoint = 'dari-appsheet';

export const getTransactionDataChart = async () => {
  const response = await apiClient.get(`${dataEndpoint}/data-summary`);
  return response?.data;
};

export const getAllTransactions = async (
  params:
    | {
        startDate: Date;
        endDate: Date;
        page: number;
        limit: number;
        search: string;
      }
    | undefined
) => {
  const response = await apiClient.get(`${dataEndpoint}/transactions`, {
    params,
  });
  return response?.data;
};

export const getBalanceReport = async (
  params:
    | {
        month: number;
        year: number;
      }
    | undefined
) => {
  const response = await apiClient.get(`${dataEndpoint}/balance`, {
    params,
  });
  return response;
};

export const getAllCategories = async () => {
  const response = await apiClient.get(`${dataEndpoint}/categories`);
  return response;
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

export const updateTransactionById = async (data: { id: string }) => {
  const response = await apiClient.put(`${dataEndpoint}/${data.id}`, data);
  return response?.data;
};

export const updateCategoryById = async (
  id: string,
  data: {
    color: string;
  }
) => {
  const response = await apiClient
    .patch(`${dataEndpoint}/kategori/${id}`, data)
    .catch(error => {
      console.error('Error:', error);
    });
  return response?.data;
};

export const deleteTransactionById = async (id: string) => {
  const response = await apiClient.delete(`${dataEndpoint}/${id}`);
  return response?.data;
};
