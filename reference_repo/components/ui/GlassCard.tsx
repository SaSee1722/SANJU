import React, { ReactNode } from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { colors, borderRadius, shadows } from '@/constants/theme';

interface GlassCardProps {
  children: ReactNode;
  style?: ViewStyle;
  strong?: boolean;
}

export function GlassCard({ children, style, strong = false }: GlassCardProps) {
  return (
    <View style={[strong ? styles.cardStrong : styles.card, style]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.glass.medium,
    borderRadius: borderRadius.lg,
    borderWidth: 1.5,
    borderColor: colors.glass.border,
    ...shadows.md,
  },
  
  cardStrong: {
    backgroundColor: colors.glass.strong,
    borderRadius: borderRadius.lg,
    borderWidth: 1.5,
    borderColor: colors.glass.border,
    ...shadows.lg,
  },
});
