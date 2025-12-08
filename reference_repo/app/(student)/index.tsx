import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { GlassCard } from '@/components/ui/GlassCard';
import { StreamBadge } from '@/components/ui/StreamBadge';
import { FloatingActionButton } from '@/components/feature/FloatingActionButton';
import { useApp } from '@/hooks/useApp';
import { colors, spacing, typography, borderRadius } from '@/constants/theme';

export default function StudentDashboard() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { currentUser, leaveRequests } = useApp();

  const myRequests = leaveRequests.filter(req => req.studentId === currentUser?.id);
  const stats = {
    total: myRequests.length,
    pending: myRequests.filter(r => r.status === 'pending').length,
    approved: myRequests.filter(r => r.status === 'approved').length,
    rejected: myRequests.filter(r => r.status === 'rejected').length,
  };

  const quickActions = [
    { icon: 'document-text', label: 'New Leave', color: colors.primary.gradient, onPress: () => router.push('/apply-leave') },
    { icon: 'time', label: 'Pending', color: colors.streams.cse.gradient, count: stats.pending, onPress: () => router.push('/(student)/requests') },
    { icon: 'checkmark-circle', label: 'Approved', color: colors.streams.civil.gradient, count: stats.approved, onPress: () => {} },
    { icon: 'close-circle', label: 'Rejected', color: colors.streams.mech.gradient, count: stats.rejected, onPress: () => {} },
  ];

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <ScrollView 
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Welcome back,</Text>
            <Text style={styles.name}>{currentUser?.name || 'Student'}</Text>
          </View>
          <View style={styles.headerRight}>
            {currentUser?.stream && <StreamBadge stream={currentUser.stream} />}
          </View>
        </View>

        <GlassCard style={styles.statsCard}>
          <LinearGradient
            colors={colors.primary.gradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.statsGradient}
          >
            <View style={styles.statsRow}>
              <View style={styles.stat}>
                <Text style={styles.statValue}>{stats.total}</Text>
                <Text style={styles.statLabel}>Total Requests</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.stat}>
                <Text style={styles.statValue}>{stats.pending}</Text>
                <Text style={styles.statLabel}>Pending</Text>
              </View>
            </View>
          </LinearGradient>
        </GlassCard>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.quickActions}>
            {quickActions.map((action, index) => (
              <TouchableOpacity
                key={index}
                onPress={action.onPress}
                activeOpacity={0.7}
                style={styles.actionButton}
              >
                <LinearGradient
                  colors={action.color}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.actionGradient}
                >
                  <Ionicons name={action.icon as any} size={24} color={colors.text.primary} />
                  {action.count !== undefined && (
                    <View style={styles.actionBadge}>
                      <Text style={styles.actionBadgeText}>{action.count}</Text>
                    </View>
                  )}
                </LinearGradient>
                <Text style={styles.actionLabel}>{action.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Activity</Text>
            <TouchableOpacity onPress={() => router.push('/(student)/requests')}>
              <Text style={styles.viewAll}>View All</Text>
            </TouchableOpacity>
          </View>

          {myRequests.slice(0, 3).map(request => (
            <GlassCard key={request.id} style={styles.activityCard}>
              <View style={styles.activityHeader}>
                <Text style={styles.activityType}>{request.leaveType}</Text>
                <View style={[styles.statusDot, { backgroundColor: request.status === 'approved' ? colors.success : request.status === 'rejected' ? colors.error : colors.warning }]} />
              </View>
              <Text style={styles.activityDate}>
                {new Date(request.startDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })} - {new Date(request.endDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
              </Text>
              <Text style={styles.activityReason} numberOfLines={1}>{request.reason}</Text>
            </GlassCard>
          ))}
        </View>

        <GlassCard style={styles.infoCard}>
          <Ionicons name="information-circle" size={24} color={colors.primary.main} />
          <View style={styles.infoText}>
            <Text style={styles.infoTitle}>Leave Balance</Text>
            <Text style={styles.infoDesc}>You have 12 days of leave remaining this semester</Text>
          </View>
        </GlassCard>
      </ScrollView>

      <FloatingActionButton onPress={() => router.push('/apply-leave')} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  
  content: {
    padding: spacing.md,
    paddingBottom: 100,
  },
  
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  
  greeting: {
    color: colors.text.secondary,
    fontSize: typography.sizes.base,
    fontWeight: typography.weights.medium,
  },
  
  name: {
    color: colors.text.primary,
    fontSize: typography.sizes['2xl'],
    fontWeight: typography.weights.bold,
    marginTop: spacing.xs,
  },
  
  headerRight: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  
  statsCard: {
    padding: 0,
    overflow: 'hidden',
    marginBottom: spacing.lg,
  },
  
  statsGradient: {
    padding: spacing.lg,
  },
  
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  
  stat: {
    flex: 1,
    alignItems: 'center',
  },
  
  statValue: {
    color: colors.text.primary,
    fontSize: typography.sizes['3xl'],
    fontWeight: typography.weights.bold,
  },
  
  statLabel: {
    color: colors.text.primary,
    fontSize: typography.sizes.sm,
    marginTop: spacing.xs,
    opacity: 0.9,
  },
  
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: colors.text.primary,
    opacity: 0.2,
  },
  
  section: {
    marginBottom: spacing.lg,
  },
  
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  
  sectionTitle: {
    color: colors.text.primary,
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.semibold,
  },
  
  viewAll: {
    color: colors.primary.main,
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.medium,
  },
  
  quickActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  
  actionButton: {
    width: '47%',
    alignItems: 'center',
  },
  
  actionGradient: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  
  actionBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: colors.background.primary,
    borderRadius: 12,
    minWidth: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
  },
  
  actionBadgeText: {
    color: colors.text.primary,
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.bold,
  },
  
  actionLabel: {
    color: colors.text.primary,
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.medium,
    marginTop: spacing.sm,
  },
  
  activityCard: {
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  
  activityHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  
  activityType: {
    color: colors.text.primary,
    fontSize: typography.sizes.base,
    fontWeight: typography.weights.semibold,
  },
  
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  
  activityDate: {
    color: colors.text.secondary,
    fontSize: typography.sizes.sm,
    marginBottom: spacing.xs,
  },
  
  activityReason: {
    color: colors.text.tertiary,
    fontSize: typography.sizes.sm,
  },
  
  infoCard: {
    flexDirection: 'row',
    padding: spacing.md,
    gap: spacing.md,
  },
  
  infoText: {
    flex: 1,
  },
  
  infoTitle: {
    color: colors.text.primary,
    fontSize: typography.sizes.base,
    fontWeight: typography.weights.semibold,
    marginBottom: spacing.xs,
  },
  
  infoDesc: {
    color: colors.text.secondary,
    fontSize: typography.sizes.sm,
    lineHeight: typography.sizes.sm * typography.lineHeights.relaxed,
  },
});
