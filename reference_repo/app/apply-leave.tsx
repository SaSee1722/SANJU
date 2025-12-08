import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { GlassCard } from '@/components/ui/GlassCard';
import { GlassInput } from '@/components/ui/GlassInput';
import { GlassButton } from '@/components/ui/GlassButton';
import { useApp } from '@/hooks/useApp';
import { useAlert } from '@/template';
import { LeaveRequest } from '@/types';
import { colors, spacing, typography, borderRadius } from '@/constants/theme';

export default function ApplyLeaveScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { currentUser, addLeaveRequest } = useApp();
  const { showAlert } = useAlert();

  const [leaveType, setLeaveType] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reason, setReason] = useState('');
  const [document, setDocument] = useState<string | null>(null);

  const leaveTypes = ['Medical Leave', 'Personal Leave', 'Emergency Leave', 'Academic Leave', 'Other'];

  const handleSubmit = () => {
    if (!leaveType || !startDate || !endDate || !reason) {
      showAlert('Missing Information', 'Please fill all required fields');
      return;
    }

    const start = new Date(startDate);
    const end = new Date(endDate);
    const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;

    const newRequest: LeaveRequest = {
      id: Date.now().toString(),
      studentId: currentUser?.id || '',
      studentName: currentUser?.name || '',
      studentRollNo: currentUser?.rollNo || '',
      stream: currentUser?.stream || 'cse',
      year: currentUser?.year || 1,
      leaveType,
      startDate,
      endDate,
      days,
      reason,
      document: document || undefined,
      status: 'pending',
      appliedDate: new Date().toISOString().split('T')[0],
      approvals: [
        { role: 'Class Teacher', name: 'Dr. Kumar', status: 'pending' },
        { role: 'Program Coordinator', name: 'Dr. Mehta', status: 'pending' },
        { role: 'HOD', name: 'Dr. Singh', status: 'pending' },
      ],
    };

    addLeaveRequest(newRequest);
    showAlert('Success', 'Leave request submitted successfully');
    router.back();
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.text.primary} />
        </TouchableOpacity>
        <Text style={styles.title}>Apply Leave</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView 
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <GlassCard style={styles.card}>
          <Text style={styles.sectionTitle}>Leave Type</Text>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.typeSelector}
          >
            {leaveTypes.map(type => (
              <TouchableOpacity
                key={type}
                onPress={() => setLeaveType(type)}
                activeOpacity={0.7}
                style={[
                  styles.typeButton,
                  leaveType === type && styles.typeButtonActive,
                ]}
              >
                <Text style={[
                  styles.typeText,
                  leaveType === type && styles.typeTextActive,
                ]}>
                  {type}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </GlassCard>

        <GlassCard style={styles.card}>
          <Text style={styles.sectionTitle}>Duration</Text>
          <GlassInput
            label="Start Date"
            placeholder="YYYY-MM-DD"
            value={startDate}
            onChangeText={setStartDate}
          />
          <GlassInput
            label="End Date"
            placeholder="YYYY-MM-DD"
            value={endDate}
            onChangeText={setEndDate}
          />
        </GlassCard>

        <GlassCard style={styles.card}>
          <Text style={styles.sectionTitle}>Reason</Text>
          <GlassInput
            placeholder="Please provide detailed reason for leave..."
            value={reason}
            onChangeText={setReason}
            multiline
            numberOfLines={4}
            style={{ height: 100, textAlignVertical: 'top', paddingTop: spacing.sm }}
          />
        </GlassCard>

        <GlassCard style={styles.card}>
          <Text style={styles.sectionTitle}>Supporting Document (Optional)</Text>
          <TouchableOpacity 
            style={styles.uploadButton}
            onPress={() => showAlert('Feature Coming Soon', 'Document upload will be available in next update')}
          >
            <Ionicons name="cloud-upload-outline" size={32} color={colors.text.secondary} />
            <Text style={styles.uploadText}>Tap to upload document</Text>
            <Text style={styles.uploadSubtext}>PDF, JPG, PNG (Max 5MB)</Text>
          </TouchableOpacity>
        </GlassCard>

        <GlassButton onPress={handleSubmit}>
          Submit Request
        </GlassButton>
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
  
  sectionTitle: {
    color: colors.text.primary,
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.semibold,
    marginBottom: spacing.md,
  },
  
  typeSelector: {
    gap: spacing.sm,
  },
  
  typeButton: {
    backgroundColor: colors.glass.light,
    borderWidth: 1,
    borderColor: colors.glass.border,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
  },
  
  typeButtonActive: {
    backgroundColor: colors.primary.main,
    borderColor: colors.primary.main,
  },
  
  typeText: {
    color: colors.text.secondary,
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.medium,
  },
  
  typeTextActive: {
    color: colors.text.primary,
  },
  
  uploadButton: {
    backgroundColor: colors.glass.light,
    borderWidth: 1,
    borderColor: colors.glass.border,
    borderRadius: borderRadius.md,
    padding: spacing.xl,
    alignItems: 'center',
    gap: spacing.sm,
  },
  
  uploadText: {
    color: colors.text.primary,
    fontSize: typography.sizes.base,
    fontWeight: typography.weights.medium,
  },
  
  uploadSubtext: {
    color: colors.text.tertiary,
    fontSize: typography.sizes.sm,
  },
});
