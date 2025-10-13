import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Theme } from '../../styles/theme';

export default function BasmalaCard({ surahId, darkMode, themedColors }) {
  // Don't show Basmala for Surah 1 (Al-Fatiha) or Surah 9 (At-Tawbah)
  const shouldShow = surahId && surahId !== 1 && surahId !== 9;
  
  if (!shouldShow) {
    return null;
  }

  return (
    <View style={styles.container}>
      <View style={[
        styles.card,
        darkMode && { backgroundColor: themedColors.cardBackground }
      ]}>
        <Text style={styles.text}>
          بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 20,
    paddingVertical: 24,
    paddingHorizontal: 20,
    alignItems: 'center',
    ...Theme.shadows.md,
  },
  text: {
    fontFamily: 'UthmanicFont',
    fontSize: 24,
    color: Theme.colors.secondary,
    textAlign: 'center',
    letterSpacing: 1,
  },
});