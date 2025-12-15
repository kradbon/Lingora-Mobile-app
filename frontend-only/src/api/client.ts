import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE } from '../config';

export const client = axios.create({ baseURL: API_BASE, timeout: 8000 });

client.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('lingora_auth_token');
  if (token) {
    config.headers = {
      ...config.headers,
      Authorization: `Bearer ${token}`,
    };
  }
  return config;
});
