// src/screens/ReadingScreen.js
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { Theme } from '../styles/theme';
import { Icon } from '../components/Icon';

export default function ReadingScreen({ navigation }) {
  const readingModes = [
    {
      id: 'classic',
      title: 'Classic Mushaf',
      subtitle: 'Traditional page-by-page reading',
      description: '604 pages • Uthmani script',
      icon: 'book',
      color: Theme.colors.primary,
      gradient: ['#22575D', '#55BAC6'],
      screen: 'ClassicMushaf'
    },
    {
      id: 'wordbyword',
      title: 'Word by Word',
      subtitle: 'Interlinear translation',
      description: 'Coming soon',
      icon: 'language',
      color: Theme.colors.secondary,
      gradient: ['#B8947D', '#D4C4B0'],
      screen: null,
      disabled: true
    }
  ];

  const handleModePress = (mode) => {
    if (mode.disabled) {
      return;
    }
    navigation.navigate(mode.screen);
  };

  return (
    <SafeAreaProvider>
      <LinearGradient colors={Theme.gradients.primary} style={styles.container}>
        <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right', 'bottom']}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Quran Reading</Text>
            <Text style={styles.headerSubtitle}>Choose your reading mode</Text>
          </View>

          <ScrollView 
            style={styles.content} 
            contentContainerStyle={styles.contentContainer}
            showsVerticalScrollIndicator={false}
          >
            {readingModes.map((mode) => (
              <TouchableOpacity
                key={mode.id}
                style={styles.modeCardWrapper}
                onPress={() => handleModePress(mode)}
                activeOpacity={mode.disabled ? 1 : 0.8}
                disabled={mode.disabled}
              >
                <LinearGradient
                  colors={mode.gradient}
                  style={[styles.modeCard, mode.disabled && styles.disabledCard]}
                >
                  <View style={styles.modeIconContainer}>
                    <Icon 
                      name={mode.icon} 
                      type="Ionicons" 
                      size={48} 
                      color="white" 
                    />
                  </View>
                  
                  <View style={styles.modeContent}>
                    <Text style={styles.modeTitle}>{mode.title}</Text>
                    <Text style={styles.modeSubtitle}>{mode.subtitle}</Text>
                    <Text style={styles.modeDescription}>{mode.description}</Text>
                  </View>

                  {!mode.disabled && (
                    <View style={styles.modeArrow}>
                      <Icon 
                        name="chevron-forward" 
                        type="Ionicons" 
                        size={24} 
                        color="rgba(255, 255, 255, 0.8)" 
                      />
                    </View>
                  )}

                  {mode.disabled && (
                    <View style={styles.comingSoonBadge}>
                      <Text style={styles.comingSoonText}>Coming Soon</Text>
                    </View>
                  )}
                </LinearGradient>
              </TouchableOpacity>
            ))}

            <View style={styles.infoCard}>
              <Icon 
                name="information-circle" 
                type="Ionicons" 
                size={24} 
                color={Theme.colors.secondary} 
                style={styles.infoIcon}
              />
              <Text style={styles.infoText}>
                Choose a reading mode to begin your Quran journey. Each mode offers a unique way to engage with the sacred text.
              </Text>
            </View>
          </ScrollView>
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
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 30,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  modeCardWrapper: {
    marginBottom: 20,
  },
  modeCard: {
    borderRadius: 20,
    padding: 24,
    minHeight: 140,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    position: 'relative',
  },
  disabledCard: {
    opacity: 0.6,
  },
  modeIconContainer: {
    position: 'absolute',
    top: 24,
    right: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 20,
    padding: 16,
  },
  modeContent: {
    flex: 1,
    paddingRight: 100,
  },
  modeTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8,
  },
  modeSubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 8,
  },
  modeDescription: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  modeArrow: {
    position: 'absolute',
    bottom: 24,
    right: 24,
  },
  comingSoonBadge: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  comingSoonText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: 'white',
  },
  infoCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 15,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 10,
  },
  infoIcon: {
    marginRight: 12,
    marginTop: 2,
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    color: 'white',
    lineHeight: 20,
  },
});