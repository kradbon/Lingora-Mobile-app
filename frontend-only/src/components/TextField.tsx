import React from 'react';
import { StyleProp, StyleSheet, TextInput, TextInputProps, View, ViewStyle } from 'react-native';
import { colors } from '../theme';
import Icon, { type IconName } from './Icon';

type Props = TextInputProps & {
  icon: IconName;
  containerStyle?: StyleProp<ViewStyle>;
};

export default function TextField({ icon, containerStyle, style, ...props }: Props) {
  return (
    <View style={[s.wrap, containerStyle]}>
      <View style={s.icon}>
        <Icon name={icon} size={18} color={colors.muted} />
      </View>
      <TextInput
        {...props}
        style={[s.input, style]}
        placeholderTextColor={colors.muted}
        selectionColor={colors.primary}
      />
    </View>
  );
}

const s = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: colors.card,
    borderRadius: 14,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: colors.border,
    height: 52,
    marginBottom: 10,
  },
  icon: { width: 22, alignItems: 'center' },
  input: { flex: 1, color: colors.text, fontWeight: '700' },
});

