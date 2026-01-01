import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useAuth } from '../context/AuthProvider';
import { ping } from '../api/auth';
import { API_BASE } from '../config';
import { useI18n } from '../i18n';
import PrimaryButton from '../components/PrimaryButton';
import { colors } from '../theme';

export default function SettingsScreen() {
  const { t } = useI18n();
  const { user, refreshMe, logout } = useAuth();
  const [busyPing, setBusyPing] = useState(false);
  const [pingText, setPingText] = useState('');

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
      }
      else setPingText(e?.response?.data?.detail || e?.message || t('errors.pingFailed'));
    }
    setBusyPing(false);
  };

  return (
    <View style={s.page}>
      <Text style={s.title}>{t('settings.title')}</Text>

      <View style={s.card}>
        <Text style={s.h2}>{t('settings.account')}</Text>
        {user ? (
          <>
            <Text style={s.label}>{t('settings.name')}</Text>
            <Text style={s.value}>{user.name}</Text>
            <Text style={s.label}>{t('settings.email')}</Text>
            <Text style={s.value}>{user.email}</Text>
          </>
        ) : (
          <Text style={s.muted}>{t('settings.notLoggedIn')}</Text>
        )}
        <PrimaryButton title={t('settings.refresh')} onPress={refreshMe} />
      </View>

      <View style={s.card}>
        <Text style={s.h2}>{t('settings.network')}</Text>
        <Text style={s.label}>{t('settings.effectiveApi')}</Text>
        <Text style={s.value}>{API_BASE}</Text>
        <PrimaryButton
          title={busyPing ? t('settings.pinging') : t('settings.ping')}
          onPress={doPing}
          disabled={busyPing}
          style={{ marginTop: 10 }}
        />
        {pingText ? <Text style={s.muted}>{pingText}</Text> : null}
      </View>

      <View style={s.card}>
        <Text style={s.h2}>{t('settings.session')}</Text>
        <PrimaryButton title={t('settings.logout')} onPress={logout} />
        <Text style={s.muted}>{t('settings.logoutHint')}</Text>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  page: { flex: 1, backgroundColor: colors.bg1, padding: 16 },
  title: { fontSize: 22, fontWeight: '900', color: colors.text, marginBottom: 16 },
  card: {
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.card,
    marginBottom: 12,
  },
  h2: { fontSize: 16, fontWeight: '900', color: colors.text, marginBottom: 8 },
  label: { fontSize: 12, color: colors.muted, marginTop: 4, fontWeight: '700' },
  value: { fontSize: 14, fontWeight: '800', color: colors.text },
  muted: { fontSize: 12, color: colors.muted, marginTop: 6, fontWeight: '700' },
});
