import React from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Platform
} from 'react-native';
import { BlurView } from 'expo-blur';
import { useTutorial } from '../contexts/TutorialContext';
import { Theme } from '../styles/theme';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const TutorialModal = ({ visible, currentScreen }) => {
  const {
    isTutorialActive,
    currentStep,
    tutorialSteps,
    nextStep,
    skipTutorial,
    getCurrentStepData
  } = useTutorial();

  if (!visible || !isTutorialActive) {
    return null;
  }

  const stepData = getCurrentStepData();
  console.log('🎨 TutorialModal render:', {
    visible,
    isTutorialActive,
    currentScreen,
    stepDataScreen: stepData?.screen,
    stepId: stepData?.id,
    shouldShow: stepData?.screen === currentScreen
  });
  
  // Only show if we're on the correct screen for this step
  if (stepData.screen !== currentScreen) {
    return null;
  }
  
  if (!visible || !isTutorialActive || stepData.screen !== currentScreen) {
    return null;
  }
  const totalSteps = tutorialSteps.length;
  const isLastStep = currentStep === totalSteps - 1;

  return (
    <Modal
      visible={true}
      transparent={true}
      animationType="fade"
      statusBarTranslucent={true}
    >
      <View style={styles.overlay}>
        {/* Semi-transparent dark background */}
        <View style={styles.darkOverlay} />

        {/* Tutorial content card */}
        <View style={styles.contentContainer}>
          <View style={styles.card}>
            {/* Progress indicator */}
            <View style={styles.progressContainer}>
              <Text style={styles.progressText}>
                Step {currentStep + 1} of {totalSteps}
              </Text>
            </View>

            {/* Title */}
            <Text style={styles.title}>{stepData.title}</Text>

            {/* Message */}
            <Text style={styles.message}>{stepData.message}</Text>

            {/* Buttons */}
            <View style={styles.buttonContainer}>
              {/* Skip button - only show if not last step */}
              {!isLastStep && (
                <TouchableOpacity
                  style={styles.skipButton}
                  onPress={skipTutorial}
                  activeOpacity={0.7}
                >
                  <Text style={styles.skipButtonText}>Skip Tutorial</Text>
                </TouchableOpacity>
              )}

              {/* Next/Finish button */}
              <TouchableOpacity
                style={[
                  styles.nextButton,
                  isLastStep && styles.finishButton
                ]}
                onPress={nextStep}
                activeOpacity={0.8}
              >
                <Text style={styles.nextButtonText}>
                  {isLastStep ? "Let's Go!" : stepData.action === 'tap' ? 'Got It' : 'Next'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  darkOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
  },
  contentContainer: {
    width: SCREEN_WIDTH * 0.85,
    maxWidth: 400,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 24,
    ...Theme.shadows.xl,
    elevation: 10,
  },
  progressContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  progressText: {
    fontSize: 12,
    color: Theme.colors.primary,
    fontWeight: '600',
    backgroundColor: 'rgba(76, 175, 80, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: Theme.colors.text,
    marginBottom: 12,
    textAlign: 'center',
  },
  message: {
    fontSize: 16,
    color: Theme.colors.textSecondary,
    lineHeight: 24,
    textAlign: 'center',
    marginBottom: 24,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
  },
  skipButton: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: Theme.colors.gray100,
    alignItems: 'center',
  },
  skipButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: Theme.colors.textMuted,
  },
  nextButton: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: Theme.colors.primary,
    alignItems: 'center',
    ...Theme.shadows.md,
  },
  finishButton: {
    flex: 1,
    backgroundColor: '#d4af37',
  },
  nextButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: 'white',
  },
});

export default TutorialModal;