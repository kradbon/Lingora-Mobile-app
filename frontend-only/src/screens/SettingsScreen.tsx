import React, { useState } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { useAuth } from '../context/AuthProvider';
import { ping } from '../api/auth';
import { API_BASE } from '../config';

export default function SettingsScreen() {
  const { user, refreshMe, logout } = useAuth();
  const [busyPing, setBusyPing] = useState(false);
  const [pingText, setPingText] = useState('');

  const doPing = async () => {
    setBusyPing(true);
    setPingText('Testing...');
    try {
      await ping();
      setPingText('OK (status 200)');
    } catch (e: any) {
      setPingText(e?.message || 'Ping failed');
    }
    setBusyPing(false);
  };

  return (
    <View style={s.page}>
      <Text style={s.title}>Settings</Text>

      <View style={s.card}>
        <Text style={s.h2}>Account</Text>
        {user ? (
          <>
            <Text style={s.label}>Name</Text>
            <Text style={s.value}>{user.name}</Text>
            <Text style={s.label}>Email</Text>
            <Text style={s.value}>{user.email}</Text>
          </>
        ) : (
          <Text style={s.muted}>Not logged in</Text>
        )}
        <Button title="Refresh" onPress={refreshMe} />
      </View>

      <View style={s.card}>
        <Text style={s.h2}>Network & API</Text>
        <Text style={s.label}>Effective API URL</Text>
        <Text style={s.value}>{API_BASE}</Text>
        <Button title={busyPing ? 'Pinging…' : 'Ping /ping'} onPress={doPing} disabled={busyPing} />
        {pingText ? <Text style={s.muted}>{pingText}</Text> : null}
      </View>

      <View style={s.card}>
        <Text style={s.h2}>Session</Text>
        <Button title="Logout" onPress={logout} />
        <Text style={s.muted}>Clears token and returns to Login.</Text>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  page: { flex: 1, backgroundColor: '#020617', padding: 16 },
  title: { fontSize: 22, fontWeight: '700', color: '#e5e7eb', marginBottom: 16 },
  card: { padding: 14, borderRadius: 12, borderWidth: 1, borderColor: '#1f2933', backgroundColor: '#111827', marginBottom: 12 },
  h2: { fontSize: 16, fontWeight: '700', color: '#e5e7eb', marginBottom: 8 },
  label: { fontSize: 12, color: '#9ca3af', marginTop: 4 },
  value: { fontSize: 14, fontWeight: '600', color: '#e5e7eb' },
  muted: { fontSize: 12, color: '#9ca3af', marginTop: 6 },
});
