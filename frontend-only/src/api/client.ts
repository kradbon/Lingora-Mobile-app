import axios, { isAxiosError } from 'axios';
import { API_BASE, OFFLINE_MODE } from '../config';
import { getAuthToken, clearAuthToken, getOfflineSessionEmail } from '../offline';

export const client = axios.create({
  baseURL: API_BASE,
  timeout: 8000,
  headers: { 'Content-Type': 'application/json' },
});

client.interceptors.request.use(
  async (config) => {
    if (OFFLINE_MODE) {
      // In offline mode, we should not make any network requests.
      // We can either throw an error to be caught by the calling function,
      // or return a specific response that indicates offline mode.
      // Throwing an error is simpler for now.
      return Promise.reject(new Error('OFFLINE_MODE'));
    }

    const token = await getAuthToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

client.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    if (isAxiosError(error) && error.response?.status === 401) {
      await clearAuthToken();
      // Here you could add logic to redirect the user to the login screen.
      // For example, by using a navigation service.
      console.log('Unauthorized, token cleared');
    }
    return Promise.reject(error);
  },
);
