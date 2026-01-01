import React, { useState } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { useAuth } from '../context/AuthProvider';
import { API_BASE, OFFLINE_MODE } from '../config';
import PrimaryButton from '../components/PrimaryButton';
import { colors } from '../theme';
import TextField from '../components/TextField';
import { useI18n } from '../i18n';

const logo = require('../../assets/images/lingora-logo.png');

export default function RegisterScreen({ navigation }: any) {
  const { t } = useI18n();
  const { register } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);

  const errorToMessage = (e: any) => {
    const detail = e?.response?.data?.detail;
    if (typeof detail === 'string') return detail;
    if (Array.isArray(detail)) {
      const msg = detail.map((d) => d?.msg).filter(Boolean).join(', ');
      if (msg) return msg;
    }
    if (OFFLINE_MODE) {
      const message = typeof e?.message === 'string' ? e.message : '';
      if (message === 'Email already registered') return t('auth.errors.emailAlreadyRegistered');
      return t('auth.errors.registerFailed');
    }
    if (!e?.response) {
      const hint = API_BASE.includes('10.0.2.2') ? t('errors.realDeviceHint') : '';
      return t('errors.cannotReachApi', { api: API_BASE, hint });
    }
    return t('auth.errors.registerFailed');
  };

  const onSubmit = async () => {
    const nameTrim = name.trim();
    const emailTrim = email.trim();
    if (!nameTrim) return setErr(t('auth.errors.nameRequired'));
    if (!emailTrim) return setErr(t('auth.errors.emailRequired'));
    if (!emailTrim.includes('@')) return setErr(t('auth.errors.emailInvalid'));
    if (!password) return setErr(t('auth.errors.passwordRequired'));
    if (password.length < 6) return setErr(t('auth.errors.passwordMin'));

    setBusy(true);
    setErr('');
    try {
      await register(nameTrim, emailTrim, password);
    } catch (e: any) {
      setErr(errorToMessage(e));
    }
    setBusy(false);
  };

  return (
    <View style={s.page}>
      <View style={s.card}>
        <View style={s.brand}>
          <Image source={logo} style={s.brandImage} resizeMode="contain" />
        </View>
        <Text style={s.title}>{t('auth.createAccountTitle')}</Text>
        <Text style={s.meta}>
          {OFFLINE_MODE ? t('auth.modeOffline') : t('auth.apiLabel', { api: API_BASE })}
        </Text>
        {err ? <Text style={s.error}>{err}</Text> : null}
        <TextField
          icon="account-outline"
          placeholder={t('auth.namePlaceholder')}
          onChangeText={setName}
          value={name}
        />
        <TextField
          icon="email-outline"
          placeholder={t('auth.emailPlaceholder')}
          autoCapitalize="none"
          keyboardType="email-address"
          onChangeText={setEmail}
          value={email}
        />
        <TextField
          icon="lock-outline"
          placeholder={t('auth.passwordPlaceholder')}
          secureTextEntry
          onChangeText={setPassword}
          value={password}
        />
        <PrimaryButton title={t('auth.createAccountButton')} onPress={onSubmit} loading={busy} />
        <Text style={s.link} onPress={() => navigation.navigate('Login')}>
          {t('auth.backToLogin')}
        </Text>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  page: { flex: 1, padding: 20, justifyContent: 'center', backgroundColor: colors.bg1 },
  title: { color: colors.text, fontSize: 26, marginBottom: 10, fontWeight: '900' },
  meta: { color: colors.muted, marginBottom: 10, fontSize: 12, fontWeight: '700' },
  error: { color: colors.danger, marginBottom: 8, fontWeight: '800' },
  link: { color: colors.primary, marginTop: 14, textAlign: 'center', fontWeight: '900' },
  card: {
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.card2,
    padding: 16,
  },
  brand: { alignItems: 'center', marginBottom: 12 },
  brandImage: { width: 180, height: 80 },
});
