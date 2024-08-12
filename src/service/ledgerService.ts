// Account API
// POST /accounts: Create a new account.
// GET /accounts: Retrieve a list of accounts.
// GET /accounts/{id}: Retrieve a specific account by ID.
// PUT /accounts/{id}: Update a specific account by ID.
// DELETE /accounts/{id}: Delete a specific account by ID.
// GET /accounts/{id}/ledger: Retrieve the ledger associated with a specific account.
// Ledger API
// POST /ledgers: Create a new ledger.
// GET /ledgers: Retrieve a list of ledgers.
// GET /ledgers/{id}: Retrieve a specific ledger by ID.
// PUT /ledgers/{id}: Update a specific ledger by ID.
// DELETE /ledgers/{id}: Delete a specific ledger by ID.

import apiClient from './apiClient';

const accountEndpoint = '/accounts';

export const getAllAccounts = async () => {
  const response = await apiClient.get(accountEndpoint);
  return response?.data;
};

export const getAccountById = async (id: string) => {
  const response = await apiClient.get(`${accountEndpoint}/${id}`);
  return response?.data;
};

export const createAccount = async (data: unknown) => {
  const response = await apiClient.post(accountEndpoint, data, {
    headers: {
      'Content-Type': 'application/json', // Adjust the content type as needed
    },
  });
  return response?.data;
};

export const updateAccount = async (data: { id: string }) => {
  const response = await apiClient.put(`${accountEndpoint}/${data.id}`, data);
  return response?.data;
};

export const deleteAccountById = async (id: string) => {
  const response = await apiClient.delete(`${accountEndpoint}/${id}`);
  return response?.data;
};

export const getAccountLedger = async (id: string) => {
  const response = await apiClient.get(`${accountEndpoint}/${id}/ledger`);
  return response?.data;
};

const ledgerEndpoint = '/ledgers';

export const getAllLedgers = async () => {
  const response = await apiClient.get(ledgerEndpoint);
  return response?.data;
};

export const getLedgerById = async (id: string) => {
  const response = await apiClient.get(`${ledgerEndpoint}/${id}`);
  return response?.data;
};

export const createLedger = async (data: unknown) => {
  const response = await apiClient.post(ledgerEndpoint, data, {
    headers: {
      'Content-Type': 'application/json', // Adjust the content type as needed
    },
  });
  return response?.data;
};

export const updateLedger = async (data: { id: string }) => {
  const response = await apiClient.put(`${ledgerEndpoint}/${data.id}`, data);
  return response?.data;
};

export const deleteLedgerById = async (id: string) => {
  const response = await apiClient.delete(`${ledgerEndpoint}/${id}`);
  return response?.data;
};
