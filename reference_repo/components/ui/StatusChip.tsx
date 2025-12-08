import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LeaveStatus } from '@/types';
import { colors, borderRadius, spacing, typography } from '@/constants/theme';

interface StatusChipProps {
  status: LeaveStatus;
}

export function StatusChip({ status }: StatusChipProps) {
  const statusConfig = {
    pending: { color: colors.status.pending.color, bg: colors.status.pending.background, text: 'Pending' },
    approved: { color: colors.status.approved.color, bg: colors.status.approved.background, text: 'Approved' },
    rejected: { color: colors.status.rejected.color, bg: colors.status.rejected.background, text: 'Rejected' },
    processing: { color: colors.status.processing.color, bg: colors.status.processing.background, text: 'Processing' },
  };

  const config = statusConfig[status];

  return (
    <View style={[styles.chip, { backgroundColor: config.bg }]}>
      <View style={[styles.dot, { backgroundColor: config.color }]} />
      <Text style={[styles.text, { color: config.color }]}>{config.text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
  },
  
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: spacing.xs,
  },
  
  text: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.medium,
  },
});
