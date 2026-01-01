import { NativeModules, Platform } from 'react-native';

const envBase = (process.env.EXPO_PUBLIC_API_BASE as string | undefined)?.trim();
const envOffline = (process.env.EXPO_PUBLIC_OFFLINE_MODE as string | undefined)?.trim();
const envOfflineName = (process.env.EXPO_PUBLIC_OFFLINE_USER_NAME as string | undefined)?.trim();
const envOfflineEmail = (process.env.EXPO_PUBLIC_OFFLINE_USER_EMAIL as string | undefined)?.trim();
const envOfflinePassword = (process.env.EXPO_PUBLIC_OFFLINE_USER_PASSWORD as string | undefined)?.trim();

const isTruthy = (value: string | undefined) => {
  if (!value) return false;
  return ['1', 'true', 'yes', 'on'].includes(value.toLowerCase());
};

const extractHost = (value: unknown): string | null => {
  if (typeof value !== 'string') return null;
  const v = value.trim();
  if (!v) return null;

  const withScheme = v.match(/^(?:https?|exp):\/\/([^:/]+)(?::\d+)?/);
  if (withScheme?.[1]) return withScheme[1];

  const hostPort = v.match(/^([^:/]+)(?::\d+)?$/);
  if (hostPort?.[1]) return hostPort[1];

  return null;
};

const getExpoDevHost = (): string | null => {
  const scriptURL = (NativeModules as any)?.SourceCode?.scriptURL;
  const fromScript = extractHost(scriptURL);
  if (fromScript) return fromScript;

  const exponent = (NativeModules as any)?.ExponentConstants;
  const manifestRaw = exponent?.manifest;
  let manifest: any = manifestRaw;
  if (typeof manifestRaw === 'string') {
    try {
      manifest = JSON.parse(manifestRaw);
    } catch {
      manifest = null;
    }
  }

  const debuggerHost =
    exponent?.debuggerHost ?? manifest?.debuggerHost ?? manifest?.extra?.expoClient?.debuggerHost;
  const fromDebugger = extractHost(debuggerHost);
  if (fromDebugger) return fromDebugger;

  const hostUri = exponent?.hostUri ?? manifest?.hostUri;
  const fromHostUri = extractHost(hostUri);
  if (fromHostUri) return fromHostUri;

  return null;
};

const detectedHost = getExpoDevHost();
const fallbackBase = Platform.OS === 'android' ? 'http://10.0.2.2:8000' : 'http://localhost:8000';
const autoBase = detectedHost ? `http://${detectedHost}:8000` : fallbackBase;

export const API_BASE = envBase || autoBase;
export const OFFLINE_MODE = isTruthy(envOffline);
export const OFFLINE_DEFAULT_USER = {
  name: envOfflineName || 'User1',
  email: envOfflineEmail || 'user1@example.com',
  password: envOfflinePassword || 'user1',
};
