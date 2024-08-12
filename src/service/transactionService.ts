import apiClient from './apiClient';

export const fetchFinancialReport = async (
  startDate: string,
  endDate: string
) => {
  const response = await apiClient.get('/financial-report', {
    params: { startDate, endDate },
  });
  return response.data;
};
const endpoint = 'transactions';

export const getAll = async () => {
  const response = await apiClient.get(`${endpoint}`).catch(error => {
    return {
      status: false,
      message: error.message,
      data: {
        error: error,
      },
    };
  });

  return response?.data;
};
export const getDailyTPKS = async (form: unknown) => {
  const response = await apiClient
    .post(`${endpoint}/apitpks`, form)
    .catch((error: { message: unknown }) => {
      return {
        status: false,
        message: error.message,
        data: {
          error: error,
        },
      };
    });

  return response?.data;
};
export const getDates = async () => {
  const response = await apiClient.get(`${endpoint}/all-dates`);
  return response?.data;
};
export const getById = async (id: string) => {
  const response = await apiClient.get(`${endpoint}/${id}`);
  return response?.data;
};

export const searchMany = async (query: unknown) => {
  const response = await apiClient
    .post(`${endpoint}/search-many`, query)
    .then((res: { data: unknown }) => res.data);

  return response;
};

export const searchFirst = async (query: unknown) => {
  const response = await apiClient.post(`${endpoint}/search-first`, query);
  return response?.data;
};

export const openCreateByQrcodeSemai = async (data: unknown) => {
  const response = await apiClient
    .post(`${endpoint}/open-create-qrcode-semai`, data)
    .then((res: { data: unknown }) => res.data);

  return response;
};

export const searchByQR = async (query: unknown) => {
  const response = await apiClient.post(`${endpoint}/search-qr`, query);
  return response?.data;
};

export const create = async (data: unknown) => {
  const response = await apiClient.post(`${endpoint}`, data);

  return response?.data;
};

export const update = async (data: { id: string }) => {
  const response = await apiClient.patch(`${endpoint}/${data?.id}`, data);
  return response?.data;
};

export const deleteById = async (id: string) => {
  const response = await apiClient.delete(`${endpoint}/${id}`);
  return response?.data;
};

// export const InitialData = {
// };
// Other transaction related services can be added here
// 6. Transaction API
// POST /transactions: Create a new transaction.
// GET /transactions: Retrieve a list of transactions.
// GET /transactions/{id}: Retrieve a specific transaction by ID.
// PUT /transactions/{id}: Update a specific transaction by ID.
// DELETE /transactions/{id}: Delete a specific transaction by ID.
// GET /transactions/{id}/category: Retrieve the category of a specific transaction.
// 7. TransactionCategory API
// POST /transaction-categories: Create a new transaction category.
// GET /transaction-categories: Retrieve a list of transaction categories.
// GET /transaction-categories/{id}: Retrieve a specific transaction category by ID.
// PUT /transaction-categories/{id}: Update a specific transaction category by ID.
// DELETE /transaction-categories/{id}: Delete a specific transaction category by ID.

// 14. Program API
// POST /programs: Create a new program.
// GET /programs: Retrieve a list of programs.
// GET /programs/{id}: Retrieve a specific program by ID.
// PUT /programs/{id}: Update a specific program by ID.
// DELETE /programs/{id}: Delete a specific program by ID.
