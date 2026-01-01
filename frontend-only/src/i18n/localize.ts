import type { Language } from './types';

export type LocalizedString = {
  en: string;
  ru: string;
  tg: string;
};

export const localizeString = (value: LocalizedString, lang: Language): string => {
  if (lang === 'ru') return value.ru || value.en;
  if (lang === 'tg') return value.tg || value.en;
  return value.en;
};
