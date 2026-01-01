import React from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, ViewStyle } from 'react-native';
import { colors } from '../theme';

type Props = {
  title: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
};

export default function PrimaryButton({ title, onPress, loading, disabled, style }: Props) {
  const isDisabled = Boolean(disabled || loading);
  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      style={({ pressed }) => [
        s.button,
        isDisabled && s.disabled,
        pressed && !isDisabled && s.pressed,
        style,
      ]}
    >
      {loading ? <ActivityIndicator size="small" color="#0b0d10" /> : null}
      <Text style={[s.text, isDisabled && s.textDisabled]}>{title}</Text>
    </Pressable>
  );
}

const s = StyleSheet.create({
  button: {
    height: 48,
    borderRadius: 12,
    backgroundColor: colors.primary,
    borderWidth: 1,
    borderColor: colors.primaryBorder,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  pressed: { opacity: 0.9 },
  disabled: { backgroundColor: colors.locked, borderColor: colors.locked, elevation: 0, shadowOpacity: 0 },
  text: { color: colors.bg0, fontWeight: '800', fontSize: 16 },
  textDisabled: { color: colors.text, opacity: 0.5 },
});
