import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Theme, getThemedColors } from '../styles/theme';
import { Icon, AppIcons } from './Icon';

export default function ContinueCard({ segment, onContinue, darkMode = false }) {
  if (!segment) return null;

  const { surahName, startAyah, endAyah, totalAyahs, isNewUser, lastMemorized } = segment;
  const themedColors = getThemedColors(darkMode);

  return (
    <TouchableOpacity 
      style={styles.container}
      onPress={onContinue}
      activeOpacity={0.9}
      accessible={true}
      accessibilityLabel="Continue memorization"
      accessibilityHint={`Continue memorizing ${surahName} from ayah ${startAyah}`}
      accessibilityRole="button"
    >
      <LinearGradient
        colors={darkMode ? [themedColors.surface, themedColors.cardBackground] : ['#6B9B7C', '#8FBC9F']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      >
        <View style={styles.content}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.iconContainer}>
              <Icon 
                name="play-circle" 
                type="Ionicons" 
                size={28} 
                color={darkMode ? themedColors.primary : "white"} 
              />
            </View>
            <Text style={[
              styles.title,
              darkMode && { color: themedColors.textPrimary }
            ]}>
              {isNewUser ? 'Start Your Journey' : 'Continue Where You Left Off'}
            </Text>
          </View>

          {/* Main Content */}
          <View style={styles.mainContent}>
            <Text style={[
              styles.surahName,
              darkMode && { color: themedColors.textPrimary }
            ]}>{surahName}</Text>
            
            {!isNewUser && (
              <Text style={[
                styles.lastMemorized,
                darkMode && { color: themedColors.textSecondary }
              ]}>
                Last memorized: Ayah {lastMemorized}
              </Text>
            )}
          </View>

          {/* Action Button */}
          <View style={styles.actionContainer}>
            <View style={[
              styles.button,
              darkMode && { backgroundColor: themedColors.primary }
            ]}>
              <Text style={[
                styles.buttonText,
                darkMode && { color: themedColors.textOnPrimary }
              ]}>
                {isNewUser ? 'Begin Memorizing' : 'Continue'}
              </Text>
              <Icon 
                name="arrow-forward" 
                type="Ionicons" 
                size={20} 
                color={darkMode ? themedColors.textOnPrimary : Theme.colors.success} 
              />
            </View>
          </View>
        </View>

        {/* Decorative corner accent */}
        <View style={[
          styles.cornerAccent,
          darkMode && { backgroundColor: 'rgba(255, 255, 255, 0.05)' }
        ]} />
      </LinearGradient>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
    borderRadius: 20,
    overflow: 'hidden',
    ...Theme.shadows.lg,
  },
  gradient: {
    borderRadius: 20,
    position: 'relative',
    overflow: 'hidden',
  },
  content: {
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  iconContainer: {
    marginRight: 12,
  },
  title: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
    letterSpacing: 0.3,
  },
  mainContent: {
    marginBottom: 16,
  },
  surahName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  lastMemorized: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.85)',
    marginBottom: 12,
    fontStyle: 'italic',
  },
  actionContainer: {
    alignItems: 'flex-end',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    gap: 8,
    ...Theme.shadows.md,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '700',
    color: Theme.colors.success,
    letterSpacing: 0.3,
  },
  cornerAccent: {
    position: 'absolute',
    top: -30,
    right: -30,
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
});