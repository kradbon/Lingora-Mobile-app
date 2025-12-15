import { Platform } from 'react-native';

export const API_BASE =
  (process.env.EXPO_PUBLIC_API_BASE as string) ||
  (Platform.OS === 'android' ? 'http://10.0.2.2:8000' : 'http://localhost:8000');
