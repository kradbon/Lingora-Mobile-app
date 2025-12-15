import { client } from './client';

export const loginMobile = (body: { email: string; password: string }) =>
  client.post('/auth/login-mobile', body).then((r) => r.data);

export const register = (body: { name: string; email: string; password: string }) =>
  client.post('/auth/register', body).then((r) => r.data);

export const me = () => client.get('/auth/me').then((r) => r.data);

export const ping = () => client.get('/ping').then((r) => r.data);
