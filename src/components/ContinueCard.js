import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Theme } from '../styles/theme';
import { Icon } from './Icon';

export default function ContinueCard({ segment, onContinue, darkMode = false }) {
  if (!segment) return null;

  const { surahName, startAyah, isNewUser } = segment;

  return (
    <TouchableOpacity 
      style={styles.container}
      onPress={onContinue}
      activeOpacity={0.9}
      accessible={true}
      accessibilityLabel={isNewUser ? "Start memorizing" : `Continue memorizing ${surahName}`}
      accessibilityHint={isNewUser ? "Navigate to surah list" : `Continue from ayah ${startAyah}`}
      accessibilityRole="button"
    >
      <LinearGradient
        colors={['#6B9B7C', '#8FBC9F']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      >
        <View style={styles.content}>
          <Text style={styles.label}>
            {isNewUser ? 'NEXT UP' : 'CONTINUE'}
          </Text>
          <Text style={styles.title}>
            {isNewUser ? 'Start Memorizing' : surahName}
          </Text>
          {!isNewUser && (
            <Text style={styles.subtitle}>
              From Ayah {startAyah}
            </Text>
          )}
          <View style={styles.button}>
            <Text style={styles.buttonText}>Start Session</Text>
            <Icon 
              name="arrow-forward" 
              type="Ionicons" 
              size={20} 
              color="white" 
            />
          </View>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 24,
    overflow: 'hidden',
    ...Theme.shadows.xl,
  },
  gradient: {
    padding: 32,
  },
  content: {
    alignItems: 'flex-start',
  },
  label: {
    fontSize: 12,
    fontWeight: '700',
    color: 'rgba(255, 255, 255, 0.9)',
    letterSpacing: 1.5,
    marginBottom: 12,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: 'white',
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 18,
    color: 'rgba(255, 255, 255, 0.95)',
    marginBottom: 24,
    fontWeight: '500',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    gap: 8,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '700',
    color: 'white',
  },
});