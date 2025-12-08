import { StyleSheet } from 'react-native';
import { colors, spacing, borderRadius, shadows } from './theme';

export const glassStyles = StyleSheet.create({
  card: {
    backgroundColor: colors.glass.medium,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.glass.border,
    ...shadows.md,
  },
  
  cardStrong: {
    backgroundColor: colors.glass.strong,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.glass.border,
    ...shadows.lg,
  },
  
  button: {
    backgroundColor: colors.glass.light,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.glass.border,
  },
  
  input: {
    backgroundColor: colors.glass.light,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.glass.border,
    color: colors.text.primary,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
});

export const containerStyles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  
  content: {
    flex: 1,
    paddingHorizontal: spacing.md,
  },
  
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
