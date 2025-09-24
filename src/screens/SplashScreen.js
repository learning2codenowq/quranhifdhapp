import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

export default function SplashScreen({ onComplete }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, 2000); // Show splash for 2 seconds

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <LinearGradient colors={['#004d24', '#058743']} style={styles.container}>
      <View style={styles.content}>
        <View style={styles.logoContainer}>
          <Text style={styles.arabicLogo}>القرآن</Text>
          <Text style={styles.appName}>Quran Hifdh</Text>
          <View style={styles.underline} />
        </View>
        
        <View style={styles.taglineContainer}>
          <Text style={styles.tagline}>Your companion for</Text>
          <Text style={styles.tagline}>memorizing the Holy Quran</Text>
        </View>

        <View style={styles.footer}>
          <View style={styles.loadingDots}>
            <View style={[styles.dot, styles.dot1]} />
            <View style={[styles.dot, styles.dot2]} />
            <View style={[styles.dot, styles.dot3]} />
          </View>
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 80,
    paddingHorizontal: 40,
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: 60,
  },
  arabicLogo: {
    fontSize: 72,
    color: '#d4af37',
    marginBottom: 16,
    textAlign: 'center',
    fontFamily: 'KFGQPC_Uthmanic_Script_HAFS_Regular',
    letterSpacing: 2,
  },
  appName: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    letterSpacing: 1.5,
    marginBottom: 12,
  },
  underline: {
    width: 80,
    height: 3,
    backgroundColor: '#d4af37',
    borderRadius: 2,
    marginTop: 8,
  },
  taglineContainer: {
    alignItems: 'center',
  },
  tagline: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    lineHeight: 24,
    fontWeight: '400',
  },
  footer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  loadingDots: {
    flexDirection: 'row',
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(212, 175, 55, 0.6)',
  },
  dot1: {
    opacity: 0.4,
  },
  dot2: {
    opacity: 0.7,
  },
  dot3: {
    opacity: 1,
  },
});