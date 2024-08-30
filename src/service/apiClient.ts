import axios from 'axios';

import router from '@/router'; // Import router instance

const { VITE_BACKEND_URL } = import.meta.env;
const apiClient = axios.create({
  baseURL: VITE_BACKEND_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add an interceptor to set the 'Authorization' header
apiClient.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// Add an interceptor to refresh token when it's expired
apiClient.interceptors.response.use(
  response => {
    return response;
  },
  async error => {
    const originalRequest = error.config;
    if (error.response.status === 401) {
      // Handle unauthorized access, redirect to login, etc.
      localStorage.clear(); //localStorage.removeItem('authToken');
      window.location.reload();
      router.push('/signin');
    }
    if (
      error.response &&
      error.response.status === 403 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;
      const rt = getCookie('rt'); //const refreshToken = localStorage.getItem('refreshToken');
      if (!rt) {
        localStorage.clear(); // Logout or redirect to login
        router.push('/signin');
        return Promise.reject(error);
      }

      try {
        const response = await refreshAccessToken(rt);
        if (response?.status === 200) {
          const at = response?.data.tokens['access_token']; //const newAccessToken = response.data.accessToken;
          localStorage.setItem('wbms_at', at);
          document.cookie =
            'rt=' + response?.data.tokens['refresh_token'] + '; SameSite=Lax';

          //apiClient.defaults.headers.common['Authorization'] = `Bearer ${at}`;
          originalRequest.headers['Authorization'] = `Bearer ${at}`; //originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

          return apiClient(originalRequest);
        }
      } catch (_error) {
        localStorage.clear();
        console.error('Refresh token error:', _error);
        router.push('/signin');
        return Promise.reject(_error);
      }
    }

    return Promise.reject(error);
  }
);

const refreshAccessToken = async (rt: string) => {
  const response = await apiClient
    .post(`auth/refresh`, { token: rt }, { withCredentials: true })
    .catch(error => {
      return {
        status: false,
        message: error.message,
        data: {
          error: error,
        },
      };
    });

  return response.data;
};

export function getCookie(name: string) {
  const cookies = document.cookie.split('; ');
  for (const cookie of cookies) {
    const [key, value] = cookie.split('=');
    if (key === name) {
      return value;
    }
  }
  return null;
}

export default apiClient;
