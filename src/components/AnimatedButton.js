import React, { useRef } from 'react';
import { Animated, TouchableOpacity, Text, StyleSheet, Vibration } from 'react-native';

export default function AnimatedButton({ 
  title, 
  onPress, 
  style, 
  textStyle, 
  disabled = false,
  hapticFeedback = true,
  variant = 'primary' // primary, secondary, success
}) {
  const scaleValue = useRef(new Animated.Value(1)).current;
  const opacityValue = useRef(new Animated.Value(1)).current;

  const animatePress = () => {
    if (hapticFeedback) {
      Vibration.vibrate(50); // Light haptic feedback
    }

    Animated.parallel([
      Animated.spring(scaleValue, {
        toValue: 0.95,
        useNativeDriver: true,
        tension: 300,
        friction: 10,
      }),
      Animated.timing(opacityValue, {
        toValue: 0.8,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start(() => {
      Animated.parallel([
        Animated.spring(scaleValue, {
          toValue: 1,
          useNativeDriver: true,
          tension: 300,
          friction: 10,
        }),
        Animated.timing(opacityValue, {
          toValue: 1,
          duration: 100,
          useNativeDriver: true,
        }),
      ]).start();
    });
  };

  const handlePress = () => {
    if (!disabled) {
      animatePress();
      setTimeout(() => onPress && onPress(), 50);
    }
  };

  const getButtonStyle = () => {
    switch (variant) {
      case 'secondary':
        return styles.secondaryButton;
      case 'success':
        return styles.successButton;
      default:
        return styles.primaryButton;
    }
  };

  const getTextStyle = () => {
    switch (variant) {
      case 'secondary':
        return styles.secondaryText;
      default:
        return styles.primaryText;
    }
  };

  return (
    <TouchableOpacity
      activeOpacity={1}
      onPress={handlePress}
      disabled={disabled}
    >
      <Animated.View
        style={[
          styles.button,
          getButtonStyle(),
          style,
          {
            transform: [{ scale: scaleValue }],
            opacity: disabled ? 0.5 : opacityValue,
          },
        ]}
      >
        <Text style={[styles.text, getTextStyle(), textStyle]}>
          {title}
        </Text>
      </Animated.View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 25,
    paddingVertical: 15,
    paddingHorizontal: 30,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButton: {
    backgroundColor: '#d4af37',
  },
  secondaryButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.5)',
  },
  successButton: {
    backgroundColor: '#009c4a',
  },
  text: {
    fontSize: 16,
    fontWeight: '600',
  },
  primaryText: {
    color: 'white',
  },
  secondaryText: {
    color: 'white',
  },
});