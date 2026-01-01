import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { loginMobile as loginApi, me as meApi, register as registerApi } from '../api/auth';
import { clearOfflineSession } from '../offline';

type User = { name: string; email: string } | null;
type AuthCtx = {
  user: User;
  loading: boolean;
  login(email: string, password: string): Promise<void>;
  register(name: string, email: string, password: string): Promise<void>;
  logout(): Promise<void>;
  refreshMe(): Promise<void>;
};

const Ctx = createContext<AuthCtx | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User>(null);
  const [loading, setLoading] = useState(true);

  const refreshMe = async () => {
    try {
      const data = await meApi();
      setUser({ name: data.name, email: data.email });
    } catch {
      await AsyncStorage.removeItem('lingora_auth_token');
      await clearOfflineSession();
      setUser(null);
    }
  };

  const bootstrap = async () => {
    setLoading(true);
    await refreshMe();
    setLoading(false);
  };

  useEffect(() => {
    bootstrap();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const res = await loginApi({ email, password });
      await AsyncStorage.setItem('lingora_auth_token', res.token);
      const data = await meApi();
      setUser({ name: data.name, email: data.email });
    } catch (e) {
      await AsyncStorage.removeItem('lingora_auth_token');
      await clearOfflineSession();
      throw e;
    }
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      const res = await registerApi({ name, email, password });
      await AsyncStorage.setItem('lingora_auth_token', res.token);
      const data = await meApi();
      setUser({ name: data.name, email: data.email });
    } catch (e) {
      await AsyncStorage.removeItem('lingora_auth_token');
      await clearOfflineSession();
      throw e;
    }
  };

  const logout = async () => {
    await AsyncStorage.removeItem('lingora_auth_token');
    await clearOfflineSession();
    setUser(null);
  };

  return (
    <Ctx.Provider value={{ user, loading, login, register, logout, refreshMe }}>
      {children}
    </Ctx.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useAuth outside provider');
  return ctx;
};
