import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { GlassCard } from '@/components/ui/GlassCard';
import { useApp } from '@/hooks/useApp';
import { colors, spacing, typography, borderRadius } from '@/constants/theme';

export default function AdminDashboardScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { leaveRequests } = useApp();

  const stats = {
    total: leaveRequests.length,
    pending: leaveRequests.filter(r => r.status === 'pending').length,
    approved: leaveRequests.filter(r => r.status === 'approved').length,
    rejected: leaveRequests.filter(r => r.status === 'rejected').length,
  };

  const streamStats = [
    { stream: 'CSE', count: leaveRequests.filter(r => r.stream === 'cse').length, gradient: colors.streams.cse.gradient },
    { stream: 'ECE', count: leaveRequests.filter(r => r.stream === 'ece').length, gradient: colors.streams.ece.gradient },
    { stream: 'MECH', count: leaveRequests.filter(r => r.stream === 'mech').length, gradient: colors.streams.mech.gradient },
  ];

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Admin Dashboard</Text>
          <Text style={styles.subtitle}>Overview & Analytics</Text>
        </View>
        <TouchableOpacity onPress={() => router.replace('/login')}>
          <Ionicons name="log-out-outline" size={24} color={colors.text.secondary} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.statsGrid}>
          <GlassCard style={styles.statCard}>
            <LinearGradient colors={colors.primary.gradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.statGradient}>
              <Ionicons name="documents" size={32} color={colors.text.primary} />
              <Text style={styles.statValue}>{stats.total}</Text>
              <Text style={styles.statLabel}>Total</Text>
            </LinearGradient>
          </GlassCard>

          <GlassCard style={styles.statCard}>
            <View style={[styles.statContent, { backgroundColor: colors.status.pending.background }]}>
              <Ionicons name="time" size={32} color={colors.status.pending.color} />
              <Text style={[styles.statValue, { color: colors.text.primary }]}>{stats.pending}</Text>
              <Text style={styles.statLabel}>Pending</Text>
            </View>
          </GlassCard>

          <GlassCard style={styles.statCard}>
            <View style={[styles.statContent, { backgroundColor: colors.status.approved.background }]}>
              <Ionicons name="checkmark-circle" size={32} color={colors.status.approved.color} />
              <Text style={[styles.statValue, { color: colors.text.primary }]}>{stats.approved}</Text>
              <Text style={styles.statLabel}>Approved</Text>
            </View>
          </GlassCard>

          <GlassCard style={styles.statCard}>
            <View style={[styles.statContent, { backgroundColor: colors.status.rejected.background }]}>
              <Ionicons name="close-circle" size={32} color={colors.status.rejected.color} />
              <Text style={[styles.statValue, { color: colors.text.primary }]}>{stats.rejected}</Text>
              <Text style={styles.statLabel}>Rejected</Text>
            </View>
          </GlassCard>
        </View>

        <Text style={styles.sectionTitle}>Stream-wise Requests</Text>
        {streamStats.map(item => (
          <GlassCard key={item.stream} style={styles.streamCard}>
            <LinearGradient colors={item.gradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.streamBadge}>
              <Text style={styles.streamText}>{item.stream}</Text>
            </LinearGradient>
            <Text style={styles.streamCount}>{item.count} requests</Text>
            <Ionicons name="chevron-forward" size={20} color={colors.text.tertiary} />
          </GlassCard>
        ))}
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
  title: {
    color: colors.text.primary,
    fontSize: typography.sizes['2xl'],
    fontWeight: typography.weights.bold,
  },
  subtitle: {
    color: colors.text.secondary,
    fontSize: typography.sizes.sm,
    marginTop: spacing.xs,
  },
  content: {
    padding: spacing.md,
    paddingBottom: 100,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  statCard: {
    width: '47%',
    padding: 0,
    overflow: 'hidden',
  },
  statGradient: {
    padding: spacing.md,
    alignItems: 'center',
    gap: spacing.xs,
  },
  statContent: {
    padding: spacing.md,
    alignItems: 'center',
    gap: spacing.xs,
    borderRadius: borderRadius.lg,
  },
  statValue: {
    color: colors.text.primary,
    fontSize: typography.sizes['3xl'],
    fontWeight: typography.weights.bold,
  },
  statLabel: {
    color: colors.text.primary,
    fontSize: typography.sizes.sm,
    opacity: 0.9,
  },
  sectionTitle: {
    color: colors.text.primary,
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.semibold,
    marginBottom: spacing.md,
  },
  streamCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    marginBottom: spacing.sm,
    gap: spacing.md,
  },
  streamBadge: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.sm,
  },
  streamText: {
    color: colors.text.primary,
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.bold,
  },
  streamCount: {
    flex: 1,
    color: colors.text.primary,
    fontSize: typography.sizes.base,
    fontWeight: typography.weights.medium,
  },
});
