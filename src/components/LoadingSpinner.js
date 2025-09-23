import React, { useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Animated, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Theme } from '../styles/theme';

export default function LoadingSpinner({ 
  message = 'Loading...', 
  visible = true,
  variant = 'overlay' // 'overlay', 'inline', 'minimal'
}) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 100,
          friction: 8,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }).start();
    }
  }, [visible]);

  if (!visible) return null;

  if (variant === 'minimal') {
    return (
      <View style={styles.minimalContainer}>
        <ActivityIndicator size="small" color={Theme.colors.primary} />
      </View>
    );
  }

  if (variant === 'inline') {
    return (
      <Animated.View 
        style={[
          styles.inlineContainer,
          { opacity: fadeAnim, transform: [{ scale: scaleAnim }] }
        ]}
      >
        <ActivityIndicator size="large" color={Theme.colors.secondary} />
        <Text style={styles.inlineMessage}>{message}</Text>
      </Animated.View>
    );
  }

  return (
    <Animated.View 
      style={[
        styles.overlay,
        { opacity: fadeAnim }
      ]}
    >
      <LinearGradient 
        colors={Theme.gradients.primary} 
        style={[
          styles.container,
          { transform: [{ scale: scaleAnim }] }
        ]}
      >
        <ActivityIndicator size="large" color={Theme.colors.secondary} />
        <Text style={styles.message}>{message}</Text>
      </LinearGradient>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: Theme.colors.overlay,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9999,
  },
  container: {
    paddingVertical: Theme.spacing['3xl'],
    paddingHorizontal: Theme.spacing['4xl'],
    borderRadius: Theme.borderRadius.xl,
    alignItems: 'center',
    minWidth: 150,
    ...Theme.shadows.lg,
  },
  message: {
    color: Theme.colors.textOnDark,
    fontSize: Theme.typography.fontSize.base,
    marginTop: Theme.spacing.lg,
    textAlign: 'center',
    fontWeight: Theme.typography.fontWeight.medium,
  },
  inlineContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Theme.spacing.xl,
  },
  inlineMessage: {
    color: Theme.colors.textPrimary,
    fontSize: Theme.typography.fontSize.base,
    marginLeft: Theme.spacing.md,
    fontWeight: Theme.typography.fontWeight.medium,
  },
  minimalContainer: {
    padding: Theme.spacing.sm,
    alignItems: 'center',
  },
});