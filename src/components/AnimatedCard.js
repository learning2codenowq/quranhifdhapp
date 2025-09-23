import React, { useRef } from 'react';
import { Animated, TouchableOpacity, StyleSheet } from 'react-native';
import { Theme } from '../styles/theme';

export default function AnimatedCard({ 
  children, 
  onPress, 
  style, 
  disabled = false,
  variant = 'default', // 'default', 'elevated', 'outlined'
  padding = 'default', // 'none', 'small', 'default', 'large'
}) {
  const scaleValue = useRef(new Animated.Value(1)).current;
  const shadowValue = useRef(new Animated.Value(1)).current;

  const animateIn = () => {
    Animated.parallel([
      Animated.spring(scaleValue, {
        toValue: 0.98,
        useNativeDriver: true,
        tension: 300,
        friction: 20,
      }),
      Animated.timing(shadowValue, {
        toValue: 0.5,
        duration: 150,
        useNativeDriver: false,
      }),
    ]).start();
  };

  const animateOut = () => {
    Animated.parallel([
      Animated.spring(scaleValue, {
        toValue: 1,
        useNativeDriver: true,
        tension: 300,
        friction: 20,
      }),
      Animated.timing(shadowValue, {
        toValue: 1,
        duration: 150,
        useNativeDriver: false,
      }),
    ]).start();
  };

  const getCardStyle = () => {
    const baseStyle = {
      ...styles.card,
      ...getPaddingStyle(),
    };

    switch (variant) {
      case 'elevated':
        return {
          ...baseStyle,
          ...Theme.shadows.lg,
          backgroundColor: Theme.colors.white,
        };
      case 'outlined':
        return {
          ...baseStyle,
          backgroundColor: Theme.colors.cardBackground,
          borderWidth: 1,
          borderColor: Theme.colors.gray300,
          ...Theme.shadows.sm,
        };
      default:
        return {
          ...baseStyle,
          backgroundColor: Theme.colors.cardBackground,
          ...Theme.shadows.md,
        };
    }
  };

  const getPaddingStyle = () => {
    switch (padding) {
      case 'none':
        return { padding: 0 };
      case 'small':
        return { padding: Theme.spacing.md };
      case 'large':
        return { padding: Theme.spacing['3xl'] };
      default:
        return { padding: Theme.spacing.xl };
    }
  };

  const shadowOpacity = shadowValue.interpolate({
    inputRange: [0.5, 1],
    outputRange: [0.1, 0.25],
  });

  const elevation = shadowValue.interpolate({
    inputRange: [0.5, 1],
    outputRange: [2, 4],
  });

  if (!onPress) {
    return (
      <Animated.View style={[getCardStyle(), style, { elevation }]}>
        {children}
      </Animated.View>
    );
  }

  return (
    <TouchableOpacity
      activeOpacity={1}
      onPressIn={animateIn}
      onPressOut={animateOut}
      onPress={onPress}
      disabled={disabled}
    >
      <Animated.View
        style={[
          getCardStyle(),
          style,
          {
            transform: [{ scale: scaleValue }],
            elevation,
            shadowOpacity,
          },
        ]}
      >
        {children}
      </Animated.View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: Theme.borderRadius.xl,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
  },
});