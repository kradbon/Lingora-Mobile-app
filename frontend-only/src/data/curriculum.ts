import type { Language } from '../i18n';
import { localizeString, type LocalizedString } from '../i18n/localize';
import { lessons, type LocalizedLesson } from './lessons';

const ls = (en: string, ru: string, tg: string): LocalizedString => ({ en, ru, tg });

export type LocalizedCurriculumUnit = {
  id: string;
  title: LocalizedString;
  description: LocalizedString;
  lessons: string[];
};

export type LocalizedCurriculumSection = {
  id: string;
  title: LocalizedString;
  units: LocalizedCurriculumUnit[];
};

export type CurriculumUnit = {
  id: string;
  title: string;
  description?: string | null;
  lessons: string[];
};

export type CurriculumSection = {
  id: string;
  title: string;
  units: CurriculumUnit[];
};

const lessonToUnit = (lesson: LocalizedLesson): LocalizedCurriculumUnit => ({
  id: lesson.id,
  title: lesson.title,
  description: lesson.learn.text,
  lessons: [...lesson.quizIds],
});

export const curriculum: { sections: LocalizedCurriculumSection[] } = {
  sections: [
    {
      id: 'section-1-html',
      title: ls('Section 1: HTML Foundations', 'Раздел 1: Основы HTML', 'Қисм 1: Асосҳои HTML'),
      units: lessons.slice(0, 5).map(lessonToUnit),
    },
    {
      id: 'section-2-css',
      title: ls('Section 2: CSS Styling & Layout', 'Раздел 2: Стиль и макет CSS', 'Қисм 2: Услуб ва макети CSS'),
      units: lessons.slice(5).map(lessonToUnit),
    },
  ],
};

export const getCurriculum = (lang: Language): { sections: CurriculumSection[] } => ({
  sections: curriculum.sections.map((section) => ({
    id: section.id,
    title: localizeString(section.title, lang),
    units: section.units.map((unit) => ({
      id: unit.id,
      title: localizeString(unit.title, lang),
      description: localizeString(unit.description, lang),
      lessons: [...unit.lessons],
    })),
  })),
});