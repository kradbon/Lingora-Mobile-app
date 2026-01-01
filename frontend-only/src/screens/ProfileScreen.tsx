import React, { useCallback, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { colors } from '../theme';
import TopBar from '../components/TopBar';
import PrimaryButton from '../components/PrimaryButton';
import { useAuth } from '../context/AuthProvider';
import { getProgress, listUnits, type UnitProgress, type UnitSummary } from '../api/study';
import { API_BASE } from '../config';
import { ping } from '../api/auth';
import Icon from '../components/Icon';
import { usePlayerStats } from '../hooks/usePlayerStats';
import { LANGUAGE_OPTIONS, useI18n } from '../i18n';

const initials = (name: string) =>
  name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .filter(Boolean)
    .join('');

const colorFromText = (text: string): string => {
  const colorPalette = ['#ef4444', '#f97316', '#eab308', '#84cc16', '#22c55e', '#14b8a6', '#06b6d4', '#3b82f6', '#8b5cf6', '#d946ef', '#f43f5e'];
  if (!text) return colorPalette[0];
  let hash = 0;
  for (let i = 0; i < text.length; i++) {
    hash = text.charCodeAt(i) + ((hash << 5) - hash);
    hash |= 0; 
  }
  return colorPalette[Math.abs(hash) % colorPalette.length];
};

export default function ProfileScreen() {
  const { t, lang, setLang } = useI18n();
  const { user, refreshMe, logout } = useAuth();
  const { hearts, gems, refresh: refreshPlayerStats } = usePlayerStats();
  const [menuOpen, setMenuOpen] = useState(false);
  const [units, setUnits] = useState<UnitSummary[]>([]);
  const [progress, setProgress] = useState<UnitProgress[]>([]);
  const [loading, setLoading] = useState(true);
  const [pingText, setPingText] = useState('');
  const [busyPing, setBusyPing] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      await refreshPlayerStats();
      const [u, p] = await Promise.all([listUnits(), getProgress()]);
      setUnits(u);
      setProgress(p);
    } catch {
      setUnits([]);
      setProgress([]);
    } finally {
      setLoading(false);
    }
  }, [refreshPlayerStats]);

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

  const xp = completedCount * 10;
  const league =
    xp >= 500 ? t('league.gold') : xp >= 200 ? t('league.silver') : t('league.bronze');
  const avatarColor = useMemo(() => colorFromText(user?.name || 'PHP'), [user?.name]);

  const doPing = async () => {
    setBusyPing(true);
    setPingText(t('profile.testing'));
    try {
      await ping();
      setPingText(t('profile.okStatus'));
    } catch (e: any) {
      if (!e?.response) {
        const hint = API_BASE.includes('10.0.2.2')
          ? t('errors.realDeviceHint')
          : '';
        setPingText(t('errors.cannotReachApi', { api: API_BASE, hint }));
      } else {
        const detail = e?.response?.data?.detail;
        setPingText(typeof detail === 'string' ? detail : t('errors.pingFailed'));
      }
    }
    setBusyPing(false);
  };

  return (
    <View style={s.page}>
      <TopBar streak={0} gems={gems} hearts={hearts} />

      <ScrollView contentContainerStyle={s.body}>
        <View style={s.profileTop}>
          <View style={[s.avatar, { backgroundColor: avatarColor }]}>
            <Text style={s.avatarText}>{user?.name ? initials(user.name) : 'P'}</Text>
          </View>
          <Pressable style={s.gear} onPress={() => setMenuOpen(true)}>
            <Icon name="cog-outline" size={22} color={colors.text} />
          </Pressable>
        </View>

        <Text style={s.name}>{user?.name || t('profile.defaultName')}</Text>
        <Text style={s.handle}>{user?.email || t('profile.notSignedIn')}</Text>

        <View style={s.row3}>
          <View style={s.miniStat}>
            <Text style={s.miniNumber}>{units.length}</Text>
            <Text style={s.miniLabel}>{t('profile.units')}</Text>
          </View>
          <View style={s.miniStat}>
            <Text style={s.miniNumber}>{completedCount}</Text>
            <Text style={s.miniLabel}>{t('profile.done')}</Text>
          </View>
          <View style={s.miniStat}>
            <Text style={s.miniNumber}>{league}</Text>
            <Text style={s.miniLabel}>{t('profile.league')}</Text>
          </View>
        </View>

        <PrimaryButton title={t('profile.refresh')} onPress={refreshMe} style={{ marginTop: 12 }} />

        <Text style={s.sectionTitle}>{t('profile.overview')}</Text>
        {loading ? (
          <View style={s.loadingRow}>
            <ActivityIndicator size="small" color={colors.primary} />
            <Text style={s.muted}>{t('profile.loadingStats')}</Text>
          </View>
        ) : (
          <View style={s.grid}>
            <View style={s.gridCard}>
              <Icon name="fire" size={20} color={colors.warning} />
              <Text style={s.gridValue}>0</Text>
              <Text style={s.gridLabel}>{t('profile.dayStreak')}</Text>
            </View>
            <View style={s.gridCard}>
              <Icon name="chart-line" size={20} color={colors.warning} />
              <Text style={s.gridValue}>{xp}</Text>
              <Text style={s.gridLabel}>{t('profile.totalXp')}</Text>
            </View>
            <View style={s.gridCard}>
              <Icon name="trophy-outline" size={20} color={colors.primary} />
              <Text style={s.gridValue}>{league}</Text>
              <Text style={s.gridLabel}>{t('profile.league')}</Text>
            </View>
            <View style={s.gridCard}>
              <Icon name="certificate-outline" size={20} color={colors.success} />
              <Text style={s.gridValue}>{Math.min(3, completedCount)}</Text>
              <Text style={s.gridLabel}>{t('profile.topFinishes')}</Text>
            </View>
          </View>
        )}

        <View style={s.card}>
          <Text style={s.cardTitle}>{t('profile.network')}</Text>
          <Text style={s.cardSub}>{t('profile.apiLabel', { api: API_BASE })}</Text>
          <PrimaryButton
            title={busyPing ? t('profile.pinging') : t('profile.ping')}
            onPress={doPing}
            disabled={busyPing}
            style={{ marginTop: 12 }}
          />
          {pingText ? <Text style={s.muted}>{pingText}</Text> : null}
        </View>

        <View style={s.card}>
          <Text style={s.cardTitle}>{t('profile.session')}</Text>
          <PrimaryButton title={t('profile.logout')} onPress={logout} style={{ marginTop: 12 }} />
          <Text style={s.muted}>{t('profile.logoutHint')}</Text>
        </View>

        <View style={s.card}>
          <Text style={s.cardTitle}>{t('profile.language')}</Text>
          <Text style={s.cardSub}>{t('profile.languageHint')}</Text>
          <View style={s.languageRow}>
            {LANGUAGE_OPTIONS.map((option) => {
              const active = option.id === lang;
              return (
                <Pressable
                  key={option.id}
                  onPress={() => setLang(option.id)}
                  style={[s.languageOption, active && s.languageOptionActive]}
                >
                  <Text style={[s.languageOptionText, active && s.languageOptionTextActive]}>
                    {option.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>
      </ScrollView>

      <Modal visible={menuOpen} transparent animationType="fade" onRequestClose={() => setMenuOpen(false)}>
        <Pressable style={s.modalBackdrop} onPress={() => setMenuOpen(false)}>
          <View style={s.sheet}>
            <Pressable style={s.sheetRow} onPress={() => setMenuOpen(false)}>
              <Icon name="flag-outline" size={18} color={colors.warning} />
              <Text style={s.sheetText}>{t('profile.menuQuests')}</Text>
            </Pressable>
            <Pressable style={s.sheetRow} onPress={() => setMenuOpen(false)}>
              <Icon name="newspaper-variant-outline" size={18} color={colors.primary} />
              <Text style={s.sheetText}>{t('profile.menuFeed')}</Text>
            </Pressable>
            <Pressable style={s.sheetRow} onPress={() => setMenuOpen(false)}>
              <Icon name="close" size={18} color={colors.muted} />
              <Text style={s.sheetText}>{t('profile.menuClose')}</Text>
            </Pressable>
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}

const s = StyleSheet.create({
  page: { flex: 1, backgroundColor: colors.bg1 },
  body: { paddingHorizontal: 16, paddingBottom: 24 },
  profileTop: { marginTop: 16, alignItems: 'center', justifyContent: 'center' },
  avatar: {
    width: 92,
    height: 92,
    borderRadius: 46,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { color: colors.text, fontWeight: '900', fontSize: 22, letterSpacing: 1 },
  gear: {
    position: 'absolute',
    right: 0,
    top: 0,
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  name: { marginTop: 14, color: colors.text, fontWeight: '900', fontSize: 22, textAlign: 'center' },
  handle: { marginTop: 6, color: colors.muted, fontWeight: '700', textAlign: 'center' },
  row3: { flexDirection: 'row', gap: 10, marginTop: 16 },
  miniStat: {
    flex: 1,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.card,
    padding: 12,
    alignItems: 'center',
  },
  miniNumber: { color: colors.text, fontWeight: '900', fontSize: 16 },
  miniLabel: { color: colors.muted, fontWeight: '800', fontSize: 12, marginTop: 4 },
  sectionTitle: { marginTop: 18, color: colors.text, fontWeight: '900', fontSize: 16 },
  loadingRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 10 },
  muted: { color: colors.muted, marginTop: 10, fontWeight: '700' },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginTop: 12 },
  gridCard: {
    width: '48%',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.card,
    padding: 12,
    gap: 6,
  },
  gridValue: { color: colors.text, fontWeight: '900', fontSize: 18 },
  gridLabel: { color: colors.muted, fontWeight: '800', fontSize: 12 },
  card: {
    marginTop: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.card,
    padding: 14,
  },
  cardTitle: { color: colors.text, fontWeight: '900', fontSize: 16 },
  cardSub: { color: colors.muted, fontWeight: '700', marginTop: 6 },

  modalBackdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.55)', justifyContent: 'flex-end' },
  sheet: {
    padding: 10,
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
  },
  sheetRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderRadius: 12,
  },
  sheetText: { color: colors.text, fontWeight: '900', fontSize: 14 },

  languageRow: { flexDirection: 'row', gap: 10, marginTop: 12, flexWrap: 'wrap' },
  languageOption: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.card2,
  },
  languageOptionActive: {
    borderColor: colors.primaryBorder,
    backgroundColor: colors.card,
  },
  languageOptionText: { color: colors.muted, fontWeight: '800', fontSize: 12 },
  languageOptionTextActive: { color: colors.text },
});
