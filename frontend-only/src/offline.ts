import AsyncStorage from '@react-native-async-storage/async-storage';
import { OFFLINE_DEFAULT_USER } from './config';

export type OfflineUser = {
  id: number;
  name: string;
  email: string;
  password: string;
  createdAt: string;
};

export type OfflineProgress = {
  unit_id: string;
  attempts: number;
  correct_answers: number;
  completed: boolean;
};

const USERS_KEY = 'lingora_offline_users';
const SESSION_KEY = 'lingora_offline_session';
const PROGRESS_KEY = 'lingora_offline_progress';

const normalizeEmail = (email: string) => email.trim().toLowerCase();

const parseJson = <T>(raw: string | null, fallback: T): T => {
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
};

export const getOfflineUsers = async (): Promise<OfflineUser[]> => {
  const raw = await AsyncStorage.getItem(USERS_KEY);
  const users = parseJson<OfflineUser[]>(raw, []);
  return Array.isArray(users) ? users : [];
};

export const saveOfflineUsers = async (users: OfflineUser[]) => {
  await AsyncStorage.setItem(USERS_KEY, JSON.stringify(users));
};

export const ensureOfflineSeedUser = async (): Promise<OfflineUser[]> => {
  const users = await getOfflineUsers();
  if (users.length) return users;

  const seed: OfflineUser = {
    id: 1,
    name: OFFLINE_DEFAULT_USER.name || 'User1',
    email: normalizeEmail(OFFLINE_DEFAULT_USER.email || 'user1@example.com'),
    password: OFFLINE_DEFAULT_USER.password || 'user1',
    createdAt: new Date().toISOString(),
  };

  const seeded = [seed];
  await saveOfflineUsers(seeded);
  return seeded;
};

export const setOfflineSessionEmail = async (email: string | null) => {
  if (!email) {
    await AsyncStorage.removeItem(SESSION_KEY);
    return;
  }
  await AsyncStorage.setItem(SESSION_KEY, normalizeEmail(email));
};

export const getOfflineSessionEmail = async (): Promise<string | null> => {
  const raw = await AsyncStorage.getItem(SESSION_KEY);
  return raw ? normalizeEmail(raw) : null;
};

export const clearOfflineSession = async () => {
  await AsyncStorage.removeItem(SESSION_KEY);
};

export const loginOffline = async (email: string, password: string): Promise<OfflineUser> => {
  const users = await ensureOfflineSeedUser();
  const normalized = normalizeEmail(email);
  const user = users.find((u) => normalizeEmail(u.email) === normalized);
  if (!user || user.password !== password) {
    throw new Error('Invalid credentials');
  }
  return user;
};

export const registerOffline = async (
  name: string,
  email: string,
  password: string,
): Promise<OfflineUser> => {
  const users = await ensureOfflineSeedUser();
  const normalized = normalizeEmail(email);
  if (users.some((u) => normalizeEmail(u.email) === normalized)) {
    throw new Error('Email already registered');
  }
  const nextId = users.reduce((max, u) => Math.max(max, u.id), 0) + 1;
  const user: OfflineUser = {
    id: nextId,
    name: name.trim(),
    email: normalized,
    password,
    createdAt: new Date().toISOString(),
  };
  const updated = [...users, user];
  await saveOfflineUsers(updated);
  return user;
};

export const getOfflineUserFromSession = async (): Promise<OfflineUser> => {
  const email = await getOfflineSessionEmail();
  if (!email) {
    throw new Error('Not authenticated');
  }
  const users = await ensureOfflineSeedUser();
  const user = users.find((u) => normalizeEmail(u.email) === normalizeEmail(email));
  if (!user) {
    throw new Error('User not found');
  }
  return user;
};

type ProgressMap = Record<string, OfflineProgress[]>;

const readProgressMap = async (): Promise<ProgressMap> => {
  const raw = await AsyncStorage.getItem(PROGRESS_KEY);
  const map = parseJson<ProgressMap>(raw, {});
  return map && typeof map === 'object' ? map : {};
};

const writeProgressMap = async (map: ProgressMap) => {
  await AsyncStorage.setItem(PROGRESS_KEY, JSON.stringify(map));
};

export const getOfflineProgress = async (email: string): Promise<OfflineProgress[]> => {
  const map = await readProgressMap();
  const key = normalizeEmail(email);
  return Array.isArray(map[key]) ? map[key] : [];
};

export const updateOfflineProgress = async (
  email: string,
  unitId: string,
  correct: boolean,
): Promise<OfflineProgress> => {
  const map = await readProgressMap();
  const key = normalizeEmail(email);
  const current = Array.isArray(map[key]) ? map[key] : [];
  const idx = current.findIndex((p) => p.unit_id === unitId);
  let next: OfflineProgress;
  if (idx >= 0) {
    const existing = current[idx];
    next = {
      unit_id: existing.unit_id,
      attempts: (existing.attempts || 0) + 1,
      correct_answers: correct ? (existing.correct_answers || 0) + 1 : existing.correct_answers || 0,
      completed: existing.completed || correct,
    };
    const updated = [...current];
    updated[idx] = next;
    map[key] = updated;
  } else {
    next = {
      unit_id: unitId,
      attempts: 1,
      correct_answers: correct ? 1 : 0,
      completed: correct,
    };
    map[key] = [...current, next];
  }
  await writeProgressMap(map);
  return next;
};
