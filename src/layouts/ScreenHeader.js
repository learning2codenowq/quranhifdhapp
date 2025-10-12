import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Icon, AppIcons } from '../components/Icon';
import { Theme } from '../styles/theme';
import { useSettings } from '../hooks/useSettings';

/**
 * Reusable screen header component
 * 
 * @param {Object} props
 * @param {string} props.title - Main title text
 * @param {string} props.subtitle - Optional subtitle text
 * @param {Function} props.onBack - Back button handler
 * @param {React.ReactNode} props.rightComponent - Optional right side component
 * @param {boolean} props.showBackButton - Show/hide back button (default: true)
 */
export default function ScreenHeader({ 
  title, 
  subtitle, 
  onBack,
  rightComponent,
  showBackButton = true
}) {
  const { settings, themedColors } = useSettings();

  return (
    <View style={styles.header}>
      {showBackButton && (
        <TouchableOpacity 
          style={styles.backButton}
          onPress={onBack}
          accessible={true}
          accessibilityLabel="Go back"
          accessibilityRole="button"
        >
          <Icon 
            name={AppIcons.back.name} 
            type={AppIcons.back.type} 
            size={24} 
            color={Theme.colors.textOnDark} 
          />
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>
      )}
      
      <View style={styles.headerCenter}>
        <Text style={styles.headerTitle}>{title}</Text>
        {subtitle && (
          <Text style={[
            styles.headerSubtitle,
            settings.darkMode && { color: themedColors.textSecondary }
          ]}>
            {subtitle}
          </Text>
        )}
      </View>

      <View style={styles.rightSection}>
        {rightComponent || <View style={styles.placeholder} />}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Theme.spacing.lg,
    paddingVertical: Theme.spacing.md,
    minHeight: 60,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Theme.spacing.sm,
    minWidth: 80,
  },
  backText: {
    color: Theme.colors.textOnDark,
    fontSize: Theme.typography.fontSize.base,
    marginLeft: Theme.spacing.xs,
    fontWeight: Theme.typography.fontWeight.medium,
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: Theme.typography.fontSize['2xl'],
    fontWeight: Theme.typography.fontWeight.bold,
    color: Theme.colors.textOnDark,
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: Theme.typography.fontSize.sm,
    color: Theme.colors.textOnDark,
    opacity: 0.8,
    marginTop: Theme.spacing.xs,
    textAlign: 'center',
  },
  rightSection: {
    minWidth: 80,
    alignItems: 'flex-end',
  },
  placeholder: {
    width: 24,
  },
});