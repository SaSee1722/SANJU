import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { GlassCard } from '@/components/ui/GlassCard';
import { GlassInput } from '@/components/ui/GlassInput';
import { GlassButton } from '@/components/ui/GlassButton';
import { useApp } from '@/hooks/useApp';
import { UserRole } from '@/types';
import { colors, spacing, typography, borderRadius } from '@/constants/theme';

export default function LoginScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { switchRole } = useApp();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState<UserRole>('student');

  const handleLogin = () => {
    switchRole(selectedRole);
    
    if (selectedRole === 'student') {
      router.replace('/(student)');
    } else if (selectedRole === 'staff') {
      router.replace('/(staff)');
    } else {
      router.replace('/(admin)');
    }
  };

  const roles: { role: UserRole; label: string; icon: keyof typeof Ionicons.glyphMap }[] = [
    { role: 'student', label: 'Student', icon: 'school-outline' },
    { role: 'staff', label: 'Staff/PC', icon: 'briefcase-outline' },
    { role: 'admin', label: 'Admin', icon: 'shield-checkmark-outline' },
  ];

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <LinearGradient
        colors={[colors.background.primary, colors.background.secondary]}
        style={StyleSheet.absoluteFill}
      />
      
      <ScrollView 
        contentContainerStyle={[styles.content, { paddingBottom: Math.max(insets.bottom, spacing.lg) }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <LinearGradient
            colors={colors.primary.gradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.logo}
          >
            <Ionicons name="document-text-outline" size={48} color={colors.text.primary} />
          </LinearGradient>
          <Text style={styles.title}>LeaveX</Text>
          <Text style={styles.subtitle}>Premium Leave Management</Text>
        </View>

        <GlassCard style={styles.card}>
          <Text style={styles.cardTitle}>Sign In</Text>
          
          <Text style={styles.label}>Select Role</Text>
          <View style={styles.roleSelector}>
            {roles.map(({ role, label, icon }) => (
              <TouchableOpacity
                key={role}
                onPress={() => setSelectedRole(role)}
                activeOpacity={0.7}
                style={styles.roleButton}
              >
                {selectedRole === role ? (
                  <LinearGradient
                    colors={colors.primary.gradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.roleButtonInner}
                  >
                    <Ionicons name={icon} size={24} color={colors.text.primary} />
                    <Text style={styles.roleTextActive}>{label}</Text>
                  </LinearGradient>
                ) : (
                  <View style={styles.roleButtonInactive}>
                    <Ionicons name={icon} size={24} color={colors.text.secondary} />
                    <Text style={styles.roleTextInactive}>{label}</Text>
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>

          <GlassInput
            label="Email"
            placeholder="your.email@college.edu"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <GlassInput
            label="Password"
            placeholder="Enter your password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          <GlassButton onPress={handleLogin}>
            Sign In
          </GlassButton>

          <TouchableOpacity style={styles.forgotPassword}>
            <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => router.push('/signup')} style={styles.signupLink}>
            <Text style={styles.signupLinkText}>
              Don't have an account? <Text style={styles.signupLinkBold}>Sign Up</Text>
            </Text>
          </TouchableOpacity>
        </GlassCard>

        <View style={styles.footer}>
          <View style={styles.divider} />
          <Text style={styles.footerText}>Secure • Private • Efficient</Text>
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
    padding: spacing.lg,
    gap: spacing.xl,
  },
  
  header: {
    alignItems: 'center',
    gap: spacing.md,
    marginTop: spacing.xl,
  },
  
  logo: {
    width: 96,
    height: 96,
    borderRadius: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  title: {
    color: colors.text.primary,
    fontSize: typography.sizes['4xl'],
    fontWeight: typography.weights.bold,
  },
  
  subtitle: {
    color: colors.text.secondary,
    fontSize: typography.sizes.base,
    fontWeight: typography.weights.medium,
  },
  
  card: {
    padding: spacing.lg,
  },
  
  cardTitle: {
    color: colors.text.primary,
    fontSize: typography.sizes['2xl'],
    fontWeight: typography.weights.bold,
    marginBottom: spacing.lg,
  },
  
  label: {
    color: colors.text.secondary,
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.medium,
    marginBottom: spacing.sm,
  },
  
  roleSelector: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  
  roleButton: {
    flex: 1,
  },
  
  roleButtonInner: {
    padding: spacing.md,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    gap: spacing.xs,
  },
  
  roleButtonInactive: {
    backgroundColor: colors.glass.light,
    borderWidth: 1,
    borderColor: colors.glass.border,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    gap: spacing.xs,
  },
  
  roleTextActive: {
    color: colors.text.primary,
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.semibold,
  },
  
  roleTextInactive: {
    color: colors.text.secondary,
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.medium,
  },
  
  forgotPassword: {
    alignItems: 'center',
    marginTop: spacing.sm,
  },
  
  forgotPasswordText: {
    color: colors.primary.light,
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.medium,
  },
  
  footer: {
    alignItems: 'center',
    gap: spacing.md,
  },
  
  divider: {
    width: 60,
    height: 2,
    backgroundColor: colors.glass.border,
    borderRadius: 1,
  },
  
  footerText: {
    color: colors.text.tertiary,
    fontSize: typography.sizes.sm,
  },
  
  signupLink: {
    alignItems: 'center',
    marginTop: spacing.md,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.glass.border,
  },
  
  signupLinkText: {
    color: colors.text.secondary,
    fontSize: typography.sizes.sm,
  },
  
  signupLinkBold: {
    color: colors.primary.light,
    fontWeight: typography.weights.semibold,
  },
});
