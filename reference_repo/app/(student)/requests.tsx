import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LeaveRequestCard } from '@/components/feature/LeaveRequestCard';
import { useApp } from '@/hooks/useApp';
import { LeaveStatus } from '@/types';
import { colors, spacing, typography, borderRadius } from '@/constants/theme';

export default function RequestsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { currentUser, leaveRequests } = useApp();
  const [filter, setFilter] = useState<LeaveStatus | 'all'>('all');

  const myRequests = leaveRequests.filter(req => req.studentId === currentUser?.id);
  const filteredRequests = filter === 'all' 
    ? myRequests 
    : myRequests.filter(req => req.status === filter);

  const filters: { value: LeaveStatus | 'all'; label: string; count: number }[] = [
    { value: 'all', label: 'All', count: myRequests.length },
    { value: 'pending', label: 'Pending', count: myRequests.filter(r => r.status === 'pending').length },
    { value: 'approved', label: 'Approved', count: myRequests.filter(r => r.status === 'approved').length },
    { value: 'rejected', label: 'Rejected', count: myRequests.filter(r => r.status === 'rejected').length },
  ];

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Text style={styles.title}>My Requests</Text>
        <Text style={styles.count}>{filteredRequests.length} {filteredRequests.length === 1 ? 'request' : 'requests'}</Text>
      </View>

      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filters}
      >
        {filters.map(item => (
          <TouchableOpacity
            key={item.value}
            onPress={() => setFilter(item.value)}
            activeOpacity={0.7}
            style={[
              styles.filterButton,
              filter === item.value && styles.filterButtonActive,
            ]}
          >
            <Text style={[
              styles.filterText,
              filter === item.value && styles.filterTextActive,
            ]}>
              {item.label}
            </Text>
            {item.count > 0 && (
              <View style={[
                styles.filterBadge,
                filter === item.value && styles.filterBadgeActive,
              ]}>
                <Text style={[
                  styles.filterBadgeText,
                  filter === item.value && styles.filterBadgeTextActive,
                ]}>
                  {item.count}
                </Text>
              </View>
            )}
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView 
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {filteredRequests.length === 0 ? (
          <View style={styles.empty}>
            <Text style={styles.emptyText}>No requests found</Text>
          </View>
        ) : (
          filteredRequests.map(request => (
            <LeaveRequestCard
              key={request.id}
              request={request}
              onPress={() => router.push(`/request-detail?id=${request.id}`)}
              showStudent={false}
            />
          ))
        )}
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
  },
  
  title: {
    color: colors.text.primary,
    fontSize: typography.sizes['2xl'],
    fontWeight: typography.weights.bold,
  },
  
  count: {
    color: colors.text.secondary,
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.medium,
  },
  
  filters: {
    paddingHorizontal: spacing.md,
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.glass.light,
    borderWidth: 1.5,
    borderColor: colors.glass.border,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
    gap: spacing.xs,
    minHeight: 36,
  },
  
  filterButtonActive: {
    backgroundColor: colors.primary.main,
    borderColor: colors.primary.light,
  },
  
  filterText: {
    color: colors.text.secondary,
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.medium,
  },
  
  filterTextActive: {
    color: colors.text.primary,
  },
  
  filterBadge: {
    backgroundColor: colors.glass.strong,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
  },
  
  filterBadgeActive: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  
  filterBadgeText: {
    color: colors.text.secondary,
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.bold,
  },
  
  filterBadgeTextActive: {
    color: colors.text.primary,
  },
  
  content: {
    padding: spacing.md,
    paddingBottom: 100,
  },
  
  empty: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing['2xl'],
  },
  
  emptyText: {
    color: colors.text.tertiary,
    fontSize: typography.sizes.base,
  },
});
