import apiClient from './apiClient';

const bankAccountEndpoint = '/bank-accounts';

export const getAllBankAccounts = async () => {
  const response = await apiClient.get(bankAccountEndpoint);
  return response?.data;
};

export const getBankAccountById = async (id: string) => {
  const response = await apiClient.get(`${bankAccountEndpoint}/${id}`);
  return response?.data;
};

export const createBankAccount = async (data: unknown) => {
  const response = await apiClient.post(bankAccountEndpoint, data, {
    headers: {
      'Content-Type': 'application/json', // Adjust the content type as needed
    },
  });
  return response?.data;
};

export const updateBankAccount = async (data: { id: string }) => {
  const response = await apiClient.put(
    `${bankAccountEndpoint}/${data.id}`,
    data
  );
  return response?.data;
};

export const deleteBankAccountById = async (id: string) => {
  const response = await apiClient.delete(`${bankAccountEndpoint}/${id}`);
  return response?.data;
};
