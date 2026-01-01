import AsyncStorage from '@react-native-async-storage/async-storage';
import { DEFAULT_LANGUAGE, isLanguage, type Language } from './types';

const STORAGE_KEY = 'lingora_language';

let currentLanguage: Language = DEFAULT_LANGUAGE;

export const getCurrentLanguage = (): Language => currentLanguage;

export const loadStoredLanguage = async (): Promise<Language> => {
  const raw = await AsyncStorage.getItem(STORAGE_KEY);
  if (isLanguage(raw)) {
    currentLanguage = raw;
  } else {
    currentLanguage = DEFAULT_LANGUAGE;
  }
  return currentLanguage;
};

export const storeLanguage = async (lang: Language): Promise<Language> => {
  currentLanguage = lang;
  await AsyncStorage.setItem(STORAGE_KEY, lang);
  return currentLanguage;
};
