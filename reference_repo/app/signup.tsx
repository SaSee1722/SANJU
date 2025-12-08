import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { GlassCard } from '@/components/ui/GlassCard';
import { GlassInput } from '@/components/ui/GlassInput';
import { GlassButton } from '@/components/ui/GlassButton';
import { StreamBadge } from '@/components/ui/StreamBadge';
import { useApp } from '@/hooks/useApp';
import { UserRole, StreamType } from '@/types';
import { colors, spacing, typography, borderRadius } from '@/constants/theme';

export default function SignupScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { setCurrentUser } = useApp();
  
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState<UserRole>('student');
  
  // Student-specific fields
  const [rollNo, setRollNo] = useState('');
  const [stream, setStream] = useState<StreamType>('cse');
  const [year, setYear] = useState('1');
  
  // Staff/Admin-specific fields
  const [department, setDepartment] = useState('');

  const handleSignup = () => {
    // Basic validation
    if (!email || !username || !password || !confirmPassword) {
      alert('Please fill in all required fields');
      return;
    }
    
    if (password !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    
    if (selectedRole === 'student' && (!rollNo || !stream || !year)) {
      alert('Please fill in student details');
      return;
    }
    
    if ((selectedRole === 'staff' || selectedRole === 'admin') && !department) {
      alert('Please enter department');
      return;
    }

    // Create user object
    const newUser = {
      id: Math.random().toString(36).substr(2, 9),
      name: username,
      email,
      role: selectedRole,
      ...(selectedRole === 'student' && {
        rollNo,
        stream,
        year: parseInt(year),
      }),
      ...(selectedRole !== 'student' && {
        department,
      }),
    };

    setCurrentUser(newUser);
    
    // Navigate to appropriate dashboard
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

  const streams: StreamType[] = ['cse', 'ece', 'mech', 'civil', 'eee'];

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <LinearGradient
        colors={[colors.background.primary, colors.background.secondary]}
        style={StyleSheet.absoluteFill}
      />
      
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.text.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Create Account</Text>
        <View style={{ width: 40 }} />
      </View>
      
      <ScrollView 
        contentContainerStyle={[styles.content, { paddingBottom: Math.max(insets.bottom, spacing.lg) }]}
        showsVerticalScrollIndicator={false}
      >
        <GlassCard style={styles.card}>
          <View style={styles.cardHeader}>
            <LinearGradient
              colors={colors.primary.gradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.icon}
            >
              <Ionicons name="person-add-outline" size={32} color={colors.text.primary} />
            </LinearGradient>
            <Text style={styles.cardTitle}>Sign Up</Text>
            <Text style={styles.cardSubtitle}>Join LeaveX today</Text>
          </View>
          
          <Text style={styles.label}>I am a</Text>
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
            label="Full Name"
            placeholder="Enter your full name"
            value={username}
            onChangeText={setUsername}
            autoCapitalize="words"
          />

          <GlassInput
            label="Email"
            placeholder="your.email@college.edu"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          {selectedRole === 'student' && (
            <>
              <GlassInput
                label="Roll Number"
                placeholder="e.g., CSE2021001"
                value={rollNo}
                onChangeText={setRollNo}
                autoCapitalize="characters"
              />

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Stream</Text>
                <ScrollView 
                  horizontal 
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.streamSelector}
                >
                  {streams.map((streamOption) => (
                    <TouchableOpacity
                      key={streamOption}
                      onPress={() => setStream(streamOption)}
                      activeOpacity={0.7}
                    >
                      <View style={[
                        styles.streamOption,
                        stream === streamOption && styles.streamOptionActive,
                      ]}>
                        <StreamBadge stream={streamOption} />
                      </View>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Year</Text>
                <View style={styles.yearSelector}>
                  {['1', '2', '3', '4'].map((yearOption) => (
                    <TouchableOpacity
                      key={yearOption}
                      onPress={() => setYear(yearOption)}
                      activeOpacity={0.7}
                      style={styles.yearButton}
                    >
                      {year === yearOption ? (
                        <LinearGradient
                          colors={colors.primary.gradient}
                          start={{ x: 0, y: 0 }}
                          end={{ x: 1, y: 1 }}
                          style={styles.yearButtonInner}
                        >
                          <Text style={styles.yearTextActive}>{yearOption}</Text>
                        </LinearGradient>
                      ) : (
                        <View style={styles.yearButtonInactive}>
                          <Text style={styles.yearTextInactive}>{yearOption}</Text>
                        </View>
                      )}
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </>
          )}

          {(selectedRole === 'staff' || selectedRole === 'admin') && (
            <GlassInput
              label="Department"
              placeholder="e.g., Computer Science"
              value={department}
              onChangeText={setDepartment}
              autoCapitalize="words"
            />
          )}

          <GlassInput
            label="Password"
            placeholder="Create a strong password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          <GlassInput
            label="Confirm Password"
            placeholder="Re-enter your password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
          />

          <GlassButton onPress={handleSignup} style={styles.signupButton}>
            Create Account
          </GlassButton>

          <TouchableOpacity onPress={() => router.back()} style={styles.loginLink}>
            <Text style={styles.loginLinkText}>
              Already have an account? <Text style={styles.loginLinkBold}>Sign In</Text>
            </Text>
          </TouchableOpacity>
        </GlassCard>
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
  
  headerTitle: {
    color: colors.text.primary,
    fontSize: typography.sizes.xl,
    fontWeight: typography.weights.bold,
  },
  
  content: {
    padding: spacing.lg,
  },
  
  card: {
    padding: spacing.lg,
  },
  
  cardHeader: {
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  
  icon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  
  cardTitle: {
    color: colors.text.primary,
    fontSize: typography.sizes['2xl'],
    fontWeight: typography.weights.bold,
    marginBottom: spacing.xs,
  },
  
  cardSubtitle: {
    color: colors.text.secondary,
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.medium,
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
  
  inputGroup: {
    marginBottom: spacing.md,
  },
  
  streamSelector: {
    gap: spacing.sm,
  },
  
  streamOption: {
    padding: spacing.xs,
    borderRadius: borderRadius.md,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  
  streamOptionActive: {
    borderColor: colors.primary.main,
    backgroundColor: colors.glass.light,
  },
  
  yearSelector: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  
  yearButton: {
    flex: 1,
  },
  
  yearButtonInner: {
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  yearButtonInactive: {
    backgroundColor: colors.glass.light,
    borderWidth: 1,
    borderColor: colors.glass.border,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  yearTextActive: {
    color: colors.text.primary,
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.bold,
  },
  
  yearTextInactive: {
    color: colors.text.secondary,
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.medium,
  },
  
  signupButton: {
    marginTop: spacing.md,
  },
  
  loginLink: {
    alignItems: 'center',
    marginTop: spacing.md,
  },
  
  loginLinkText: {
    color: colors.text.secondary,
    fontSize: typography.sizes.sm,
  },
  
  loginLinkBold: {
    color: colors.primary.light,
    fontWeight: typography.weights.semibold,
  },
});
