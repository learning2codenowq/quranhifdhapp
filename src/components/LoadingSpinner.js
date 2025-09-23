import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Theme } from '../styles/theme';

export default function LoadingSpinner({ 
  message = 'Loading...', 
  visible = true,
  variant = 'overlay' // 'overlay', 'inline', 'minimal'
}) {
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
      <View style={styles.inlineContainer}>
        <ActivityIndicator size="large" color={Theme.colors.secondary} />
        <Text style={styles.inlineMessage}>{message}</Text>
      </View>
    );
  }

  return (
    <View style={styles.overlay}>
      <LinearGradient 
        colors={Theme.gradients.primary} 
        style={styles.container}
      >
        <ActivityIndicator size="large" color={Theme.colors.secondary} />
        <Text style={styles.message}>{message}</Text>
      </LinearGradient>
    </View>
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