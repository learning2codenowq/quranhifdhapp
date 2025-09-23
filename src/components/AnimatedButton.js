import React, { useRef } from 'react';
import { Animated, TouchableOpacity, Text, StyleSheet, Vibration } from 'react-native';
import { Theme } from '../styles/theme';
import { Icon } from './Icon';

export default function AnimatedButton({ 
  title, 
  onPress, 
  style, 
  textStyle, 
  disabled = false,
  hapticFeedback = true,
  variant = 'primary', // 'primary', 'secondary', 'success', 'outline'
  size = 'medium', // 'small', 'medium', 'large'
  icon = null, // { name: 'play', type: 'Ionicons' }
  iconPosition = 'left', // 'left', 'right'
  loading = false,
}) {
  const scaleValue = useRef(new Animated.Value(1)).current;
  const opacityValue = useRef(new Animated.Value(1)).current;

  const animatePress = () => {
    if (hapticFeedback && !disabled) {
      Vibration.vibrate(50);
    }

    Animated.parallel([
      Animated.spring(scaleValue, {
        toValue: 0.96,
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
    if (!disabled && !loading) {
      animatePress();
      setTimeout(() => onPress && onPress(), 50);
    }
  };

  const getButtonStyle = () => {
    const baseStyle = {
      ...styles.button,
      ...getSizeStyle(),
    };

    switch (variant) {
      case 'secondary':
        return {
          ...baseStyle,
          backgroundColor: Theme.colors.secondary,
        };
      case 'success':
        return {
          ...baseStyle,
          backgroundColor: Theme.colors.success,
        };
      case 'outline':
        return {
          ...baseStyle,
          backgroundColor: 'transparent',
          borderWidth: 2,
          borderColor: Theme.colors.primary,
        };
      default:
        return {
          ...baseStyle,
          backgroundColor: Theme.colors.primary,
        };
    }
  };

  const getSizeStyle = () => {
    switch (size) {
      case 'small':
        return {
          paddingVertical: Theme.spacing.sm,
          paddingHorizontal: Theme.spacing.lg,
          borderRadius: Theme.borderRadius.lg,
        };
      case 'large':
        return {
          paddingVertical: Theme.spacing.xl,
          paddingHorizontal: Theme.spacing['3xl'],
          borderRadius: Theme.borderRadius.full,
        };
      default:
        return {
          paddingVertical: Theme.spacing.md,
          paddingHorizontal: Theme.spacing.xl,
          borderRadius: Theme.borderRadius.full,
        };
    }
  };

  const getTextStyle = () => {
    const baseStyle = {
      ...styles.text,
      ...getSizeTextStyle(),
    };

    const isOutline = variant === 'outline';
    return {
      ...baseStyle,
      color: isOutline ? Theme.colors.primary : Theme.colors.textOnPrimary,
    };
  };

  const getSizeTextStyle = () => {
    switch (size) {
      case 'small':
        return {
          fontSize: Theme.typography.fontSize.sm,
        };
      case 'large':
        return {
          fontSize: Theme.typography.fontSize.lg,
        };
      default:
        return {
          fontSize: Theme.typography.fontSize.base,
        };
    }
  };

  const getIconColor = () => {
    return variant === 'outline' ? Theme.colors.primary : Theme.colors.textOnPrimary;
  };

  const getIconSize = () => {
    switch (size) {
      case 'small': return 16;
      case 'large': return 24;
      default: return 20;
    }
  };

  const renderContent = () => {
    if (loading) {
      return (
        <Animated.View style={styles.loadingContainer}>
          <Text style={[getTextStyle(), textStyle]}>Loading...</Text>
        </Animated.View>
      );
    }

    return (
      <Animated.View style={styles.contentContainer}>
        {icon && iconPosition === 'left' && (
          <Icon 
            name={icon.name}
            type={icon.type}
            size={getIconSize()}
            color={getIconColor()}
            style={styles.iconLeft}
          />
        )}
        
        <Text style={[getTextStyle(), textStyle]}>
          {title}
        </Text>
        
        {icon && iconPosition === 'right' && (
          <Icon 
            name={icon.name}
            type={icon.type}
            size={getIconSize()}
            color={getIconColor()}
            style={styles.iconRight}
          />
        )}
      </Animated.View>
    );
  };

  return (
    <TouchableOpacity
      activeOpacity={1}
      onPress={handlePress}
      disabled={disabled || loading}
    >
      <Animated.View
        style={[
          getButtonStyle(),
          style,
          {
            transform: [{ scale: scaleValue }],
            opacity: disabled ? 0.5 : opacityValue,
          },
        ]}
      >
        {renderContent()}
      </Animated.View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    ...Theme.shadows.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontWeight: Theme.typography.fontWeight.semibold,
    textAlign: 'center',
  },
  contentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconLeft: {
    marginRight: Theme.spacing.sm,
  },
  iconRight: {
    marginLeft: Theme.spacing.sm,
  },
});