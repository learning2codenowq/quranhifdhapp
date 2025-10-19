import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Theme, getThemedColors } from '../styles/theme';

export default function JumpLoadingScreen({ darkMode, ayahNumber }) {
  const themedColors = getThemedColors(darkMode);
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Pulse animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  return (
    <LinearGradient
      colors={darkMode ? themedColors.gradients.primary : Theme.gradients.primary}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.content}>
          {/* Animated Circle */}
          <Animated.View
            style={[
              styles.circle,
              {
                backgroundColor: darkMode ? themedColors.secondary : Theme.colors.secondary,
                transform: [{ scale: pulseAnim }],
              },
            ]}
          >
            <Text style={styles.ayahNumber}>{ayahNumber}</Text>
          </Animated.View>

          {/* Loading Text */}
          <Text style={[styles.title, darkMode && { color: themedColors.textPrimary }]}>
            Jumping to Ayah {ayahNumber}
          </Text>
          
          <Text style={[styles.subtitle, darkMode && { color: themedColors.textSecondary }]}>
            Loading ayahs...
          </Text>

          {/* Animated Dots */}
          <View style={styles.dotsContainer}>
            <AnimatedDot delay={0} darkMode={darkMode} />
            <AnimatedDot delay={200} darkMode={darkMode} />
            <AnimatedDot delay={400} darkMode={darkMode} />
          </View>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

const AnimatedDot = ({ delay, darkMode }) => {
  const themedColors = getThemedColors(darkMode);
  const animValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.delay(delay),
        Animated.timing(animValue, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(animValue, {
          toValue: 0,
          duration: 600,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const opacity = animValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 1],
  });

  return (
    <Animated.View
      style={[
        styles.dot,
        {
          opacity,
          backgroundColor: darkMode ? themedColors.secondary : Theme.colors.secondary,
        },
      ]}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  circle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 32,
    ...Theme.shadows.xl,
  },
  ayahNumber: {
    fontSize: 48,
    fontWeight: '700',
    color: 'white',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: 'white',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '500',
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    marginBottom: 32,
  },
  dotsContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
});