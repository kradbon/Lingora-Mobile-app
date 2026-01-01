import React, { useCallback, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import TopBar from '../components/TopBar';
import PrimaryButton from '../components/PrimaryButton';
import { colors } from '../theme';
import { getCurriculum, getProgress, type Curriculum, type UnitProgress } from '../api/study';
import Icon from '../components/Icon';
import type { IconName } from '../components/Icon';
import { useI18n } from '../i18n';
import { usePlayerStats } from '../hooks/usePlayerStats';
import { QUIZZES_PER_LESSON } from '../data/lessons';

const pickNodeIcon = (quizIndex: number): IconName => {
  if (quizIndex === QUIZZES_PER_LESSON) return 'star';
  if (quizIndex % 2 === 0) return 'help';
  return 'code-tags';
};

export default function HomeScreen({ navigation }: any) {
  const { t, lang } = useI18n();
  const { hearts, gems, refresh: refreshPlayerStats } = usePlayerStats();
  const [curriculum, setCurriculum] = useState<Curriculum | null>(null);
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
      if (e.message === 'OFFLINE_MODE') {
        // In offline mode, we can still load the local curriculum and progress
        try {
          const [c, p] = await Promise.all([getCurriculum(), getProgress()]);
          setCurriculum(c);
          setProgress(p);
        } catch (e2: any) {
          const detail = e2?.response?.data?.detail;
          setError(typeof detail === 'string' ? detail : e2?.message || t('errors.loadPathFailed'));
        }
      } else {
        const detail = e?.response?.data?.detail;
        setError(typeof detail === 'string' ? detail : e?.message || t('errors.loadPathFailed'));
      }
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

  const flatQuizzes = useMemo(() => {
    if (!curriculum) return [];
    let globalIndex = 0;
    return curriculum.sections.flatMap((section) =>
      section.units.flatMap((unit) =>
        (unit.lessons ?? []).map((quiz) => {
          const quizId = quiz.id;
          const sectionNumber = Math.floor(globalIndex / QUIZZES_PER_LESSON) + 1;
          const unitNumber = (globalIndex % QUIZZES_PER_LESSON) + 1;
          const item = {
            id: quizId,
            unitTitle: unit.title,
            sectionNumber,
            unitNumber,
            isSectionStart: unitNumber === 1,
          };
          globalIndex += 1;
          return item;
        }),
      ),
    );
  }, [curriculum]);

  const nextQuizIndex = useMemo(() => {
    const idx = flatQuizzes.findIndex((q) => !progressById.get(q.id)?.completed);
    return idx === -1 ? Math.max(0, flatQuizzes.length - 1) : idx;
  }, [progressById, flatQuizzes]);

  const nextQuiz = flatQuizzes[nextQuizIndex];

  const openUnit = (unitId: string) => {
    const parent = navigation?.getParent?.();
    if (parent?.navigate) parent.navigate('Unit', { id: unitId, returnTo: 'Path' });
    else navigation.navigate('Unit', { id: unitId, returnTo: 'Path' });
  };

  const Banner = () => {
    if (!nextQuiz) return null;
    return (
      <View style={s.bannerWrap}>
        <Pressable style={s.banner} onPress={() => openUnit(nextQuiz.id)}>
          <View style={{ flex: 1 }}>
            <Text style={s.bannerMeta}>
              {t('home.bannerMeta', { section: nextQuiz.sectionNumber, unit: nextQuiz.unitNumber })}
            </Text>
            <Text style={s.bannerTitle}>{nextQuiz.unitTitle}</Text>
          </View>
          <Pressable
            accessibilityRole="button"
            onPress={() => navigation.navigate('Lessons')}
            style={s.bannerBtn}
          >
            <Icon name="view-list-outline" size={18} color={colors.text} />
          </Pressable>
        </Pressable>
      </View>
    );
  };

  return (
    <View style={s.page}>
      <TopBar streak={0} gems={gems} hearts={hearts} />

      {loading ? (
        <View style={s.center}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={s.muted}>{t('home.loadingPath')}</Text>
        </View>
      ) : error ? (
        <View style={s.center}>
          <Text style={s.errorTitle}>{t('home.errorTitle')}</Text>
          <Text style={s.muted}>{error}</Text>
          <PrimaryButton title={t('common.retry')} onPress={load} style={{ marginTop: 14, width: 220 }} />
        </View>
      ) : (
        <FlatList
          data={flatQuizzes}
          keyExtractor={(l) => l.id}
          ListHeaderComponent={<Banner />}
          contentContainerStyle={s.list}
          renderItem={({ item: quiz, index }) => {
            const p = progressById.get(quiz.id);
            const completed = Boolean(p?.completed);
            const unlocked = index <= nextQuizIndex;
            const active = index === nextQuizIndex;
            const offset = index % 2 === 0 ? -46 : 46;
            const status = completed
              ? t('home.status.done')
              : unlocked
                ? t('home.status.next')
                : t('home.status.locked');

            const baseBg = completed ? colors.success : active ? colors.primary : colors.warning;
            const bg = unlocked ? baseBg : colors.locked;
            const border = unlocked ? colors.border : colors.locked;
            const icon = pickNodeIcon(quiz.unitNumber || 1);

            return (
              <View style={s.nodeRow}>
                {quiz.isSectionStart ? (
                  <View style={s.sectionBreak}>
                    <Text style={s.sectionBreakText}>
                      {t('home.sectionTitle', { section: quiz.sectionNumber })}
                    </Text>
                  </View>
                ) : null}
                {index !== 0 ? (
                  <View style={[s.connector, { backgroundColor: unlocked ? colors.border : colors.locked }]} />
                ) : null}

                <Pressable
                  onPress={() => (unlocked ? openUnit(quiz.id) : null)}
                  style={[
                    s.node,
                    { backgroundColor: bg, borderColor: border, transform: [{ translateX: offset }] },
                  ]}
                >
                  <Icon name={icon} size={22} color={colors.bg0} />
                  {!unlocked ? (
                    <View style={s.lockBadge}>
                      <Icon name="lock-outline" size={14} color={colors.text} />
                    </View>
                  ) : null}
                </Pressable>

                <View style={[s.nodeLabelWrap, { transform: [{ translateX: offset }] }]}>
                  <Text style={s.nodeLabel}>
                    {t('home.nodeLabel', {
                      section: quiz.sectionNumber,
                      unit: quiz.unitNumber,
                      status,
                    })}
                  </Text>
                </View>
              </View>
            );
          }}
          ListFooterComponent={
            <View style={s.footer}>
              <Text style={s.footerTitle}>{t('home.moreComingTitle')}</Text>
              <Text style={s.muted}>{t('home.moreComingSub')}</Text>
            </View>
          }
        />
      )}
    </View>
  );
}

const s = StyleSheet.create({
  page: { flex: 1, backgroundColor: colors.bg1 },
  list: { paddingBottom: 24, paddingTop: 6 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 20 },
  muted: { color: colors.muted, marginTop: 10, textAlign: 'center' },
  errorTitle: { color: colors.text, fontWeight: '900', fontSize: 18 },

  bannerWrap: { paddingHorizontal: 16, paddingTop: 10, paddingBottom: 16 },
  banner: {
    backgroundColor: colors.card,
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderWidth: 1,
    borderColor: colors.primaryBorder,
  },
  bannerMeta: { color: colors.primary, fontWeight: '900', fontSize: 12, letterSpacing: 0.8 },
  bannerTitle: { color: colors.text, fontWeight: '900', fontSize: 18, marginTop: 2 },
  bannerBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: colors.card2,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },

  nodeRow: { alignItems: 'center', paddingVertical: 8 },
  sectionBreak: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 8,
  },
  sectionBreakText: { color: colors.text, fontWeight: '900', fontSize: 12, letterSpacing: 0.6 },
  connector: { width: 4, height: 22, borderRadius: 999 },
  node: {
    width: 66,
    height: 66,
    borderRadius: 33,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.18,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 6 },
    elevation: 4,
  },
  lockBadge: {
    position: 'absolute',
    right: -4,
    bottom: -4,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nodeLabelWrap: { marginTop: 8 },
  nodeLabel: { color: colors.muted, fontSize: 11, fontWeight: '800', letterSpacing: 0.6 },

  footer: { paddingHorizontal: 16, paddingTop: 18 },
  footerTitle: { color: colors.text, fontWeight: '900', fontSize: 14 },
});
