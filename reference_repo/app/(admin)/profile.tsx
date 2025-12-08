import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { GlassCard } from '@/components/ui/GlassCard';
import { useApp } from '@/hooks/useApp';
import { colors, spacing, typography } from '@/constants/theme';

export default function AdminProfileScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { currentUser } = useApp();

  const menuItems = [
    { icon: 'person-outline', label: 'Edit Profile', onPress: () => {} },
    { icon: 'people-outline', label: 'Manage Users', onPress: () => {} },
    { icon: 'settings-outline', label: 'System Settings', onPress: () => {} },
    { icon: 'log-out-outline', label: 'Logout', color: colors.error, onPress: () => router.replace('/login') },
  ];

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <LinearGradient colors={colors.primary.gradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.avatar}>
            <Text style={styles.avatarText}>
              {currentUser?.name?.split(' ').map(n => n[0]).join('') || 'A'}
            </Text>
          </LinearGradient>
          <Text style={styles.name}>{currentUser?.name || 'Admin'}</Text>
          <Text style={styles.email}>{currentUser?.email || 'admin@college.edu'}</Text>
          <View style={styles.roleBadge}>
            <Text style={styles.roleText}>Administrator</Text>
          </View>
        </View>

        <View style={styles.menu}>
          {menuItems.map((item, index) => (
            <TouchableOpacity key={index} onPress={item.onPress} activeOpacity={0.7}>
              <GlassCard style={styles.menuItem}>
                <View style={styles.menuLeft}>
                  <Ionicons name={item.icon as any} size={24} color={item.color || colors.text.secondary} />
                  <Text style={[styles.menuLabel, item.color && { color: item.color }]}>{item.label}</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color={colors.text.tertiary} />
              </GlassCard>
            </TouchableOpacity>
          ))}
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
  roleBadge: {
    backgroundColor: colors.primary.main,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: 20,
  },
  roleText: {
    color: colors.text.primary,
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.semibold,
  },
  menu: {
    gap: spacing.sm,
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
});
