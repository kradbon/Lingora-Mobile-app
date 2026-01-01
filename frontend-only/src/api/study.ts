import { client } from './client';
import { OFFLINE_MODE } from '../config';
import { getCurriculum as getLocalCurriculum } from '../data/curriculum';
import { getLessonById, getLessons } from '../data/lessons';
import { getUnitById, getUnits } from '../data/units';
import { getCurrentLanguage } from '../i18n';
import { getOfflineSessionEmail, getOfflineProgress, updateOfflineProgress } from '../offline';

export type UnitSummary = { id: string; title: string };

export type CurriculumLesson = {
  id: string;
  title: string;
};

export type CurriculumUnit = {
  id: string;
  title: string;
  description?: string | null;
  lessons: CurriculumLesson[];
};

export type CurriculumSection = {
  id: string;
  title: string;
  units: CurriculumUnit[];
};

export type Curriculum = { sections: CurriculumSection[] };

export type UnitDetail = {
  id: string;
  title: string;
  lessonId: string;
  quiz: { question: string; choices: string[] };
};

export type LessonSummary = { id: string; title: string };

export type LessonDetail = {
  id: string;
  title: string;
  learn: { text: string; code?: string | null; details?: string[]; summary?: string[] };
  quizIds: string[];
};

export type UnitProgress = {
  unit_id: string;
  attempts: number;
  correct_answers: number;
  completed: boolean;
};

export type UnitAnswerResponse = {
  correct: boolean;
  progress: UnitProgress;
};

type SubmitOptions = { offline?: boolean };

const getLang = () => getCurrentLanguage();

const requireOfflineEmail = async () => {
  const email = await getOfflineSessionEmail();
  if (!email) {
    throw new Error('Not authenticated');
  }
  return email;
};

const listUnitsOffline = (): UnitSummary[] => {
  const lang = getLang();
  const localizedUnits = getUnits(lang);
  const unitById = new Map(localizedUnits.map((unit) => [unit.id, unit]));
  const curriculum = getLocalCurriculum(lang);
  const sections = Array.isArray((curriculum as any).sections) ? (curriculum as any).sections : [];
  const unitsFromSections = sections.flatMap((section: any) =>
    Array.isArray(section?.units) ? section.units : [],
  );
  const unitsFromRoot = Array.isArray((curriculum as any).units) ? (curriculum as any).units : [];
  const curriculumLessonIds = [...unitsFromSections, ...unitsFromRoot].flatMap((unit: any) => {
    if (!Array.isArray(unit?.lessons)) return [];
    return unit.lessons.map((lesson: any) => (typeof lesson === 'string' ? lesson : lesson?.id));
  });
  if (!curriculumLessonIds.length) {
    return localizedUnits.map((unit) => ({ id: unit.id, title: unit.title }));
  }
  const out: UnitSummary[] = [];
  const seen = new Set<string>();
  for (const lessonId of curriculumLessonIds) {
    const unit = unitById.get(lessonId);
    if (!unit || seen.has(unit.id)) continue;
    seen.add(unit.id);
    out.push({ id: unit.id, title: unit.title });
  }
  return out.length ? out : localizedUnits.map((unit) => ({ id: unit.id, title: unit.title }));
};

const listLessonsOffline = (): LessonSummary[] => {
  const lang = getLang();
  return getLessons(lang).map((lesson) => ({ id: lesson.id, title: lesson.title }));
};

const getUnitOffline = (unitId: string): UnitDetail => {
  const lang = getLang();
  const unit = getUnitById(lang, unitId);
  if (!unit) {
    throw new Error('Unit not found');
  }
  return {
    id: unit.id,
    title: unit.title,
    lessonId: unit.lessonId,
    quiz: { question: unit.quiz.question, choices: unit.quiz.choices },
  };
};

const getLessonOffline = (lessonId: string): LessonDetail => {
  const lang = getLang();
  const lesson = getLessonById(lang, lessonId);
  if (!lesson) {
    throw new Error('Lesson not found');
  }
  return {
    id: lesson.id,
    title: lesson.title,
    learn: lesson.learn,
    quizIds: lesson.quizIds,
  };
};

const getCurriculumOffline = (): Curriculum => {
  const lang = getLang();
  const curriculum = getLocalCurriculum(lang);
  const localizedUnits = getUnits(lang);
  const unitById = new Map(localizedUnits.map((unit) => [unit.id, unit]));
  return {
    sections: curriculum.sections.map((section) => ({
      id: section.id,
      title: section.title,
      units: section.units.map((unit) => ({
        id: unit.id,
        title: unit.title,
        description: unit.description ?? null,
        lessons: unit.lessons
          .map((lessonId) => {
            const lesson = unitById.get(lessonId);
            return lesson ? { id: lesson.id, title: lesson.title } : null;
          })
          .filter((lesson): lesson is UnitSummary => Boolean(lesson)),
      })),
    })),
  };
};

const getProgressOffline = async (): Promise<UnitProgress[]> => {
  const email = await requireOfflineEmail();
  return getOfflineProgress(email);
};

const submitAnswerOffline = async (unitId: string, answer: number): Promise<UnitAnswerResponse> => {
  const unit = getUnitById(getLang(), unitId);
  if (!unit) {
    throw new Error('Unit not found');
  }
  const correct = answer === unit.quiz.answer;
  const email = await requireOfflineEmail();
  const progress = await updateOfflineProgress(email, unitId, correct);
  return { correct, progress };
};

export const listUnits = async () => {
  return listUnitsOffline();
};

export const getCurriculum = async () => {
  return getCurriculumOffline();
};

export const getUnit = async (unitId: string) => {
  return getUnitOffline(unitId);
};

export const listLessons = async () => {
  return listLessonsOffline();
};

export const getLesson = async (lessonId: string) => {
  return getLessonOffline(lessonId);
};

export const getProgress = async () => {
  if (OFFLINE_MODE) return getProgressOffline();
  return client.get<UnitProgress[]>('/api/progress').then((r) => r.data);
};

export const submitAnswer = async (unitId: string, answer: number, options?: SubmitOptions) => {
  if (OFFLINE_MODE || options?.offline) return submitAnswerOffline(unitId, answer);
  return client
    .post<UnitAnswerResponse>(`/api/units/${encodeURIComponent(unitId)}/answer`, { answer })
    .then((r) => r.data);
};
