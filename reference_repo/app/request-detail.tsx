import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { GlassCard } from '@/components/ui/GlassCard';
import { StatusChip } from '@/components/ui/StatusChip';
import { StreamBadge } from '@/components/ui/StreamBadge';
import { useApp } from '@/hooks/useApp';
import { colors, spacing, typography, borderRadius } from '@/constants/theme';

export default function RequestDetailScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { leaveRequests } = useApp();

  const request = leaveRequests.find(r => r.id === id);

  if (!request) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <Text style={styles.errorText}>Request not found</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.text.primary} />
        </TouchableOpacity>
        <Text style={styles.title}>Request Details</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView 
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <GlassCard style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={styles.cardHeaderLeft}>
              <Text style={styles.studentName}>{request.studentName}</Text>
              <View style={styles.row}>
                <StreamBadge stream={request.stream} />
                <Text style={styles.rollNo}>{request.studentRollNo}</Text>
              </View>
            </View>
            <StatusChip status={request.status} />
          </View>

          <View style={styles.divider} />

          <View style={styles.infoRow}>
            <Text style={styles.label}>Leave Type</Text>
            <Text style={styles.value}>{request.leaveType}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.label}>Duration</Text>
            <View style={styles.valueContainer}>
              <Text style={styles.value}>
                {new Date(request.startDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
              </Text>
              <Text style={styles.valueSeparator}>to</Text>
              <Text style={styles.value}>
                {new Date(request.endDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
              </Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.label}>Total Days</Text>
            <Text style={styles.value}>{request.days} {request.days === 1 ? 'day' : 'days'}</Text>
          </View>

          <View style={styles.divider} />

          <Text style={styles.label}>Reason</Text>
          <Text style={styles.reason}>{request.reason}</Text>
        </GlassCard>

        <GlassCard style={styles.card}>
          <View style={styles.timelineHeader}>
            <Ionicons name="git-branch-outline" size={24} color={colors.primary.main} />
            <Text style={styles.timelineTitle}>Approval Timeline</Text>
          </View>

          {request.approvals.map((approval, index) => (
            <View key={index} style={styles.timelineItem}>
              <View style={styles.timelineLeft}>
                <View style={[
                  styles.timelineDot,
                  {
                    backgroundColor: approval.status === 'approved' 
                      ? colors.success 
                      : approval.status === 'rejected' 
                      ? colors.error 
                      : colors.glass.border,
                  },
                ]} />
                {index < request.approvals.length - 1 && (
                  <View style={styles.timelineLine} />
                )}
              </View>

              <View style={styles.timelineContent}>
                <View style={styles.timelineContentHeader}>
                  <Text style={styles.timelineRole}>{approval.role}</Text>
                  {approval.status !== 'pending' && (
                    <Ionicons 
                      name={approval.status === 'approved' ? 'checkmark-circle' : 'close-circle'} 
                      size={20} 
                      color={approval.status === 'approved' ? colors.success : colors.error} 
                    />
                  )}
                </View>
                <Text style={styles.timelineName}>{approval.name}</Text>
                {approval.timestamp && (
                  <Text style={styles.timelineDate}>
                    {new Date(approval.timestamp).toLocaleDateString('en-IN', { 
                      day: 'numeric', 
                      month: 'short', 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </Text>
                )}
                {approval.remarks && (
                  <Text style={styles.timelineRemarks}>{approval.remarks}</Text>
                )}
              </View>
            </View>
          ))}
        </GlassCard>

        <View style={styles.appliedInfo}>
          <Ionicons name="time-outline" size={16} color={colors.text.tertiary} />
          <Text style={styles.appliedText}>
            Applied on {new Date(request.appliedDate).toLocaleDateString('en-IN', { 
              day: 'numeric', 
              month: 'short', 
              year: 'numeric' 
            })}
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.glass.border,
  },
  
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  title: {
    color: colors.text.primary,
    fontSize: typography.sizes.xl,
    fontWeight: typography.weights.bold,
  },
  
  content: {
    padding: spacing.md,
    paddingBottom: spacing['2xl'],
  },
  
  card: {
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.md,
  },
  
  cardHeaderLeft: {
    flex: 1,
    marginRight: spacing.sm,
    gap: spacing.sm,
  },
  
  studentName: {
    color: colors.text.primary,
    fontSize: typography.sizes.xl,
    fontWeight: typography.weights.bold,
  },
  
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  
  rollNo: {
    color: colors.text.secondary,
    fontSize: typography.sizes.sm,
  },
  
  divider: {
    height: 1,
    backgroundColor: colors.glass.border,
    marginVertical: spacing.md,
  },
  
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  
  label: {
    color: colors.text.secondary,
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.medium,
  },
  
  value: {
    color: colors.text.primary,
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.semibold,
  },
  
  valueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  
  valueSeparator: {
    color: colors.text.tertiary,
    fontSize: typography.sizes.xs,
  },
  
  reason: {
    color: colors.text.primary,
    fontSize: typography.sizes.base,
    lineHeight: typography.sizes.base * typography.lineHeights.relaxed,
    marginTop: spacing.xs,
  },
  
  timelineHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  
  timelineTitle: {
    color: colors.text.primary,
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.semibold,
  },
  
  timelineItem: {
    flexDirection: 'row',
    marginBottom: spacing.md,
  },
  
  timelineLeft: {
    alignItems: 'center',
    marginRight: spacing.md,
  },
  
  timelineDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  
  timelineLine: {
    width: 2,
    flex: 1,
    backgroundColor: colors.glass.border,
    marginVertical: spacing.xs,
  },
  
  timelineContent: {
    flex: 1,
  },
  
  timelineContentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  
  timelineRole: {
    color: colors.text.primary,
    fontSize: typography.sizes.base,
    fontWeight: typography.weights.semibold,
  },
  
  timelineName: {
    color: colors.text.secondary,
    fontSize: typography.sizes.sm,
    marginTop: spacing.xs,
  },
  
  timelineDate: {
    color: colors.text.tertiary,
    fontSize: typography.sizes.xs,
    marginTop: spacing.xs,
  },
  
  timelineRemarks: {
    color: colors.error,
    fontSize: typography.sizes.sm,
    marginTop: spacing.xs,
    fontStyle: 'italic',
  },
  
  appliedInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
  },
  
  appliedText: {
    color: colors.text.tertiary,
    fontSize: typography.sizes.sm,
  },
  
  errorText: {
    color: colors.text.secondary,
    fontSize: typography.sizes.base,
    textAlign: 'center',
    marginTop: spacing.xl,
  },
});
