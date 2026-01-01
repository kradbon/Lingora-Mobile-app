import React, { useCallback, useMemo, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import TopBar from '../components/TopBar';
import PrimaryButton from '../components/PrimaryButton';
import Icon from '../components/Icon';
import { colors } from '../theme';
import { getLesson, getProgress, type LessonDetail, type UnitProgress } from '../api/study';
import { usePlayerStats } from '../hooks/usePlayerStats';
import { useI18n } from '../i18n';

export default function LessonScreen({ navigation, route }: any) {
  const { t, lang } = useI18n();
  const { hearts, gems, refresh: refreshPlayerStats } = usePlayerStats();
  const lessonId: string | undefined = route.params?.id;
  const [lesson, setLesson] = useState<LessonDetail | null>(null);
  const [progress, setProgress] = useState<UnitProgress[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAllDetails, setShowAllDetails] = useState(false);

  const load = useCallback(async () => {
    setError(null);
    setLoading(true);
    try {
      await refreshPlayerStats();
      if (!lessonId) throw new Error('missing_lesson_id');
      const [l, p] = await Promise.all([getLesson(lessonId), getProgress()]);
      setLesson(l);
      setProgress(p);
    } catch (e: any) {
      const detail = e?.response?.data?.detail;
      const message =
        typeof detail === 'string'
          ? detail
          : e?.message === 'missing_lesson_id'
            ? t('errors.missingUnitId')
            : e?.message || t('errors.loadCurriculumFailed');
      setError(message);
      setLesson(null);
      setProgress([]);
    } finally {
      setLoading(false);
    }
  }, [lessonId, refreshPlayerStats, t]);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load, lang]),
  );

  const progressById = useMemo(() => new Map(progress.map((p) => [p.unit_id, p])), [progress]);
  const quizTotal = lesson?.quizIds.length ?? 0;
  const completedCount = useMemo(() => {
    if (!lesson) return 0;
    return lesson.quizIds.filter((id) => progressById.get(id)?.completed).length;
  }, [lesson, progressById]);

  const details = lesson?.learn.details ?? [];
  const visibleDetails = showAllDetails ? details : details.slice(0, 5);

  const startQuizzes = () => {
    if (!lesson?.quizIds.length) return;
    navigation.navigate('Unit', { id: lesson.quizIds[0], returnTo: 'Lesson' });
  };

  return (
    <View style={s.page}>
      <TopBar streak={0} gems={gems} hearts={hearts} />

      {loading ? (
        <View style={s.center}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={s.muted}>{t('lesson.loading')}</Text>
        </View>
      ) : error || !lesson ? (
        <View style={s.center}>
          <Text style={s.errorTitle}>{t('lessons.errorTitle')}</Text>
          <Text style={s.muted}>{error}</Text>
          <PrimaryButton title={t('common.retry')} onPress={load} style={{ marginTop: 14, width: 220 }} />
        </View>
      ) : (
        <ScrollView contentContainerStyle={s.content}>
          <Pressable onPress={() => navigation.goBack()} style={s.backBtn}>
            <Icon name="chevron-left" size={24} color={colors.text} />
          </Pressable>

          <Text style={s.title}>{lesson.title}</Text>
          <Text style={s.meta}>{t('lesson.quizCount', { count: quizTotal })}</Text>
          <Text style={s.progress}>{t('lesson.progress', { done: completedCount, total: quizTotal })}</Text>

          <View style={s.card}>
            <Text style={s.lead}>{lesson.learn.text}</Text>
            {lesson.learn.code ? <Text style={s.code}>{lesson.learn.code}</Text> : null}

            {details.length ? (
              <View style={s.block}>
                <Text style={s.sectionTitle}>{t('unit.details')}</Text>
                {visibleDetails.map((line, idx) => (
                  <View key={idx} style={s.bulletRow}>
                    <View style={s.bulletDot} />
                    <Text style={s.bulletText}>{line}</Text>
                  </View>
                ))}
                {details.length > 3 ? (
                  <Pressable onPress={() => setShowAllDetails((v) => !v)} style={s.moreBtn}>
                    <Text style={s.moreText}>
                      {showAllDetails ? t('unit.showLess') : t('unit.showMore')}
                    </Text>
                  </Pressable>
                ) : null}
              </View>
            ) : null}
          </View>

          <PrimaryButton
            title={t('lesson.startQuizzes')}
            onPress={startQuizzes}
            disabled={!lesson.quizIds.length}
            style={{ marginTop: 14 }}
          />
        </ScrollView>
      )}
    </View>
  );
}

const s = StyleSheet.create({
  page: { flex: 1, backgroundColor: colors.bg1 },
  content: { paddingHorizontal: 16, paddingBottom: 24 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 20 },
  muted: { color: colors.muted, marginTop: 10, textAlign: 'center', fontWeight: '700' },
  errorTitle: { color: colors.text, fontWeight: '900', fontSize: 18 },

  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
  },
  title: { color: colors.text, fontSize: 22, fontWeight: '900', marginTop: 12 },
  meta: { color: colors.muted, marginTop: 6, fontWeight: '700' },
  progress: { color: colors.primary, marginTop: 4, fontWeight: '800' },

  card: {
    marginTop: 14,
    backgroundColor: colors.card,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 16,
    padding: 14,
  },
  lead: { color: colors.text, fontSize: 16, fontWeight: '800' },
  code: {
    marginTop: 12,
    backgroundColor: colors.card2,
    borderRadius: 12,
    padding: 12,
    color: '#a7f3d0',
    borderWidth: 1,
    borderColor: colors.border,
    fontFamily: 'monospace',
  },
  block: { marginTop: 12 },
  sectionTitle: { color: colors.muted, fontWeight: '900', letterSpacing: 0.8, fontSize: 12, marginBottom: 10 },
  bulletRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 10, marginBottom: 10 },
  bulletDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.primary, marginTop: 6 },
  bulletText: { color: colors.text, fontWeight: '700', flex: 1, lineHeight: 20 },
  moreBtn: { marginTop: 2, alignSelf: 'flex-start' },
  moreText: { color: colors.primary, fontWeight: '900', letterSpacing: 0.2 },
});
