import React, { useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, Vibration } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import ConfettiCannon from 'react-native-confetti-cannon';
import { Theme } from '../styles/theme';
import { Icon } from './Icon';

export default function SurahCompletionModal({ visible, surahName, surahNameArabic, onClose }) {
  const confettiRef = useRef(null);

  useEffect(() => {
    if (visible) {
      // Trigger confetti when modal becomes visible
      setTimeout(() => {
        confettiRef.current?.start();
      }, 300);
      
      // Haptic feedback - celebration pattern
      Vibration.vibrate([0, 100, 50, 100, 50, 200]);
    }
  }, [visible]);

  return (
    <Modal visible={visible} transparent={true} animationType="fade">
      <View style={styles.overlay}>
        {/* Confetti Animation */}
        <ConfettiCannon
          ref={confettiRef}
          count={200}
          origin={{ x: -10, y: 0 }}
          autoStart={false}
          fadeOut={true}
          fallSpeed={3000}
        />

        {/* Celebration Card */}
        <View style={styles.celebrationCard}>
          <LinearGradient
            colors={['#d4af37', '#f4d03f']}
            style={styles.gradientHeader}
          >
            <View style={styles.trophyContainer}>
              <Icon name="trophy" type="Ionicons" size={64} color="white" />
            </View>
            <Text style={styles.congratsText}>Masha'Allah! 🎉</Text>
          </LinearGradient>

          <View style={styles.contentSection}>
            <Text style={styles.completedText}>Surah Completed!</Text>
            
            {surahNameArabic && (
              <Text style={styles.surahNameArabic}>{surahNameArabic}</Text>
            )}
            
            <Text style={styles.surahName}>{surahName}</Text>
            
            <View style={styles.messageContainer}>
              <Text style={styles.motivationText}>
                You've successfully memorized an entire surah!
              </Text>
              <Text style={styles.duaText}>
                May Allah accept your efforts and make this knowledge beneficial for you.
              </Text>
            </View>

            <TouchableOpacity 
              style={styles.continueButton}
              onPress={onClose}
            >
              <Text style={styles.continueButtonText}>Continue Journey</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  celebrationCard: {
    backgroundColor: 'white',
    borderRadius: 24,
    width: '100%',
    maxWidth: 400,
    overflow: 'hidden',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
  },
  gradientHeader: {
    paddingVertical: 40,
    alignItems: 'center',
  },
  trophyContainer: {
    marginBottom: 16,
  },
  congratsText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
  },
  contentSection: {
    padding: 30,
    alignItems: 'center',
  },
  completedText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Theme.colors.primary,
    marginBottom: 20,
    textAlign: 'center',
  },
  surahNameArabic: {
    fontSize: 32,
    fontFamily: 'UthmanicFont',
    color: Theme.colors.secondary,
    marginBottom: 12,
    textAlign: 'center',
  },
  surahName: {
    fontSize: 22,
    fontWeight: '600',
    color: Theme.colors.primary,
    marginBottom: 24,
    textAlign: 'center',
  },
  messageContainer: {
    backgroundColor: Theme.colors.successLight,
    borderRadius: 16,
    padding: 20,
    marginBottom: 30,
    borderLeftWidth: 4,
    borderLeftColor: Theme.colors.success,
  },
  motivationText: {
    fontSize: 16,
    color: Theme.colors.textPrimary,
    textAlign: 'center',
    marginBottom: 12,
    lineHeight: 24,
    fontWeight: '500',
  },
  duaText: {
    fontSize: 14,
    color: Theme.colors.textSecondary,
    textAlign: 'center',
    fontStyle: 'italic',
    lineHeight: 20,
  },
  continueButton: {
    backgroundColor: Theme.colors.secondary,
    paddingVertical: 16,
    paddingHorizontal: 40,
    borderRadius: 30,
    elevation: 3,
    shadowColor: '#d4af37',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  continueButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});