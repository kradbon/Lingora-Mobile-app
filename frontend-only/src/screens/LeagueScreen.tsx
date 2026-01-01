import React, { useCallback, useMemo, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View, FlatList } from 'react-native';
import { colors } from '../theme';
import PrimaryButton from '../components/PrimaryButton';
import TopBar from '../components/TopBar';
import { useFocusEffect } from '@react-navigation/native';
import { getProgress, listUnits, type UnitProgress, type UnitSummary } from '../api/study';
import Icon from '../components/Icon';
import { usePlayerStats } from '../hooks/usePlayerStats';
import { useI18n } from '../i18n';

const FAKE_USERS = [
  { name: 'CSS_Ninja', xp: 2200 },
  { name: 'HTML_Hero', xp: 1950 },
  { name: 'WebMaster', xp: 1800 },
  { name: 'FlexboxPro', xp: 1600 },
  { name: 'GridGuru', xp: 1450 },
  { name: 'PixelPerfect', xp: 1300 },
  { name: 'TagTitan', xp: 1150 },
  { name: 'StyleSavant', xp: 1000 },
  { name: 'DivDrifter', xp: 900 },
  { name: 'MarkupMaster', xp: 800 },
  { name: 'FrontEndFan', xp: 720 },
  { name: 'CodeCrafter', xp: 650 },
  { name: 'WebWeaver', xp: 550 },
  { name: 'LayoutLegend', xp: 480 },
  { name: 'ScreenStyler', xp: 400 },
  { name: 'DomDominator', xp: 320 },
  { name: 'SelectorSam', xp: 250 },
  { name: 'HexHacker', xp: 180 },
  { name: 'PaddingPal', xp: 120 },
  { name: 'MarginMate', xp: 80 },
  { name: 'NewbieDev', xp: 40 },
  { name: 'HelloWorld', xp: 10 },
];

const LEAGUES = [
  { key: 'bronze', min: 0, max: 199, color: '#CD7F32' },
  { key: 'silver', min: 200, max: 499, color: '#C0C0C0' },
  { key: 'gold', min: 500, max: 999, color: colors.warning },
  { key: 'platinum', min: 1000, max: 1499, color: '#a5b4fc' },
  { key: 'diamond', min: 1500, max: 2199, color: '#38bdf8' },
  { key: 'legend', min: 2200, max: 99999, color: '#f59e0b' },
];

const pickLeague = (xp: number) => {
  const idx = LEAGUES.findIndex((league) => xp <= league.max);
  const safeIdx = idx === -1 ? LEAGUES.length - 1 : idx;
  return { league: LEAGUES[safeIdx], index: safeIdx };
};

const buildLeagueUsers = (league: { min: number; max: number }) => {
  const span = Math.max(1, league.max - league.min);
  const step = Math.max(5, Math.floor(span / (FAKE_NAMES.length + 2)));
  return FAKE_NAMES.map((name, idx) => ({
    name,
    xp: Math.max(league.min, league.max - step * (idx + 1)),
  }));
};

export default function LeagueScreen({ navigation }: any) {
  const { t } = useI18n();
  const { gems, hearts } = usePlayerStats();
  const [units, setUnits] = useState<UnitSummary[]>([]);
  const [progress, setProgress] = useState<UnitProgress[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [u, p] = await Promise.all([listUnits(), getProgress()]);
      setUnits(u);
      setProgress(p);
    } catch {
      setUnits([]);
      setProgress([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load]),
  );

  const progressById = useMemo(() => new Map(progress.map((p) => [p.unit_id, p])), [progress]);
  const completedCount = useMemo(
    () => units.filter((u) => progressById.get(u.id)?.completed).length,
    [progressById, units],
  );

  // Each completed unit gives 10 XP
  const xp = completedCount * 10;

  const { league: activeLeague, index: leagueIndex } = pickLeague(xp);
  const leagueName = t(`league.${activeLeague.key}`);
  const nextLeague = LEAGUES[leagueIndex + 1];
  const progressPct = nextLeague
    ? Math.min(1, Math.max(0, (xp - activeLeague.min) / Math.max(1, activeLeague.max - activeLeague.min)))
    : 1;

  const fakeUsers = useMemo(() => buildLeagueUsers(activeLeague), [activeLeague]);

  const leaderboard = useMemo(() => {
    const you = { name: t('league.you') || 'You', xp, isYou: true };
    // Combine with fake users and sort
    return [...fakeUsers, you]
      .sort((a, b) => b.xp - a.xp)
      .slice(0, 50); // Top 50
  }, [fakeUsers, xp, t]);

  const rank = useMemo(() => {
    const idx = leaderboard.findIndex((item) => item.isYou);
    return idx === -1 ? leaderboard.length : idx + 1;
  }, [leaderboard]);

  return (
    <View style={s.page}>
      <TopBar streak={0} gems={gems} hearts={hearts} />

      <View style={s.body}>
        {loading ? (
          <View style={{ alignItems: 'center', marginBottom: 18 }}>
            <ActivityIndicator size="large" color={colors.primary} />
          </View>
        ) : null}

        <View style={s.trophyWrap}>
          <View style={[s.trophyPuck, { backgroundColor: activeLeague.color }]}>
            <Icon name="trophy-outline" size={40} color={colors.bg0} />
          </View>
        </View>

        <Text style={s.title}>{t('league.title', { league: leagueName })}</Text>
        <Text style={s.subtitle}>{t('league.subtitle', { xp })}</Text>
        <Text style={s.rank}>{t('league.rank', { rank, total: leaderboard.length })}</Text>

        <View style={s.progressCard}>
          <View style={s.progressHeader}>
            <Text style={s.progressRank}>{leagueName}</Text>
            <Text style={s.progressXp}>{xp} XP</Text>
          </View>
          <View style={s.progressBar}>
            <View style={[s.progressFill, { width: `${Math.round(progressPct * 100)}%`, backgroundColor: activeLeague.color }]} />
          </View>
          <Text style={s.progressMeta}>
            {nextLeague
              ? t('league.nextLeague', { league: t(`league.${nextLeague.key}`), xp: nextLeague.min })
              : t('league.maxed')}
          </Text>
        </View>

        <View style={s.leaderboard}>
          <FlatList
            data={leaderboard}
            keyExtractor={(item) => item.name}
            renderItem={({ item, index }) => (
              <View
                style={[s.leaderboardRow, item.isYou && s.leaderboardRowYou]}
              >
                <Text style={s.leaderboardRank}>{index + 1}</Text>
                <Text style={s.leaderboardName}>{item.name}</Text>
                <Text style={s.leaderboardXp}>{item.xp} XP</Text>
              </View>
            )}
            style={{ maxHeight: 400 }}
          />
        </View>

        <PrimaryButton
          title={t('league.continue')}
          onPress={() => navigation.navigate('Home')}
          style={{ marginTop: 12 }}
        />
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  page: { flex: 1, backgroundColor: colors.bg1 },
  body: { flex: 1, padding: 18 },
  trophyWrap: { alignItems: 'center', justifyContent: 'center', marginBottom: 18 },
  trophyPuck: {
    width: 94,
    height: 94,
    borderRadius: 47,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.card,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: { color: colors.text, fontWeight: '900', fontSize: 22, textAlign: 'center' },
  subtitle: { color: colors.muted, fontWeight: '700', marginTop: 8, textAlign: 'center' },
  rank: { color: colors.text, fontWeight: '800', marginTop: 6, textAlign: 'center' },
  progressCard: {
    marginTop: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.card,
    padding: 14,
  },
  progressHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  progressRank: { color: colors.text, fontWeight: '800' },
  progressXp: { color: colors.primary, fontWeight: '900' },
  progressBar: {
    marginTop: 10,
    height: 10,
    borderRadius: 999,
    backgroundColor: colors.card2,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  progressFill: { height: '100%', borderRadius: 999 },
  progressMeta: { marginTop: 8, color: colors.muted, fontWeight: '700' },
  leaderboard: {
    width: '100%',
    marginTop: 18,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.card,
    padding: 14,
  },
  leaderboardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  leaderboardRowYou: {
    backgroundColor: colors.card2,
  },
  leaderboardRank: {
    color: colors.text,
    fontWeight: '900',
    fontSize: 16,
    width: 40,
    textAlign: 'center',
  },
  leaderboardName: {
    color: colors.text,
    fontWeight: '700',
    fontSize: 16,
    flex: 1,
  },
  leaderboardXp: {
    color: colors.primary,
    fontWeight: '900',
    fontSize: 16,
  },
});
