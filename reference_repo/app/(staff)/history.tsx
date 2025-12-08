import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LeaveRequestCard } from '@/components/feature/LeaveRequestCard';
import { useApp } from '@/hooks/useApp';
import { colors, spacing, typography } from '@/constants/theme';

export default function StaffHistoryScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { leaveRequests } = useApp();

  const processedRequests = leaveRequests.filter(r => r.status !== 'pending');

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Text style={styles.title}>History</Text>
        <Text style={styles.count}>{processedRequests.length} processed</Text>
      </View>

      <ScrollView 
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {processedRequests.map(request => (
          <LeaveRequestCard
            key={request.id}
            request={request}
            onPress={() => router.push(`/request-detail?id=${request.id}`)}
          />
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
  
  count: {
    color: colors.text.secondary,
    fontSize: typography.sizes.sm,
  },
  
  content: {
    padding: spacing.md,
    paddingBottom: 100,
  },
});
