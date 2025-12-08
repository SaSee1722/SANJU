import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions, TouchableOpacity, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { GlassCard } from '@/components/ui/GlassCard';
import { colors, spacing, typography, borderRadius, shadows } from '@/constants/theme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface OnboardingSlide {
  icon: keyof typeof Ionicons.glyphMap;
  gradient: string[];
  title: string;
  description: string;
  features: string[];
}

const slides: OnboardingSlide[] = [
  {
    icon: 'rocket-outline',
    gradient: ['#8b5cf6', '#7c3aed'],
    title: 'Welcome to LeaveX',
    description: 'The most advanced leave management system for engineering colleges',
    features: ['Smart Approvals', 'Real-time Tracking', 'Instant Notifications'],
  },
  {
    icon: 'sparkles-outline',
    gradient: ['#3b82f6', '#8b5cf6'],
    title: 'Streamlined Workflow',
    description: 'Apply for leave in seconds, track status in real-time',
    features: ['Quick Application', 'Multi-level Approval', 'Document Upload'],
  },
  {
    icon: 'shield-checkmark-outline',
    gradient: ['#10b981', '#14b8a6'],
    title: 'Secure & Reliable',
    description: 'Your data is encrypted and protected with enterprise-grade security',
    features: ['End-to-end Encryption', 'Role-based Access', 'Audit Trail'],
  },
];

export default function OnboardingScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const scrollViewRef = useRef<ScrollView>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handleScroll = (event: any) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(offsetX / SCREEN_WIDTH);
    setCurrentIndex(index);
  };

  const handleNext = () => {
    if (currentIndex < slides.length - 1) {
      scrollViewRef.current?.scrollTo({
        x: (currentIndex + 1) * SCREEN_WIDTH,
        animated: true,
      });
    } else {
      handleGetStarted();
    }
  };

  const handleSkip = () => {
    handleGetStarted();
  };

  const handleGetStarted = () => {
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start(() => {
      router.replace('/login');
    });
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <LinearGradient
        colors={[colors.background.primary, colors.background.secondary, colors.background.primary]}
        style={StyleSheet.absoluteFill}
      />

      {currentIndex < slides.length - 1 && (
        <TouchableOpacity onPress={handleSkip} style={styles.skipButton}>
          <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity>
      )}

      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={handleScroll}
        scrollEventThrottle={16}
      >
        {slides.map((slide, index) => (
          <View key={index} style={[styles.slide, { width: SCREEN_WIDTH }]}>
            <View style={styles.slideContent}>
              <LinearGradient
                colors={slide.gradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.iconContainer}
              >
                <View style={styles.iconGlow}>
                  <Ionicons name={slide.icon} size={80} color={colors.text.primary} />
                </View>
              </LinearGradient>

              <Text style={styles.title}>{slide.title}</Text>
              <Text style={styles.description}>{slide.description}</Text>

              <View style={styles.features}>
                {slide.features.map((feature, idx) => (
                  <GlassCard key={idx} style={styles.featureCard}>
                    <View style={styles.featureContent}>
                      <View style={styles.featureIconContainer}>
                        <LinearGradient
                          colors={slide.gradient}
                          start={{ x: 0, y: 0 }}
                          end={{ x: 1, y: 1 }}
                          style={styles.featureIcon}
                        >
                          <Ionicons name="checkmark" size={16} color={colors.text.primary} />
                        </LinearGradient>
                      </View>
                      <Text style={styles.featureText}>{feature}</Text>
                    </View>
                  </GlassCard>
                ))}
              </View>
            </View>
          </View>
        ))}
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, spacing.lg) }]}>
        <View style={styles.pagination}>
          {slides.map((_, index) => (
            <View
              key={index}
              style={[
                styles.paginationDot,
                index === currentIndex && styles.paginationDotActive,
              ]}
            >
              {index === currentIndex && (
                <LinearGradient
                  colors={slides[currentIndex].gradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={StyleSheet.absoluteFill}
                />
              )}
            </View>
          ))}
        </View>

        <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
          <TouchableOpacity onPress={handleNext} activeOpacity={0.9}>
            <LinearGradient
              colors={slides[currentIndex].gradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.button}
            >
              <Text style={styles.buttonText}>
                {currentIndex === slides.length - 1 ? 'Get Started' : 'Next'}
              </Text>
              <Ionicons
                name={currentIndex === slides.length - 1 ? 'arrow-forward' : 'chevron-forward'}
                size={24}
                color={colors.text.primary}
              />
            </LinearGradient>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },

  skipButton: {
    position: 'absolute',
    top: spacing.lg,
    right: spacing.lg,
    zIndex: 10,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: colors.glass.light,
    borderRadius: borderRadius.full,
    borderWidth: 1,
    borderColor: colors.glass.border,
  },

  skipText: {
    color: colors.text.secondary,
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.semibold,
  },

  slide: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  slideContent: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
    gap: spacing.lg,
  },

  iconContainer: {
    width: 180,
    height: 180,
    borderRadius: 90,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.xl,
  },

  iconGlow: {
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  title: {
    color: colors.text.primary,
    fontSize: typography.sizes['3xl'],
    fontWeight: typography.weights.bold,
    textAlign: 'center',
    marginTop: spacing.lg,
  },

  description: {
    color: colors.text.secondary,
    fontSize: typography.sizes.base,
    textAlign: 'center',
    lineHeight: typography.sizes.base * typography.lineHeights.relaxed,
    paddingHorizontal: spacing.md,
  },

  features: {
    width: '100%',
    gap: spacing.sm,
    marginTop: spacing.md,
  },

  featureCard: {
    padding: spacing.md,
  },

  featureContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },

  featureIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    overflow: 'hidden',
  },

  featureIcon: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  featureText: {
    flex: 1,
    color: colors.text.primary,
    fontSize: typography.sizes.base,
    fontWeight: typography.weights.medium,
  },

  footer: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    gap: spacing.lg,
  },

  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.sm,
  },

  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.glass.border,
    overflow: 'hidden',
  },

  paginationDotActive: {
    width: 32,
  },

  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    borderRadius: borderRadius.xl,
    ...shadows.lg,
  },

  buttonText: {
    color: colors.text.primary,
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.bold,
  },
});
