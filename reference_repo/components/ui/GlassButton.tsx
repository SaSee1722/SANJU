import React, { ReactNode } from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, borderRadius, spacing, typography, shadows } from '@/constants/theme';

interface GlassButtonProps {
  children: ReactNode;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline';
  style?: ViewStyle;
  disabled?: boolean;
  loading?: boolean;
}

export function GlassButton({ 
  children, 
  onPress, 
  variant = 'primary', 
  style, 
  disabled = false,
  loading = false 
}: GlassButtonProps) {
  if (variant === 'primary') {
    return (
      <TouchableOpacity 
        onPress={onPress} 
        disabled={disabled || loading}
        activeOpacity={0.8}
        style={style}
      >
        <LinearGradient
          colors={colors.primary.gradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.button, disabled && styles.disabled]}
        >
          {loading ? (
            <ActivityIndicator color={colors.text.primary} />
          ) : (
            <Text style={styles.primaryText}>{children}</Text>
          )}
        </LinearGradient>
      </TouchableOpacity>
    );
  }

  if (variant === 'outline') {
    return (
      <TouchableOpacity 
        onPress={onPress} 
        disabled={disabled || loading}
        activeOpacity={0.7}
        style={[styles.outlineButton, style, disabled && styles.disabled]}
      >
        {loading ? (
          <ActivityIndicator color={colors.primary.main} />
        ) : (
          <Text style={styles.outlineText}>{children}</Text>
        )}
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity 
      onPress={onPress} 
      disabled={disabled || loading}
      activeOpacity={0.7}
      style={[styles.secondaryButton, style, disabled && styles.disabled]}
    >
      {loading ? (
        <ActivityIndicator color={colors.text.primary} />
      ) : (
        <Text style={styles.secondaryText}>{children}</Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
    ...shadows.md,
  },
  
  secondaryButton: {
    backgroundColor: colors.glass.medium,
    borderWidth: 1,
    borderColor: colors.glass.border,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
  },
  
  outlineButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.primary.main,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
  },
  
  primaryText: {
    color: colors.text.primary,
    fontSize: typography.sizes.base,
    fontWeight: typography.weights.semibold,
  },
  
  secondaryText: {
    color: colors.text.primary,
    fontSize: typography.sizes.base,
    fontWeight: typography.weights.medium,
  },
  
  outlineText: {
    color: colors.primary.main,
    fontSize: typography.sizes.base,
    fontWeight: typography.weights.medium,
  },
  
  disabled: {
    opacity: 0.5,
  },
});
