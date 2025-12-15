import React, { useMemo, useState } from 'react';
import { View, Text, Button, Pressable, StyleSheet, ScrollView } from 'react-native';
import { units } from '../data/units';

type Step = 0 | 1 | 2;

export default function UnitScreen({ route, navigation }: any) {
  const unit = useMemo(() => units.find((u) => u.id === route.params?.id) || units[0], [route.params?.id]);
  const [step, setStep] = useState<Step>(0);
  const [choice, setChoice] = useState<number | null>(null);
  const isCorrect = choice !== null && choice === unit.quiz.answer;

  return (
    <ScrollView style={s.page}>
      <Text style={s.title}>{unit.title}</Text>

      {step === 0 && (
        <View style={s.card}>
          <Text style={s.lead}>{unit.learn.text}</Text>
          {unit.learn.code ? <Text style={s.code}>{unit.learn.code}</Text> : null}
          <Button title="Continue" onPress={() => setStep(1)} />
        </View>
      )}

      {step === 1 && (
        <View style={s.card}>
          <Text style={s.lead}>{unit.quiz.question}</Text>
          <View style={s.options}>
            {unit.quiz.choices.map((c, i) => (
              <Pressable
                key={i}
                onPress={() => setChoice(i)}
                style={[
                  s.opt,
                  choice === i && s.selected,
                  choice === i && i === unit.quiz.answer && s.correct,
                  choice === i && i !== unit.quiz.answer && s.incorrect,
                ]}
              >
                <Text style={s.optText}>{c}</Text>
              </Pressable>
            ))}
          </View>
          {choice !== null && (
            <Button
              title={isCorrect ? 'Great!' : 'Try again'}
              onPress={() => {
                if (isCorrect) setStep(2);
                else setChoice(null);
              }}
            />
          )}
        </View>
      )}

      {step === 2 && (
        <View style={s.card}>
          <Text style={s.lead}>Unit complete!</Text>
          <Button
            title="Back"
            onPress={() => {
              setStep(0);
              setChoice(null);
              navigation.goBack();
            }}
          />
        </View>
      )}
    </ScrollView>
  );
}

const s = StyleSheet.create({
  page: { flex: 1, backgroundColor: '#0f141a', padding: 16 },
  title: { color: '#fff', fontSize: 22, fontWeight: '700', marginBottom: 12 },
  card: { backgroundColor: '#111827', borderColor: '#1f2933', borderWidth: 1, borderRadius: 12, padding: 12, marginBottom: 12 },
  lead: { color: '#e5e7eb', fontSize: 16, fontWeight: '600', marginBottom: 8 },
  code: { marginTop: 10, backgroundColor: '#0b0f14', borderRadius: 8, padding: 10, color: '#a7f3d0', fontFamily: 'monospace' },
  options: { marginTop: 8, gap: 8 },
  opt: { padding: 12, borderRadius: 10, borderWidth: 1, borderColor: '#2b3340', backgroundColor: '#1f2933' },
  selected: { borderColor: '#0ea5e9' },
  correct: { borderColor: '#22c55e', backgroundColor: '#153f2d' },
  incorrect: { borderColor: '#ef4444', backgroundColor: '#3a1e1e' },
  optText: { color: '#e5e7eb' },
});
