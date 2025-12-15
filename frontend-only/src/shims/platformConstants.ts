// Fallback for missing PlatformConstants turbo module to prevent runtime crashes
import { NativeModules, Platform } from 'react-native';

const reactNativeVersion =
  (NativeModules as any).PlatformConstants?.reactNativeVersion ??
  (Platform as any).constants?.reactNativeVersion ?? {
    major: 0,
    minor: 0,
    patch: 0,
    prerelease: null,
  };

const existing = (NativeModules as any).PlatformConstants ?? (Platform as any).constants;
if (!existing) {
  const fallback = {
    forceTouchAvailable: false,
    interfaceIdiom: Platform.OS === 'ios' ? 'phone' : 'unknown',
    isTesting: false,
    osVersion: String(Platform.Version ?? ''),
    reactNativeVersion,
    systemName: Platform.OS === 'ios' ? 'iOS' : 'Android',
    uiMode: 'normal',
  } as const;

  (NativeModules as any).PlatformConstants = fallback;
  (Platform as any).constants = fallback;
}
