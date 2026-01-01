export const LANGUAGE_OPTIONS = [
  { id: 'en', label: 'English' },
  { id: 'ru', label: 'Русский' },
  { id: 'tg', label: 'Тоҷикӣ' },
] as const;

export type Language = (typeof LANGUAGE_OPTIONS)[number]['id'];

export const DEFAULT_LANGUAGE: Language = 'en';

export const isLanguage = (value: string | null): value is Language => {
  return value === 'en' || value === 'ru' || value === 'tg';
};
