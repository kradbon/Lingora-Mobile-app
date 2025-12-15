import React from 'react';
import { View, Text, FlatList, Pressable, StyleSheet } from 'react-native';
import { units } from '../data/units';

export default function StudyScreen({ navigation }: any) {
  return (
    <View style={s.page}>
      <Text style={s.header}>Learn</Text>
      <FlatList
        data={units}
        keyExtractor={(u) => u.id}
        renderItem={({ item, index }) => (
          <Pressable style={s.card} onPress={() => navigation.navigate('Unit', { id: item.id })}>
            <View style={[s.icon, index % 2 ? s.iconAlt : null]}>
              <Text style={s.iconText}>{index % 2 === 0 ? 'CODE' : 'QUIZ'}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={s.title}>{index + 1}. {item.title}</Text>
              <Text style={s.sub}>{item.learn.code ? 'Lesson + Quiz' : 'Quiz'}</Text>
            </View>
            <View style={s.progress}>
              <View style={[s.fill, { width: `${(index % 10) * 10}%` }]} />
            </View>
          </Pressable>
        )}
      />
    </View>
  );
}

const s = StyleSheet.create({
  page: { flex: 1, backgroundColor: '#0f141a', padding: 16 },
  header: { color: '#fff', fontSize: 22, marginBottom: 12, fontWeight: '700' },
  card: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 12, borderRadius: 12, backgroundColor: '#111827', borderWidth: 1, borderColor: '#1f2933', marginBottom: 10 },
  icon: { width: 34, height: 34, borderRadius: 8, backgroundColor: '#A3A6DB', alignItems: 'center', justifyContent: 'center' },
  iconAlt: { backgroundColor: '#8B8FD1' },
  iconText: { color: '#111827', fontWeight: '700', fontSize: 12 },
  title: { color: '#e5e7eb', fontWeight: '700' },
  sub: { color: '#94a3b8', fontSize: 13 },
  progress: { width: 80, height: 6, backgroundColor: '#1f2933', borderRadius: 999, overflow: 'hidden' },
  fill: { height: 6, backgroundColor: '#777BB3' },
});
