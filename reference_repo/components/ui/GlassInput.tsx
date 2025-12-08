import React from 'react';
import { TextInput, StyleSheet, TextInputProps, View, Text } from 'react-native';
import { colors, borderRadius, spacing, typography } from '@/constants/theme';

interface GlassInputProps extends TextInputProps {
  label?: string;
  error?: string;
}

export function GlassInput({ label, error, style, ...props }: GlassInputProps) {
  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <TextInput
        style={[styles.input, error && styles.inputError, style]}
        placeholderTextColor={colors.text.tertiary}
        {...props}
      />
      {error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.md,
  },
  
  label: {
    color: colors.text.secondary,
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.medium,
    marginBottom: spacing.xs,
  },
  
  input: {
    backgroundColor: colors.glass.light,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.glass.border,
    color: colors.text.primary,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    fontSize: typography.sizes.base,
    minHeight: 48,
  },
  
  inputError: {
    borderColor: colors.error,
  },
  
  error: {
    color: colors.error,
    fontSize: typography.sizes.xs,
    marginTop: spacing.xs,
  },
});
