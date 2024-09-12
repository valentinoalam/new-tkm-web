import { AxiosError } from 'axios';

import apiClient from './apiClient';

interface User {
  id: string;
  email: string;
  name: string;
  // Add other user properties as needed
}

interface LoginResponse {
  tokens: string;
  user: object;

  // Add other fields that the response might include
}

// Define types for the request and response data
interface RegisterResponse {
  // Define the structure of the response data based on your API
  // Example:
  token: string;
  user: {
    id: string;
    email: string;
    // Add other user properties as needed
  };
}

interface RegisterRequest {
  email: string;
  password: string;
}

interface ErrorResponse {
  message: string;
  // Add other fields if your error response contains more information
}

const authService = {
  async login(username: string, password: string): Promise<LoginResponse> {
    try {
      const response = await apiClient.post<LoginResponse>('/auth/signin', {
        username,
        password,
      });
      const { tokens } = response.data;

      // Store the token in local storage
      localStorage.setItem('authToken', tokens);

      return response.data;
    } catch (error: unknown) {
      const axiosError = error as AxiosError;

      if (axiosError.response) {
        const errorMessage = (axiosError.response.data as { message: string })
          .message;
        throw new Error(errorMessage || 'Login failed');
      } else {
        throw new Error('Login failed');
      }
    }
  },

  async register(email: string, password: string): Promise<RegisterResponse> {
    try {
      const requestPayload: RegisterRequest = { email, password };
      const response = await apiClient.post<RegisterResponse>(
        '/auth/register',
        requestPayload
      );
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError;

      if (axiosError.response) {
        const errorData = axiosError.response.data as ErrorResponse;
        throw new Error(errorData.message || 'Registration failed');
      } else {
        throw new Error('Registration failed');
      }
    }
  },

  async logout() {
    // Remove the token from local storage and redirect
    localStorage.removeItem('authToken');
    window.location.href = '/login'; // Redirect to login or home
  },

  async getCurrentUser(): Promise<User> {
    try {
      const response = await apiClient.get<User>('/auth/me');
      return response.data;
    } catch (error: unknown) {
      const axiosError = error as AxiosError;

      if (axiosError.response) {
        // Assuming the error response has a known structure
        const errorMessage = (axiosError.response.data as { message: string })
          .message;
        throw new Error(errorMessage || 'Failed to fetch current user');
      } else {
        throw new Error('Failed to fetch current user');
      }
    }
  },
};

export default authService;
