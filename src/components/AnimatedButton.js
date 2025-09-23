import React from 'react';
import { TouchableOpacity, Text, StyleSheet, Vibration, View } from 'react-native';
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
  const handlePress = () => {
    if (!disabled && !loading) {
      if (hapticFeedback) {
        Vibration.vibrate(50);
      }
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
        <View style={styles.loadingContainer}>
          <Text style={[getTextStyle(), textStyle]}>Loading...</Text>
        </View>
      );
    }

    return (
      <View style={styles.contentContainer}>
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
      </View>
    );
  };

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={handlePress}
      disabled={disabled || loading}
      style={[getButtonStyle(), style, { opacity: disabled ? 0.5 : 1 }]}
    >
      {renderContent()}
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