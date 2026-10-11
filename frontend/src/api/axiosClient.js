import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

const axiosClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

const normalizeResponseData = (data) => {
  if (Array.isArray(data)) {
    return data;
  }

  if (data && Array.isArray(data.value)) {
    return data.value;
  }

  if (data && Array.isArray(data.data)) {
    return data.data;
  }

  if (data && Array.isArray(data.items)) {
    return data.items;
  }

  return data;
};

axiosClient.interceptors.response.use(
  (response) => normalizeResponseData(response.data),
  (error) => {
    if (error.response && error.response.status === 401) {
      // If unauthorized, clear token if expired
      // but let caller handle UI redirection
    }
    const message = error.response?.data?.message || error.message || 'Something went wrong';
    return Promise.reject(new Error(message));
  }
);

export default axiosClient;
