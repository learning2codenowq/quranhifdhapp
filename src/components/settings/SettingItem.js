import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Theme } from '../../styles/theme';

export default function SettingItem({ 
  title, 
  subtitle, 
  onPress, 
  rightComponent, 
  dangerous = false,
  darkMode = false,
  themedColors = {}
}) {
  return (
    <TouchableOpacity
      style={[
        styles.settingItem, 
        dangerous && styles.dangerousItem,
        darkMode && !dangerous && { backgroundColor: themedColors.cardBackground }
      ]}
      onPress={onPress}
      disabled={!onPress}
      accessible={true}
      accessibilityLabel={title}
      accessibilityHint={subtitle}
      accessibilityRole="button"
    >
      <View style={styles.settingContent}>
        <Text style={[
          styles.settingTitle, 
          dangerous && styles.dangerousText,
          darkMode && !dangerous && { color: themedColors.textPrimary }
        ]}>
          {title}
        </Text>
        <Text style={[
          styles.settingSubtitle, 
          dangerous && { color: 'rgba(255, 255, 255, 0.8)' },
          darkMode && !dangerous && { color: themedColors.textSecondary }
        ]}>
          {subtitle}
        </Text>
      </View>
      {rightComponent || (
        <Text style={[
          styles.settingArrow, 
          dangerous && { color: 'white' },
          darkMode && !dangerous && { color: themedColors.secondary }
        ]}>
          →
        </Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  settingItem: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: Theme.borderRadius.lg,
    padding: Theme.spacing.lg,
    marginBottom: Theme.spacing.md,
    alignItems: 'center',
    ...Theme.shadows.sm,
  },
  dangerousItem: {
    backgroundColor: '#ff3b30',
    borderWidth: 1,
    borderColor: '#ff3b30',
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Theme.colors.primary,
    marginBottom: 2,
  },
  dangerousText: {
    color: 'white',
  },
  settingSubtitle: {
    fontSize: 14,
    color: '#666',
  },
  settingArrow: {
    fontSize: 18,
    color: Theme.colors.secondary,
    fontWeight: 'bold',
  },
});