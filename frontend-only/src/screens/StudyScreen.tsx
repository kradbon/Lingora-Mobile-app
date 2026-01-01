import React from 'react';
import { View, Text, FlatList, Pressable, StyleSheet } from 'react-native';
import { getUnits } from '../data/units';
import { useI18n } from '../i18n';
import { colors } from '../theme';

export default function StudyScreen({ navigation }: any) {
  const { t, lang } = useI18n();
  const units = getUnits(lang);
  return (
    <View style={s.page}>
      <Text style={s.header}>{t('study.title')}</Text>
      <FlatList
        data={units}
        keyExtractor={(u) => u.id}
        renderItem={({ item, index }) => (
          <Pressable
            style={s.card}
            onPress={() => navigation.navigate('Unit', { id: item.id, returnTo: 'Path' })}
          >
            <View style={[s.icon, index % 2 ? s.iconAlt : null]}>
              <Text style={s.iconText}>{t('study.quiz')}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={s.title}>{index + 1}. {item.title}</Text>
              <Text style={s.sub}>{t('study.quizOnly')}</Text>
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
  page: { flex: 1, backgroundColor: colors.bg1, padding: 16 },
  header: { color: colors.text, fontSize: 22, marginBottom: 12, fontWeight: '900' },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 12,
    borderRadius: 14,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 10,
  },
  icon: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconAlt: { backgroundColor: colors.warning },
  iconText: { color: colors.bg0, fontWeight: '900', fontSize: 12 },
  title: { color: colors.text, fontWeight: '900' },
  sub: { color: colors.muted, fontSize: 13, fontWeight: '700' },
  progress: { width: 80, height: 6, backgroundColor: colors.border, borderRadius: 999, overflow: 'hidden' },
  fill: { height: 6, backgroundColor: colors.primary },
});
