import React, { useCallback, useMemo, useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import TopBar from '../components/TopBar';
import PrimaryButton from '../components/PrimaryButton';
import { colors } from '../theme';
import { getProgress, listUnits, type UnitProgress, type UnitSummary } from '../api/study';
import Icon from '../components/Icon';
import { usePlayerStats } from '../hooks/usePlayerStats';
import { useI18n } from '../i18n';

export default function PracticeScreen({ navigation }: any) {
  const { t, lang } = useI18n();
  const { hearts, gems, refresh: refreshPlayerStats } = usePlayerStats();
  const [units, setUnits] = useState<UnitSummary[]>([]);
  const [progress, setProgress] = useState<UnitProgress[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setError(null);
    setLoading(true);
    try {
      await refreshPlayerStats();
      const [u, p] = await Promise.all([listUnits(), getProgress()]);
      setUnits(u);
      setProgress(p);
    } catch (e: any) {
      const detail = e?.response?.data?.detail;
      setError(typeof detail === 'string' ? detail : e?.message || t('errors.loadPracticeFailed'));
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
  const completed = useMemo(() => units.filter((u) => progressById.get(u.id)?.completed), [progressById, units]);
  const mistakes = useMemo(
    () =>
      units.filter((u) => {
        const p = progressById.get(u.id);
        return p && !p.completed && (p.attempts || 0) > 0;
      }),
    [progressById, units],
  );

  const openUnit = (unitId: string) => {
    const parent = navigation?.getParent?.();
    if (parent?.navigate) parent.navigate('Unit', { id: unitId, returnTo: 'Back' });
    else navigation.navigate('Unit', { id: unitId, returnTo: 'Back' });
  };

  const practiceRandom = () => {
    if (!completed.length) return;
    const pick = completed[Math.floor(Math.random() * completed.length)];
    openUnit(pick.id);
  };

  const practiceMistake = () => {
    if (!mistakes.length) return;
    const pick = mistakes[Math.floor(Math.random() * mistakes.length)];
    openUnit(pick.id);
  };

  return (
    <View style={s.page}>
      <TopBar streak={0} gems={gems} hearts={hearts} />

      <View style={s.hero}>
        <View style={s.heroIcon}>
          <Icon name="target" size={20} color={colors.primary} />
        </View>
        <Text style={s.h1}>{t('practice.title')}</Text>
        <Text style={s.sub}>{t('practice.subtitle')}</Text>
      </View>

      {loading ? (
        <View style={s.center}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={s.muted}>{t('common.loading')}</Text>
        </View>
      ) : error ? (
        <View style={s.center}>
          <Text style={s.errorTitle}>{t('practice.errorTitle')}</Text>
          <Text style={s.muted}>{error}</Text>
          <PrimaryButton title={t('common.retry')} onPress={load} style={{ marginTop: 14, width: 220 }} />
        </View>
      ) : (
        <View style={s.body}>
          <View style={s.card}>
            <Text style={s.cardTitle}>{t('practice.mistakesTitle')}</Text>
            <Text style={s.cardSub}>
              {t('practice.mistakesSub')}{' '}
              <Text style={s.cardStrong}>{mistakes.length}</Text>
            </Text>
            <PrimaryButton
              title={mistakes.length ? t('practice.mistakesAction') : t('practice.mistakesEmpty')}
              onPress={practiceMistake}
              disabled={!mistakes.length}
              style={{ marginTop: 12 }}
            />
          </View>

          <View style={s.card}>
            <Text style={s.cardTitle}>{t('practice.reviewTitle')}</Text>
            <Text style={s.cardSub}>
              {t('practice.reviewSub')}{' '}
              <Text style={s.cardStrong}>{completed.length}</Text>
            </Text>
            <PrimaryButton
              title={completed.length ? t('practice.reviewAction') : t('practice.reviewEmpty')}
              onPress={practiceRandom}
              disabled={!completed.length}
              style={{ marginTop: 12 }}
            />
          </View>

          <Pressable style={s.tip} onPress={() => navigation.navigate('Home')}>
            <Icon name="information-outline" size={18} color={colors.primary} />
            <Text style={s.tipText}>{t('practice.tip')}</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}

const s = StyleSheet.create({
  page: { flex: 1, backgroundColor: colors.bg1 },
  hero: { paddingHorizontal: 16, paddingTop: 12, paddingBottom: 6 },
  heroIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.primaryBorder,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  h1: { color: colors.text, fontSize: 22, fontWeight: '900' },
  sub: { color: colors.muted, marginTop: 6, fontWeight: '600' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 20 },
  muted: { color: colors.muted, marginTop: 10, textAlign: 'center' },
  errorTitle: { color: colors.text, fontWeight: '900', fontSize: 18 },
  body: { paddingHorizontal: 16, paddingTop: 12 },
  card: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.card,
    padding: 14,
    marginBottom: 12,
  },
  cardTitle: { color: colors.text, fontWeight: '900', fontSize: 16 },
  cardSub: { color: colors.muted, marginTop: 6, fontWeight: '700' },
  cardStrong: { color: colors.text, fontWeight: '900' },
  tip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.card2,
    padding: 12,
    marginTop: 4,
  },
  tipText: { color: colors.muted, fontWeight: '700', flex: 1 },
});
