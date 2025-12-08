import React from 'react';
import { TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { colors, shadows } from '@/constants/theme';

interface FloatingActionButtonProps {
  onPress: () => void;
  icon?: keyof typeof Ionicons.glyphMap;
}

export function FloatingActionButton({ onPress, icon = 'add' }: FloatingActionButtonProps) {
  return (
    <TouchableOpacity 
      onPress={onPress} 
      style={styles.container}
      activeOpacity={0.8}
    >
      <LinearGradient
        colors={colors.primary.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.button}
      >
        <Ionicons name={icon} size={28} color={colors.text.primary} />
      </LinearGradient>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: Platform.select({ ios: 24, android: 24, default: 24 }),
    right: 24,
    zIndex: 999,
  },
  
  button: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.xl,
  },
});
