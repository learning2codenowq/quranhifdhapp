import React, { useRef } from 'react';
import { Animated, TouchableOpacity, StyleSheet } from 'react-native';

export default function AnimatedCard({ children, onPress, style, disabled = false }) {
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
      <Animated.View style={[styles.card, style, { elevation }]}>
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
          styles.card,
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
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 15,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 4,
  },
});