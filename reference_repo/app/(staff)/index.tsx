import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { GlassCard } from '@/components/ui/GlassCard';
import { LeaveRequestCard } from '@/components/feature/LeaveRequestCard';
import { GlassButton } from '@/components/ui/GlassButton';
import { useApp } from '@/hooks/useApp';
import { useAlert } from '@/template';
import { colors, spacing, typography, borderRadius } from '@/constants/theme';

export default function StaffInboxScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { leaveRequests, updateLeaveRequest } = useApp();
  const { showAlert } = useAlert();
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const pendingRequests = leaveRequests.filter(r => r.status === 'pending');

  const handleApprove = (id: string) => {
    updateLeaveRequest(id, { 
      status: 'approved',
      approvals: leaveRequests.find(r => r.id === id)?.approvals.map(a => 
        a.status === 'pending' ? { ...a, status: 'approved', timestamp: new Date().toISOString() } : a
      ) || []
    });
    setSelectedId(null);
    showAlert('Success', 'Leave request approved');
  };

  const handleReject = (id: string) => {
    updateLeaveRequest(id, { 
      status: 'rejected',
      approvals: leaveRequests.find(r => r.id === id)?.approvals.map(a => 
        a.status === 'pending' ? { ...a, status: 'rejected', timestamp: new Date().toISOString() } : a
      ) || []
    });
    setSelectedId(null);
    showAlert('Success', 'Leave request rejected');
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Approval Inbox</Text>
          <Text style={styles.subtitle}>{pendingRequests.length} pending requests</Text>
        </View>
        <TouchableOpacity onPress={() => router.replace('/login')}>
          <Ionicons name="log-out-outline" size={24} color={colors.text.secondary} />
        </TouchableOpacity>
      </View>

      <ScrollView 
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {pendingRequests.length === 0 ? (
          <GlassCard style={styles.emptyCard}>
            <Ionicons name="checkmark-done-circle-outline" size={64} color={colors.success} />
            <Text style={styles.emptyTitle}>All Caught Up!</Text>
            <Text style={styles.emptyText}>No pending approvals at the moment</Text>
          </GlassCard>
        ) : (
          pendingRequests.map(request => (
            <View key={request.id}>
              <LeaveRequestCard
                request={request}
                onPress={() => setSelectedId(selectedId === request.id ? null : request.id)}
              />
              
              {selectedId === request.id && (
                <GlassCard style={styles.actionsCard}>
                  <View style={styles.actions}>
                    <GlassButton
                      variant="outline"
                      onPress={() => handleReject(request.id)}
                      style={{ flex: 1 }}
                    >
                      Reject
                    </GlassButton>
                    <GlassButton
                      onPress={() => handleApprove(request.id)}
                      style={{ flex: 1 }}
                    >
                      Approve
                    </GlassButton>
                  </View>
                  <TouchableOpacity
                    onPress={() => router.push(`/request-detail?id=${request.id}`)}
                    style={styles.detailButton}
                  >
                    <Text style={styles.detailButtonText}>View Full Details</Text>
                    <Ionicons name="arrow-forward" size={16} color={colors.primary.main} />
                  </TouchableOpacity>
                </GlassCard>
              )}
            </View>
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
  
  emptyCard: {
    padding: spacing.xl,
    alignItems: 'center',
    gap: spacing.md,
  },
  
  emptyTitle: {
    color: colors.text.primary,
    fontSize: typography.sizes.xl,
    fontWeight: typography.weights.bold,
  },
  
  emptyText: {
    color: colors.text.secondary,
    fontSize: typography.sizes.base,
    textAlign: 'center',
  },
  
  actionsCard: {
    padding: spacing.md,
    marginTop: -spacing.sm,
    marginBottom: spacing.md,
    marginHorizontal: spacing.md,
  },
  
  actions: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.md,
  },
  
  detailButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    paddingVertical: spacing.sm,
  },
  
  detailButtonText: {
    color: colors.primary.main,
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.medium,
  },
});
