import React, { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import PrimaryButton from '../components/PrimaryButton';
import Icon from '../components/Icon';
import { colors } from '../theme';
import { API_BASE, OFFLINE_MODE } from '../config';
import { getLesson, getUnit, submitAnswer, type LessonDetail, type UnitDetail } from '../api/study';
import { getLessonById, getQuizIdsByLessonId, getQuizMetaById, getQuizOrder } from '../data/lessons';
import { getUnitById } from '../data/units';
import { useI18n } from '../i18n';
import { getHearts, setHearts, getGems, setGems } from '../player';

type Step = 'quiz' | 'done' | 'out';
type ReturnMode = 'Lesson' | 'Path' | 'Back';

export default function UnitScreen({ route, navigation }: any) {
  const { t, lang } = useI18n();
  const unitId: string | undefined = route.params?.id;
  const returnTo: ReturnMode = route.params?.returnTo ?? 'Path';
  const [unit, setUnit] = useState<UnitDetail | null>(null);
  const [lesson, setLesson] = useState<LessonDetail | null>(null);
  const [offlineMode, setOfflineMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [step, setStep] = useState<Step>('quiz');
  const [choice, setChoice] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);
  const [busy, setBusy] = useState(false);
  const [heartsLeft, setHeartsLeft] = useState(5);

  const shakeAnimation = useMemo(() => new Animated.Value(0), []);
  const pulseAnimation = useMemo(() => new Animated.Value(1), []);

  const hint = useMemo(() => {
    if (!API_BASE.includes('10.0.2.2')) return '';
    return t('errors.realDeviceHint');
  }, [t]);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      setLoading(true);
      setError(null);
      setOfflineMode(OFFLINE_MODE);
      setStep('quiz');
      setChoice(null);
      setFeedback(null);
      setBusy(false);
      const hearts = await getHearts();
      if (cancelled) return;
      setHeartsLeft(hearts);
      try {
        if (!unitId) throw new Error('missing_unit_id');
        const data = await getUnit(unitId);
        const lessonData = await getLesson(data.lessonId);
        if (cancelled) return;
        setUnit(data);
        setLesson(lessonData);
      } catch (e: any) {
        const fallback = unitId ? getUnitById(lang, unitId) : null;
        const lessonFallback = fallback ? getLessonById(lang, fallback.lessonId) : null;
        if (fallback) {
          if (cancelled) return;
          setOfflineMode(true);
          setUnit({
            id: fallback.id,
            title: fallback.title,
            lessonId: fallback.lessonId,
            quiz: { question: fallback.quiz.question, choices: fallback.quiz.choices },
          });
          setLesson(
            lessonFallback
              ? {
                  id: lessonFallback.id,
                  title: lessonFallback.title,
                  learn: lessonFallback.learn,
                  quizIds: lessonFallback.quizIds,
                }
              : null,
          );
        } else {
          const detail = e?.response?.data?.detail;
          if (cancelled) return;
          const message =
            typeof detail === 'string'
              ? detail
              : e?.message === 'missing_unit_id'
                ? t('errors.missingUnitId')
                : e?.message || t('errors.loadUnitFailed');
          setError(message);
          setUnit(null);
          setLesson(null);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  }, [unitId, t, lang]);

  const resetQuiz = () => {
    setChoice(null);
    setFeedback(null);
  };

  const triggerShake = () => {
    shakeAnimation.setValue(0);
    Animated.timing(shakeAnimation, {
      toValue: 4,
      duration: 500,
      useNativeDriver: true,
    }).start();
  };

  const triggerPulse = () => {
    pulseAnimation.setValue(1);
    Animated.sequence([
      Animated.timing(pulseAnimation, {
        toValue: 1.2,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(pulseAnimation, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const check = async () => {
    if (!unit || choice === null) return;
    setBusy(true);
    setFeedback(null);
    try {
      const res = await submitAnswer(unit.id, choice, { offline: offlineMode });
      if (res.correct) {
        setFeedback('correct');
        triggerPulse();
      } else {
        setFeedback('incorrect');
        triggerShake();
        const newHearts = Math.max(0, heartsLeft - 1);
        setHeartsLeft(newHearts);
        await setHearts(newHearts);
      }
    } catch (e: any) {
      const detail = e?.response?.data?.detail;
      setError(typeof detail === 'string' ? detail : e?.message || t('errors.submitAnswerFailed'));
    } finally {
      setBusy(false);
    }
  };

  useEffect(() => {
    if (heartsLeft <= 0 && step === 'quiz') setStep('out');
  }, [heartsLeft, step]);

  const quizMeta = useMemo(() => (unit ? getQuizMetaById(unit.id) : null), [unit]);
  const lessonQuizIds = useMemo(
    () => (unit ? getQuizIdsByLessonId(unit.lessonId) : []),
    [unit],
  );

  const nextQuizInLesson = useMemo(() => {
    if (!unit || !lessonQuizIds.length) return null;
    const idx = lessonQuizIds.indexOf(unit.id);
    if (idx === -1) return null;
    return lessonQuizIds[idx + 1] ?? null;
  }, [unit, lessonQuizIds]);

  const nextQuizInPath = useMemo(() => {
    if (!unit) return null;
    const order = getQuizOrder();
    const idx = order.indexOf(unit.id);
    if (idx === -1) return null;
    return order[idx + 1] ?? null;
  }, [unit]);

  const nextQuizId =
    returnTo === 'Lesson' ? nextQuizInLesson : returnTo === 'Back' ? null : nextQuizInPath;

  const advance = async () => {
    if (busy) return;
    setBusy(true);
    try {
      const nextGems = (await getGems()) + 10;
      await setGems(nextGems);
    } finally {
      setBusy(false);
    }
    resetQuiz();
    if (nextQuizId) {
      navigation.replace('Unit', { id: nextQuizId, returnTo });
    } else {
      setStep('done');
    }
  };

  const goToLessons = () => {
    navigation.navigate('Main', { screen: 'Lessons' });
  };

  if (loading) {
    return (
      <View style={s.centerPage}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={s.muted}>{t('unit.loading')}</Text>
      </View>
    );
  }

  if (!unit) {
    return (
      <View style={s.centerPage}>
        <Text style={s.title}>{t('unit.errorTitle')}</Text>
        <Text style={s.muted}>
          {error || t('unit.cannotReachApi', { api: API_BASE, hint })}
        </Text>
        <PrimaryButton
          title={t('unit.goBack')}
          onPress={() => navigation.goBack()}
          style={{ marginTop: 14, width: 220 }}
        />
      </View>
    );
  }

  const summary = lesson?.learn.summary ?? [];

  const shake = shakeAnimation.interpolate({
    inputRange: [0, 1, 2, 3, 4],
    outputRange: [0, -10, 10, -10, 0],
  });

  const metaLabel = quizMeta
    ? t('home.bannerMeta', { section: quizMeta.lessonIndex, unit: quizMeta.quizIndex })
    : '';

  return (
    <SafeAreaView style={s.page} edges={['top']}>
      <ScrollView contentContainerStyle={s.content}>
        <View style={s.topRow}>
          <Pressable onPress={() => navigation.goBack()} style={s.backBtn}>
            <Icon name="chevron-left" size={26} color={colors.text} />
          </Pressable>
          <View style={s.hearts}>
            <Icon name="heart" size={18} color={colors.danger} />
            <Text style={s.heartsText}>{heartsLeft}</Text>
          </View>
        </View>

        {metaLabel ? <Text style={s.meta}>{metaLabel}</Text> : null}
        <Text style={s.title}>{lesson?.title ?? unit.title}</Text>
        {offlineMode ? <Text style={s.offline}>{t('unit.offline')}</Text> : null}

        {step === 'quiz' ? (
          <View style={s.card}>
            <Text style={s.lead}>{unit.quiz.question}</Text>
            <View style={s.options}>
              {unit.quiz.choices.map((c, i) => {
                const selected = choice === i;
                const correct = selected && feedback === 'correct';
                const incorrect = selected && feedback === 'incorrect';
                const animatedStyle = {
                  transform: [
                    { translateX: incorrect ? shake : 0 },
                    { scale: correct ? pulseAnimation : 1 },
                  ],
                };
                return (
                  <Animated.View key={i} style={animatedStyle}>
                    <Pressable
                      onPress={() => (busy ? null : setChoice(i))}
                      style={[
                        s.opt,
                        selected && s.selected,
                        correct && s.correct,
                        incorrect && s.incorrect,
                      ]}
                    >
                      <Text style={s.optText}>{c}</Text>
                      {selected ? (
                        <Icon
                          name={correct ? 'check' : 'close'}
                          size={20}
                          color={correct ? colors.success : colors.danger}
                        />
                      ) : null}
                    </Pressable>
                  </Animated.View>
                );
              })}
            </View>
            {error ? <Text style={s.error}>{error}</Text> : null}

            {feedback ? (
              <View style={[s.feedback, feedback === 'correct' ? s.feedbackOk : s.feedbackBad]}>
                <Icon
                  name={feedback === 'correct' ? 'check-circle-outline' : 'close-circle-outline'}
                  size={20}
                  color={feedback === 'correct' ? colors.success : colors.danger}
                />
                <Text style={s.feedbackText}>
                  {feedback === 'correct' ? t('unit.correct') : t('unit.incorrect')}
                </Text>
              </View>
            ) : null}

            {feedback === 'correct' ? (
              <PrimaryButton
                title={t('unit.continue')}
                onPress={advance}
                loading={busy}
                style={{ marginTop: 14 }}
              />
            ) : (
              <PrimaryButton
                title={
                  choice === null
                    ? t('unit.selectAnswer')
                    : feedback === 'incorrect'
                      ? t('unit.tryAgain')
                      : t('unit.check')
                }
                onPress={() => {
                  if (feedback === 'incorrect') resetQuiz();
                  else check();
                }}
                disabled={choice === null || busy}
                loading={busy}
                style={{ marginTop: 14 }}
              />
            )}
          </View>
        ) : null}

        {step === 'out' ? (
          <View style={s.card}>
            <Text style={s.lead}>{t('unit.outOfHearts')}</Text>
            <Text style={s.muted}>{t('unit.outOfHeartsHint')}</Text>
            <PrimaryButton
              title={t('unit.goBack')}
              onPress={() => navigation.goBack()}
              style={{ marginTop: 14 }}
            />
          </View>
        ) : null}

        {step === 'done' ? (
          <View style={s.card}>
            <Text style={s.lead}>{t('unit.complete')}</Text>
            {summary.length ? (
              <View style={[s.block, { marginTop: 10 }]}>
                <Text style={s.sectionTitle}>{t('unit.summary')}</Text>
                {summary.map((line, idx) => (
                  <View key={idx} style={s.bulletRow}>
                    <View style={s.bulletDot} />
                    <Text style={s.bulletText}>{line}</Text>
                  </View>
                ))}
              </View>
            ) : (
              <Text style={s.muted}>{t('unit.keepGoing')}</Text>
            )}
            <PrimaryButton
              title={
                returnTo === 'Lesson'
                  ? t('lesson.backToLessons')
                  : returnTo === 'Back'
                    ? t('unit.goBack')
                    : t('unit.backToPath')
              }
              onPress={() => {
                if (returnTo === 'Lesson') goToLessons();
                else navigation.goBack();
              }}
              style={{ marginTop: 14 }}
            />
          </View>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  page: { flex: 1, backgroundColor: colors.bg1 },
  content: { padding: 16, paddingBottom: 24 },
  centerPage: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 20, backgroundColor: colors.bg1 },
  muted: { color: colors.muted, marginTop: 10, textAlign: 'center', fontWeight: '700' },
  meta: { color: colors.primary, fontWeight: '900', fontSize: 12, letterSpacing: 0.8, textAlign: 'center' },
  title: { color: colors.text, fontSize: 22, fontWeight: '900', marginTop: 8, textAlign: 'center' },
  offline: { color: colors.muted, marginTop: 6, textAlign: 'center', fontWeight: '800', fontSize: 12 },

  topRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  hearts: {
    height: 40,
    paddingHorizontal: 12,
    borderRadius: 12,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  heartsText: { color: colors.text, fontWeight: '900' },

  card: {
    marginTop: 14,
    backgroundColor: colors.card,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 16,
    padding: 14,
  },
  lead: { color: colors.text, fontSize: 16, fontWeight: '800' },
  block: { marginTop: 12 },
  sectionTitle: { color: colors.muted, fontWeight: '900', letterSpacing: 0.8, fontSize: 12, marginBottom: 10 },
  bulletRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 10, marginBottom: 10 },
  bulletDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.primary, marginTop: 6 },
  bulletText: { color: colors.text, fontWeight: '700', flex: 1, lineHeight: 20 },
  options: { marginTop: 12, gap: 10 },
  opt: {
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.card2,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  selected: { borderColor: colors.primaryBorder },
  correct: { borderColor: colors.success, backgroundColor: '#0e2b22' },
  incorrect: { borderColor: colors.danger, backgroundColor: '#2b1418' },
  optText: { color: colors.text, fontWeight: '700', fontSize: 16, flex: 1 },
  error: { color: colors.danger, marginTop: 10, fontWeight: '800' },
  feedback: {
    marginTop: 12,
    borderRadius: 14,
    borderWidth: 1,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  feedbackOk: { borderColor: colors.success, backgroundColor: '#0e2b22' },
  feedbackBad: { borderColor: colors.danger, backgroundColor: '#2b1418' },
  feedbackText: { color: colors.text, fontWeight: '800', flex: 1 },
});
