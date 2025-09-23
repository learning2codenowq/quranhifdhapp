import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Theme } from '../styles/theme';

export default function AnimatedCard({ 
  children, 
  onPress, 
  style, 
  disabled = false,
  variant = 'default', // 'default', 'elevated', 'outlined'
  padding = 'default', // 'none', 'small', 'default', 'large'
}) {
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

  if (!onPress) {
    return (
      <View style={[getCardStyle(), style]}>
        {children}
      </View>
    );
  }

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      disabled={disabled}
    >
      <View style={[getCardStyle(), style]}>
        {children}
      </View>
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