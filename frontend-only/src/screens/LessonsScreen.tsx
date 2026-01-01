import React, { useCallback, useMemo, useState } from 'react';
import { ActivityIndicator, Pressable, SectionList, StyleSheet, Text, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import TopBar from '../components/TopBar';
import PrimaryButton from '../components/PrimaryButton';
import Icon from '../components/Icon';
import { colors } from '../theme';
import { getCurriculum, getProgress, type CurriculumSection, type UnitProgress } from '../api/study';
import { usePlayerStats } from '../hooks/usePlayerStats';
import { useI18n } from '../i18n';

export default function LessonsScreen({ navigation }: any) {
  const { t, lang } = useI18n();
  const { hearts, gems, refresh: refreshPlayerStats } = usePlayerStats();
  const [curriculum, setCurriculum] = useState<{ sections: CurriculumSection[] } | null>(null);
  const [progress, setProgress] = useState<UnitProgress[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setError(null);
    setLoading(true);
    try {
      await refreshPlayerStats();
      const [c, p] = await Promise.all([getCurriculum(), getProgress()]);
      setCurriculum(c);
      setProgress(p);
    } catch (e: any) {
      const detail = e?.response?.data?.detail;
      setError(typeof detail === 'string' ? detail : e?.message || t('errors.loadCurriculumFailed'));
      setCurriculum(null);
      setProgress([]);
    } finally {
      setLoading(false);
    }
  }, [t, refreshPlayerStats]);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load, lang]),
  );

  const progressById = useMemo(() => new Map(progress.map((p) => [p.unit_id, p])), [progress]);
  const sections = useMemo(
    () => (curriculum?.sections || []).map((section) => ({ ...section, data: section.units })),
    [curriculum],
  );
  const orderedLessons = useMemo(
    () => (curriculum?.sections || []).flatMap((section) => section.units),
    [curriculum],
  );
  const lessonIndexById = useMemo(
    () => new Map(orderedLessons.map((lesson, index) => [lesson.id, index])),
    [orderedLessons],
  );
  const lessonStatsById = useMemo(() => {
    const map = new Map<string, { completed: boolean; completedCount: number; total: number }>();
    for (const lesson of orderedLessons) {
      const quizIds = (lesson.lessons || []).map((quiz) => quiz.id);
      const completedCount = quizIds.filter((id) => progressById.get(id)?.completed).length;
      const total = quizIds.length;
      map.set(lesson.id, {
        completed: total > 0 && completedCount === total,
        completedCount,
        total,
      });
    }
    return map;
  }, [orderedLessons, progressById]);
  const nextLessonIndex = useMemo(() => {
    if (!orderedLessons.length) return 0;
    const idx = orderedLessons.findIndex((lesson) => !lessonStatsById.get(lesson.id)?.completed);
    return idx === -1 ? orderedLessons.length - 1 : idx;
  }, [orderedLessons, lessonStatsById]);

  const openLesson = (lessonId: string) => {
    const parent = navigation?.getParent?.();
    if (parent?.navigate) parent.navigate('Lesson', { id: lessonId });
    else navigation.navigate('Lesson', { id: lessonId });
  };

  return (
    <View style={s.page}>
      <TopBar streak={0} gems={gems} hearts={hearts} />

      <View style={s.header}>
        <Text style={s.h1}>{t('lessons.title')}</Text>
        <Text style={s.sub}>{t('lessons.subtitle')}</Text>
      </View>

      {loading ? (
        <View style={s.center}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={s.muted}>{t('common.loading')}</Text>
        </View>
      ) : error ? (
        <View style={s.center}>
          <Text style={s.errorTitle}>{t('lessons.errorTitle')}</Text>
          <Text style={s.muted}>{error}</Text>
          <PrimaryButton title={t('common.retry')} onPress={load} style={{ marginTop: 14, width: 220 }} />
        </View>
      ) : (
        <SectionList
          sections={sections}
          keyExtractor={(item) => item.id}
          contentContainerStyle={s.list}
          renderSectionHeader={({ section }) => (
            <View style={s.sectionHeaderWrap}>
              <Text style={s.sectionHeaderTitle}>{section.title}</Text>
            </View>
          )}
          renderItem={({ item: lesson }) => {
            const stats = lessonStatsById.get(lesson.id) || {
              completed: false,
              completedCount: 0,
              total: lesson.lessons?.length || 0,
            };
            const lessonIndex = lessonIndexById.get(lesson.id) ?? 0;
            const completed = stats.completed;
            const unlocked = lessonIndex <= nextLessonIndex;
            return (
              <Pressable
                onPress={() => (unlocked ? openLesson(lesson.id) : null)}
                style={[s.unitRow, !unlocked && s.unitRowLocked]}
              >
                <View style={s.unitIcon}>
                  <Icon
                    name={completed ? 'check-circle-outline' : unlocked ? 'book-open-outline' : 'lock-outline'}
                    size={18}
                    color={completed ? colors.success : unlocked ? colors.primary : colors.muted}
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={s.unitTitle}>{lesson.title}</Text>
                  <Text style={s.unitMeta}>
                    {t('lesson.progress', { done: stats.completedCount, total: stats.total })}
                  </Text>
                </View>
                {unlocked ? (
                  <Icon name="chevron-right" size={20} color={completed ? colors.success : colors.muted} />
                ) : (
                  <View style={{ width: 20 }} />
                )}
              </Pressable>
            );
          }}
          ListFooterComponent={<View style={{ height: 26 }} />}
        />
      )}
    </View>
  );
}

const s = StyleSheet.create({
  page: { flex: 1, backgroundColor: colors.bg1 },
  header: { paddingHorizontal: 16, paddingTop: 10, paddingBottom: 8 },
  h1: { color: colors.text, fontSize: 22, fontWeight: '900' },
  sub: { color: colors.muted, marginTop: 6, fontWeight: '600' },

  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 20 },
  muted: { color: colors.muted, marginTop: 10, textAlign: 'center', fontWeight: '700' },
  errorTitle: { color: colors.text, fontWeight: '900', fontSize: 18 },

  list: { paddingHorizontal: 16, paddingBottom: 24, paddingTop: 10 },

  sectionHeaderWrap: { paddingTop: 10, paddingBottom: 10 },
  sectionHeaderTitle: { color: colors.text, fontWeight: '900', fontSize: 20, marginTop: 6 },

  unitRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 14,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 10,
  },
  unitRowLocked: { opacity: 0.7 },
  unitIcon: {
    width: 34,
    height: 34,
    borderRadius: 12,
    backgroundColor: colors.card2,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  unitTitle: { color: colors.text, fontWeight: '900', marginTop: 4, fontSize: 14 },
  unitMeta: { color: colors.muted, marginTop: 4, fontWeight: '700', fontSize: 12 },
});
