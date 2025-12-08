import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { GlassCard } from '@/components/ui/GlassCard';
import { StatusChip } from '@/components/ui/StatusChip';
import { StreamBadge } from '@/components/ui/StreamBadge';
import { LeaveRequest } from '@/types';
import { colors, spacing, typography } from '@/constants/theme';

interface LeaveRequestCardProps {
  request: LeaveRequest;
  onPress: () => void;
  showStudent?: boolean;
}

export function LeaveRequestCard({ request, onPress, showStudent = true }: LeaveRequestCardProps) {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
      <GlassCard style={styles.card}>
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            {showStudent && (
              <Text style={styles.studentName} numberOfLines={1}>
                {request.studentName}
              </Text>
            )}
            <Text style={styles.leaveType}>{request.leaveType}</Text>
          </View>
          <StatusChip status={request.status} />
        </View>

        <View style={styles.content}>
          <View style={styles.row}>
            <Ionicons name="calendar-outline" size={16} color={colors.text.secondary} />
            <Text style={styles.detailText}>
              {new Date(request.startDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })} - {new Date(request.endDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
            </Text>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{request.days} {request.days === 1 ? 'day' : 'days'}</Text>
            </View>
          </View>

          {showStudent && (
            <View style={styles.row}>
              <StreamBadge stream={request.stream} />
              <Text style={styles.rollNo}>{request.studentRollNo}</Text>
              <Text style={styles.year}>Year {request.year}</Text>
            </View>
          )}

          <Text style={styles.reason} numberOfLines={2}>{request.reason}</Text>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Applied {new Date(request.appliedDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</Text>
          <Ionicons name="chevron-forward" size={20} color={colors.text.tertiary} />
        </View>
      </GlassCard>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.sm,
  },
  
  headerLeft: {
    flex: 1,
    marginRight: spacing.sm,
  },
  
  studentName: {
    color: colors.text.primary,
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.semibold,
    marginBottom: spacing.xs,
  },
  
  leaveType: {
    color: colors.primary.light,
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.medium,
  },
  
  content: {
    gap: spacing.sm,
  },
  
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  
  detailText: {
    color: colors.text.secondary,
    fontSize: typography.sizes.sm,
    marginLeft: spacing.xs,
    flex: 1,
  },
  
  badge: {
    backgroundColor: colors.glass.light,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: 12,
  },
  
  badgeText: {
    color: colors.text.secondary,
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.medium,
  },
  
  rollNo: {
    color: colors.text.secondary,
    fontSize: typography.sizes.sm,
  },
  
  year: {
    color: colors.text.tertiary,
    fontSize: typography.sizes.sm,
  },
  
  reason: {
    color: colors.text.secondary,
    fontSize: typography.sizes.sm,
    lineHeight: typography.sizes.sm * typography.lineHeights.relaxed,
  },
  
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.sm,
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.glass.border,
  },
  
  footerText: {
    color: colors.text.tertiary,
    fontSize: typography.sizes.xs,
  },
});
