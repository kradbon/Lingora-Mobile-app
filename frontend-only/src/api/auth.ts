import { client } from './client';
import { OFFLINE_MODE } from '../config';
import {
  getOfflineUserFromSession,
  loginOffline,
  registerOffline,
  setOfflineSessionEmail,
} from '../offline';

type TokenResponse = { token: string; user: { id: number; name: string; email: string } };

const toTokenResponse = (user: { id: number; name: string; email: string }): TokenResponse => ({
  token: `offline:${user.id}`,
  user: { id: user.id, name: user.name, email: user.email },
});

export const loginMobile = async (body: { email: string; password: string }) => {
  if (!OFFLINE_MODE) {
    return client.post('/auth/login-mobile', body).then((r) => r.data);
  }
  const user = await loginOffline(body.email, body.password);
  await setOfflineSessionEmail(user.email);
  return toTokenResponse(user);
};

export const register = async (body: { name: string; email: string; password: string }) => {
  if (!OFFLINE_MODE) {
    return client.post('/auth/register', body).then((r) => r.data);
  }
  const user = await registerOffline(body.name, body.email, body.password);
  await setOfflineSessionEmail(user.email);
  return toTokenResponse(user);
};

export const me = async () => {
  if (!OFFLINE_MODE) {
    return client.get('/auth/me').then((r) => r.data);
  }
  const user = await getOfflineUserFromSession();
  return { id: user.id, name: user.name, email: user.email };
};

export const ping = async () => {
  if (!OFFLINE_MODE) {
    return client.get('/ping').then((r) => r.data);
  }
  return { ok: true, service: 'lingora-api (offline)' };
};
