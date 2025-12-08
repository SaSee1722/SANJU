import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { GlassCard } from '@/components/ui/GlassCard';
import { StreamBadge } from '@/components/ui/StreamBadge';
import { useApp } from '@/hooks/useApp';
import { colors, spacing, typography, borderRadius } from '@/constants/theme';

export default function ProfileScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { currentUser } = useApp();

  const menuItems = [
    { icon: 'person-outline', label: 'Edit Profile', onPress: () => {} },
    { icon: 'notifications-outline', label: 'Notifications', onPress: () => {} },
    { icon: 'document-text-outline', label: 'Leave History', onPress: () => {} },
    { icon: 'settings-outline', label: 'Settings', onPress: () => {} },
    { icon: 'help-circle-outline', label: 'Help & Support', onPress: () => {} },
    { icon: 'log-out-outline', label: 'Logout', color: colors.error, onPress: () => router.replace('/login') },
  ];

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <ScrollView 
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <LinearGradient
            colors={colors.primary.gradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.avatar}
          >
            <Text style={styles.avatarText}>
              {currentUser?.name?.split(' ').map(n => n[0]).join('') || 'U'}
            </Text>
          </LinearGradient>
          
          <Text style={styles.name}>{currentUser?.name || 'User'}</Text>
          <Text style={styles.email}>{currentUser?.email || 'user@college.edu'}</Text>
          
          <View style={styles.badges}>
            {currentUser?.stream && <StreamBadge stream={currentUser.stream} />}
            {currentUser?.year && (
              <View style={styles.yearBadge}>
                <Text style={styles.yearText}>Year {currentUser.year}</Text>
              </View>
            )}
          </View>
        </View>

        <GlassCard style={styles.infoCard}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Roll Number</Text>
            <Text style={styles.infoValue}>{currentUser?.rollNo || 'N/A'}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Department</Text>
            <Text style={styles.infoValue}>{currentUser?.stream?.toUpperCase() || 'N/A'}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Academic Year</Text>
            <Text style={styles.infoValue}>2021-2025</Text>
          </View>
        </GlassCard>

        <View style={styles.menu}>
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              onPress={item.onPress}
              activeOpacity={0.7}
            >
              <GlassCard style={styles.menuItem}>
                <View style={styles.menuLeft}>
                  <Ionicons 
                    name={item.icon as any} 
                    size={24} 
                    color={item.color || colors.text.secondary} 
                  />
                  <Text style={[styles.menuLabel, item.color && { color: item.color }]}>
                    {item.label}
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color={colors.text.tertiary} />
              </GlassCard>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.version}>LeaveX v1.0.0</Text>
      </ScrollView>
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
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  
  avatar: {
    width: 96,
    height: 96,
    borderRadius: 48,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  
  avatarText: {
    color: colors.text.primary,
    fontSize: typography.sizes['3xl'],
    fontWeight: typography.weights.bold,
  },
  
  name: {
    color: colors.text.primary,
    fontSize: typography.sizes['2xl'],
    fontWeight: typography.weights.bold,
    marginBottom: spacing.xs,
  },
  
  email: {
    color: colors.text.secondary,
    fontSize: typography.sizes.base,
    marginBottom: spacing.md,
  },
  
  badges: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  
  yearBadge: {
    backgroundColor: colors.glass.light,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
  },
  
  yearText: {
    color: colors.text.secondary,
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.bold,
  },
  
  infoCard: {
    padding: spacing.md,
    marginBottom: spacing.lg,
  },
  
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  
  infoLabel: {
    color: colors.text.secondary,
    fontSize: typography.sizes.sm,
  },
  
  infoValue: {
    color: colors.text.primary,
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.semibold,
  },
  
  divider: {
    height: 1,
    backgroundColor: colors.glass.border,
  },
  
  menu: {
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.md,
  },
  
  menuLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  
  menuLabel: {
    color: colors.text.primary,
    fontSize: typography.sizes.base,
    fontWeight: typography.weights.medium,
  },
  
  version: {
    color: colors.text.tertiary,
    fontSize: typography.sizes.sm,
    textAlign: 'center',
  },
});
