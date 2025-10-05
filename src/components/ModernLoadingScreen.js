import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Easing } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Theme, getThemedColors } from '../styles/theme';

export default function ModernLoadingScreen({ darkMode = false, message = 'Loading...', subtitle = 'Please wait', progress = null }) {
  const themedColors = getThemedColors(darkMode);
  
  // Animation values
  const spinValue = useRef(new Animated.Value(0)).current;
  const pulseValue = useRef(new Animated.Value(1)).current;
  const fadeValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Spinning animation
    Animated.loop(
      Animated.timing(spinValue, {
        toValue: 1,
        duration: 1500,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();

    // Pulsing animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseValue, {
          toValue: 1.2,
          duration: 800,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulseValue, {
          toValue: 1,
          duration: 800,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Fade in animation
    Animated.timing(fadeValue, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, []);

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <LinearGradient
      colors={darkMode ? themedColors.gradients.primary : Theme.gradients.primary}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea}>
        <Animated.View style={[styles.content, { opacity: fadeValue }]}>
          {/* Animated Loader */}
          <View style={styles.loaderContainer}>
            {/* Outer Ring */}
            <Animated.View
              style={[
                styles.outerRing,
                {
                  transform: [{ rotate: spin }, { scale: pulseValue }],
                  borderColor: darkMode ? themedColors.secondary : Theme.colors.secondary,
                },
              ]}
            />
            
            {/* Inner Circle */}
            <View
              style={[
                styles.innerCircle,
                {
                  backgroundColor: darkMode ? themedColors.secondary : Theme.colors.secondary,
                },
              ]}
            >
              <Text style={styles.iconText}>📖</Text>
            </View>
          </View>

          {/* Loading Text */}
          <View style={styles.textContainer}>
            <Text style={[styles.loadingTitle, darkMode && { color: themedColors.textPrimary }]}>
              {message}
            </Text>
            <Text style={[styles.loadingSubtitle, darkMode && { color: themedColors.textSecondary }]}>
  {subtitle}
</Text>
{progress && (
  <Text style={[styles.progressText, darkMode && { color: themedColors.textMuted }]}>
    {progress}
  </Text>
)}
          </View>

          {/* Animated Dots */}
          <View style={styles.dotsContainer}>
            {[0, 1, 2].map((index) => (
              <AnimatedDot key={index} delay={index * 200} darkMode={darkMode} />
            ))}
          </View>
        </Animated.View>
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

  const scale = animValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0.8, 1.2],
  });

  return (
    <Animated.View
      style={[
        styles.dot,
        {
          opacity,
          transform: [{ scale }],
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
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  loaderContainer: {
    width: 140,
    height: 140,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
  },
  outerRing: {
    position: 'absolute',
    width: 140,
    height: 140,
    borderRadius: 70,
    borderWidth: 4,
    borderStyle: 'solid',
    borderTopColor: 'transparent',
    borderRightColor: 'transparent',
  },
  innerCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  iconText: {
    fontSize: 40,
  },
  textContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  loadingTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: Theme.colors.textOnDark,
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  loadingSubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    letterSpacing: 0.3,
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
  progressText: {
  fontSize: 14,
  color: 'rgba(255, 255, 255, 0.6)',
  marginTop: 8,
  fontStyle: 'italic',
},
});