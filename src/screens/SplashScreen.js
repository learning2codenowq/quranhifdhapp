import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

export default function SplashScreen({ onComplete }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, 2500); // Show splash for 2.5 seconds

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <LinearGradient colors={['#004d24', '#058743']} style={styles.container}>
      <View style={styles.content}>
        <View style={styles.logoContainer}>
          <Text style={styles.arabicLogo}>القرآن</Text>
          <Text style={styles.appName}>Hifdh Journey</Text>
        </View>
        
        <View style={styles.taglineContainer}>
          <Text style={styles.tagline}>Your path to memorizing the Holy Quran</Text>
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 60,
  },
  arabicLogo: {
  fontSize: 60,
  color: '#d4af37',
  marginBottom: 20,
  textAlign: 'center',
  fontFamily: 'KFGQPC_Uthmanic_Script_HAFS_Regular',
  },
  appName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    letterSpacing: 2,
  },
  taglineContainer: {
    alignItems: 'center',
  },
  tagline: {
    fontSize: 18,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 26,
  },
  subtitle: {
  fontSize: 20,
  color: '#d4af37',
  textAlign: 'center',
  fontFamily: 'UthmanicFont',
  },
  footer: {
    paddingBottom: 40,
  },
  footerText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'center',
    fontStyle: 'italic',
  },
});