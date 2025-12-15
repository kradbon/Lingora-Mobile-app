import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { register as registerApi } from '../api/auth';

export default function RegisterScreen({ navigation }: any) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);

  const onSubmit = async () => {
    setBusy(true);
    setErr('');
    try {
      await registerApi({ name, email, password });
      navigation.navigate('Login');
    } catch (e: any) {
      setErr(e?.response?.data?.detail || 'Register failed');
    }
    setBusy(false);
  };

  return (
    <View style={s.page}>
      <Text style={s.title}>Create account</Text>
      {err ? <Text style={s.error}>{err}</Text> : null}
      <TextInput style={s.input} placeholder="Name" placeholderTextColor="#94a3b8" onChangeText={setName} value={name} />
      <TextInput style={s.input} placeholder="Email" placeholderTextColor="#94a3b8" autoCapitalize="none" keyboardType="email-address" onChangeText={setEmail} value={email} />
      <TextInput style={s.input} placeholder="Password" placeholderTextColor="#94a3b8" secureTextEntry onChangeText={setPassword} value={password} />
      <Button title={busy ? 'Creating…' : 'Create Account'} onPress={onSubmit} disabled={busy} />
      <Text style={s.link} onPress={() => navigation.navigate('Login')}>Back to Login</Text>
    </View>
  );
}

const s = StyleSheet.create({
  page: { flex: 1, padding: 20, justifyContent: 'center', backgroundColor: '#020617' },
  title: { color: '#fff', fontSize: 24, marginBottom: 10 },
  input: { backgroundColor: '#111827', color: '#fff', borderRadius: 8, padding: 10, marginBottom: 10, borderWidth: 1, borderColor: '#1f2933' },
  error: { color: '#f87171', marginBottom: 8 },
  link: { color: '#93c5fd', marginTop: 10 }
});
