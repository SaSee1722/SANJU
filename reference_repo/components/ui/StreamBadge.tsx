import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { StreamType } from '@/types';
import { colors, borderRadius, spacing, typography } from '@/constants/theme';

interface StreamBadgeProps {
  stream: StreamType;
}

export function StreamBadge({ stream }: StreamBadgeProps) {
  const streamConfig: { [key in StreamType]: { gradient: string[], label: string } } = {
    cse: { gradient: colors.streams.cse.gradient, label: 'CSE' },
    ece: { gradient: colors.streams.ece.gradient, label: 'ECE' },
    mech: { gradient: colors.streams.mech.gradient, label: 'MECH' },
    civil: { gradient: colors.streams.civil.gradient, label: 'CIVIL' },
    eee: { gradient: colors.streams.eee.gradient, label: 'EEE' },
  };

  const config = streamConfig[stream];

  return (
    <LinearGradient
      colors={config.gradient}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.badge}
    >
      <Text style={styles.text}>{config.label}</Text>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
  },
  
  text: {
    color: colors.text.primary,
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.bold,
  },
});
