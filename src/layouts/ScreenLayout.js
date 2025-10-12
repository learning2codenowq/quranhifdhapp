import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { Theme } from '../styles/theme';
import { useSettings } from '../hooks/useSettings';

/**
 * Standard screen layout wrapper
 * Provides gradient background, safe area, and consistent styling
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.children - Screen content
 * @param {boolean} props.scrollable - Whether content should be scrollable (default: false)
 * @param {boolean} props.showBottomNav - Whether bottom nav is shown (adjusts padding)
 * @param {Array} props.edges - SafeArea edges to apply (default: all)
 * @param {Object} props.contentContainerStyle - Additional styles for ScrollView content
 */
export default function ScreenLayout({ 
  children, 
  scrollable = false,
  showBottomNav = false,
  edges = ['top', 'left', 'right', 'bottom'],
  contentContainerStyle = {}
}) {
  const { settings, themedColors } = useSettings();

  const gradientColors = settings.darkMode 
    ? themedColors.gradients.primary 
    : Theme.gradients.primary;

  const content = scrollable ? (
    <ScrollView 
      style={styles.scrollView}
      contentContainerStyle={[
        styles.scrollContent,
        showBottomNav && styles.scrollContentWithNav,
        contentContainerStyle
      ]}
      showsVerticalScrollIndicator={false}
    >
      {children}
    </ScrollView>
  ) : (
    <View style={[styles.content, showBottomNav && styles.contentWithNav]}>
      {children}
    </View>
  );

  return (
    <SafeAreaProvider>
      <LinearGradient 
        colors={gradientColors} 
        style={styles.container}
      >
        <SafeAreaView style={styles.safeArea} edges={edges}>
          {content}
        </SafeAreaView>
      </LinearGradient>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  contentWithNav: {
    paddingBottom: Theme.layout.bottomTabHeight,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  scrollContentWithNav: {
    paddingBottom: Theme.layout.bottomTabHeight + Theme.spacing.lg,
  },
});