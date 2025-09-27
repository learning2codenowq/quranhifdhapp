import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Dimensions,
  TextInput,
  Modal
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { StorageService } from '../services/StorageService';
import { Theme } from '../styles/theme';

const { width, height } = Dimensions.get('window');

const onboardingData = [
  {
    id: 1,
    title: 'بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ',
    subtitle: 'As-salamu alaykum, welcome!',
    description: 'Begin your journey of memorizing the Holy Quran structure and clarity',
    showTargetSelection: false,
    showNameInput: false
  },
  {
    id: 2,
    title: 'What is your name?',
    subtitle: '',
    description: '',
    showTargetSelection: false,
    showNameInput: true
  },
  {
    id: 3,
    title: 'Daily Target',
    subtitle: 'How many ayahs per day?',
    description: 'Choose a sustainable pace for your memorization journey',
    showTargetSelection: true,
    showNameInput: false
  },
  {
    id: 4,
    title: 'Daily Reminders',
    subtitle: 'Stay consistent with gentle notifications',
    description: 'Set two daily reminders to help maintain your memorization habit',
    showTargetSelection: false,
    showNameInput: false,
    showNotificationSetup: true
  }
];

export default function OnboardingScreen({ navigation }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedTarget, setSelectedTarget] = useState(10);
  const [userName, setUserName] = useState('');
  const [hoveredTarget, setHoveredTarget] = useState(null);
  const [showHadithModal, setShowHadithModal] = useState(false);

  const targetOptions = [
    { 
      value: 5, 
      label: '5', 
      subtitle: 'ayahs/day',
      completionDays: Math.ceil(6236 / 5),
      completionDate: new Date(Date.now() + Math.ceil(6236 / 5) * 24 * 60 * 60 * 1000)
    },
    { 
    value: 10, 
    label: '10', 
    subtitle: 'ayahs/day', 
    recommended: true,
    completionDays: Math.ceil(6236 / 10),
    completionDate: new Date(Date.now() + Math.ceil(6236 / 10) * 24 * 60 * 60 * 1000)
    },
    { 
      value: 15, 
      label: '15', 
      subtitle: 'ayahs/day',
      completionDays: Math.ceil(6236 / 15),
      completionDate: new Date(Date.now() + Math.ceil(6236 / 15) * 24 * 60 * 60 * 1000)
    },
    { 
      value: 20, 
      label: '20', 
      subtitle: 'ayahs/day',
      completionDays: Math.ceil(6236 / 20),
      completionDate: new Date(Date.now() + Math.ceil(6236 / 20) * 24 * 60 * 60 * 1000)
    }
  ];

  const handleNext = async () => {
    if (currentIndex < onboardingData.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      // Complete onboarding - make sure name is properly saved
      const finalUserName = userName.trim();
      
      await StorageService.initializeState({
        dailyGoal: selectedTarget,
        userName: finalUserName || 'Student'
      });
      navigation.replace('Dashboard');
    }
  };

  const handleBack = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const currentScreen = onboardingData[currentIndex];

  const getWarningMessage = (target) => {
    if (target >= 20) return "Most people quit high targets.";
    return "";
  };

  return (
    <SafeAreaProvider>
      <LinearGradient colors={Theme.gradients.primary} style={styles.container}>
        <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
          
          <View style={styles.content}>
            
            <View style={styles.titleSection}>
              <Text style={styles.title}>{currentScreen.title}</Text>
              <Text style={styles.subtitle}>{currentScreen.subtitle}</Text>
              {currentScreen.description && (
                <Text style={styles.description}>{currentScreen.description}</Text>
              )}
            </View>

            {currentScreen.showTargetSelection && (
  <View style={styles.targetSection}>
    <View style={styles.targetGrid}>
      {targetOptions.map((option) => (
        <View key={option.value} style={styles.targetItemContainer}>
          <TouchableOpacity
            style={[
              styles.targetButton,
              selectedTarget === option.value && styles.selectedTarget,
              option.recommended && styles.recommendedBorder
            ]}
            onPress={() => setSelectedTarget(option.value)}
            onPressIn={() => setHoveredTarget(option.value)}
            onPressOut={() => setHoveredTarget(null)}
          >
            <View style={styles.targetContent}>
              <Text style={[
                styles.targetNumber,
                selectedTarget === option.value && styles.selectedTargetText
              ]}>
                {option.label}
              </Text>
              <Text style={[
                styles.targetLabel,
                selectedTarget === option.value && styles.selectedTargetText
              ]}>
                {option.subtitle}
              </Text>
              
              {/* Recommended text with dynamic styling */}
              {option.recommended && (
  <Text style={styles.recommendedText}>
    Recommended
  </Text>
)}
              
              {/* Question mark for option 10 */}
              {option.value === 10 && (
                <TouchableOpacity 
                  style={styles.questionMark}
                  onPress={() => setShowHadithModal(true)}
                >
                  <Text style={styles.questionMarkText}>?</Text>
                </TouchableOpacity>
              )}
            </View>
          </TouchableOpacity>
          
          {/* Show warning for high targets only */}
          {(hoveredTarget === option.value || selectedTarget === option.value) && 
           getWarningMessage(option.value) && (
            <View style={styles.warningContainer}>
              <Text style={styles.warningText}>
                ⚠️ {getWarningMessage(option.value)}
              </Text>
            </View>
          )}
        </View>
      ))}
    </View>

    <View style={styles.estimateContainer}>
      <Text style={styles.estimateTitle}>Completion Estimate</Text>
      {selectedTarget && (
        <View style={styles.estimateDetails}>
          <Text style={styles.estimateText}>
            📅 {targetOptions.find(t => t.value === selectedTarget)?.completionDays} days
          </Text>
          <Text style={styles.estimateDate}>
            Expected completion: {targetOptions.find(t => t.value === selectedTarget)?.completionDate.toLocaleDateString()}
          </Text>
        </View>
      )}
    </View>
    
    {/* Hadith Modal */}
    <Modal
      visible={showHadithModal}
      transparent={true}
      animationType="fade"
      onRequestClose={() => setShowHadithModal(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.hadithModal}>
          <Text style={styles.hadithModalTitle}>Why 10 Ayahs Per Day?</Text>
          <Text style={styles.hadithModalText}>
            <Text style={styles.hadithBold}>Reported from Ibn Masʿūd (رضي الله عنه):</Text>{'\n\n'}
            "They would learn 10 ayat and not move on until they had learned their knowledge and acted upon them."{'\n\n'}
            <Text style={styles.hadithSource}>(al-Ṭabarī in Tafsīr; Ibn Kathīr graded the chain sound)</Text>
          </Text>
          <TouchableOpacity 
            style={styles.hadithCloseButton}
            onPress={() => setShowHadithModal(false)}
          >
            <Text style={styles.hadithCloseText}>Got it!</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  </View>
)}

            {currentScreen.showNameInput && (
              <View style={styles.nameSection}>
                <TextInput
                  style={styles.nameInput}
                  placeholder="Enter your name"
                  placeholderTextColor="rgba(255, 255, 255, 0.6)"
                  value={userName}
                  onChangeText={setUserName}
                />
              </View>
            )}

          </View>

          <View style={styles.bottomSection}>
            
            <View style={styles.indicatorContainer}>
              {onboardingData.map((_, index) => (
                <View
                  key={index}
                  style={[
                    styles.indicator,
                    index === currentIndex && styles.activeIndicator
                  ]}
                />
              ))}
            </View>

            <View style={styles.buttonContainer}>
              {currentIndex > 0 && (
                <TouchableOpacity style={styles.backButton} onPress={handleBack}>
                  <Text style={styles.backButtonText}>Back</Text>
                </TouchableOpacity>
              )}
              
              <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
                <Text style={styles.nextButtonText}>
                  {currentIndex === onboardingData.length - 1 ? 'Start Journey' : 'Next'}
                </Text>
              </TouchableOpacity>
            </View>

          </View>

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
  paddingHorizontal: 16,
  justifyContent: 'space-between',
  paddingTop: 40,
  paddingBottom: 20,
  },
  titleSection: {
    alignItems: 'center',
    marginBottom: 60,
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 30,
    fontWeight: '700',
    color: 'white',
    textAlign: 'center',
    marginBottom: 24,
    letterSpacing: 0.5,
    lineHeight: 38,
  },
  subtitle: {
    fontSize: 22,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.95)',
    textAlign: 'center',
    marginBottom: 16,
    letterSpacing: 0.3,
  },
  description: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.85)',
    textAlign: 'center',
    lineHeight: 26,
    paddingHorizontal: 8,
    fontWeight: '400',
  },
  targetSection: {
    alignItems: 'center',
  },
  targetGrid: {
  flexDirection: 'row',
  flexWrap: 'wrap',
  justifyContent: 'space-between',
  paddingHorizontal: 20,
  marginBottom: 30,
  gap: 12,
  },
  targetItemContainer: {
  alignItems: 'center',
  width: (width - 64) / 2, // Better calculation for equal widths
  },
  targetButton: {
  backgroundColor: 'rgba(255, 255, 255, 0.12)',
  borderRadius: 20,
  borderWidth: 2,
  borderColor: 'rgba(255, 255, 255, 0.3)',
  padding: 20,
  width: '100%',
  height: 100, // Fixed height for all cards
  alignItems: 'center',
  justifyContent: 'center',
  shadowColor: 'rgba(0, 0, 0, 0.1)',
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.3,
  shadowRadius: 8,
  elevation: 4,
  },
  recommendedBorder: {
  borderColor: '#d4af37',
  backgroundColor: 'rgba(212, 175, 55, 0.15)',
  },
  selectedTarget: {
  backgroundColor: '#d4af37',
  borderColor: '#d4af37',
  transform: [{ scale: 1.02 }],
  },
  targetNumber: {
  fontSize: 32,
  fontWeight: '800',
  color: 'white',
  marginBottom: 6,
  letterSpacing: -1,
  },
  targetLabel: {
  fontSize: 13,
  color: 'rgba(255, 255, 255, 0.9)',
  fontWeight: '500',
  },
  recommendedText: {
  fontSize: 11,
  color: '#d4af37', // Always golden when showing
  fontWeight: '700',
  marginTop: 6,
  backgroundColor: 'rgba(212, 175, 55, 0.2)',
  paddingHorizontal: 10,
  paddingVertical: 3,
  borderRadius: 10,
  textTransform: 'uppercase',
  letterSpacing: 0.5,
  },
  recommendedTextGolden: {
    color: Theme.colors.secondary,
    backgroundColor: 'rgba(212, 175, 55, 0.2)',
  },
  warningContainer: {
  position: 'absolute',
  bottom: -45,
  left: 0,
  right: 0,
  backgroundColor: 'rgba(255, 193, 7, 0.15)',
  borderRadius: 12,
  paddingVertical: 8,
  paddingHorizontal: 12,
  borderWidth: 1,
  borderColor: 'rgba(255, 193, 7, 0.4)',
  },
  warningText: {
  fontSize: 11,
  color: '#ffc107',
  textAlign: 'center',
  fontWeight: '600',
  },
  estimateContainer: {
  backgroundColor: 'rgba(255, 255, 255, 0.15)',
  borderRadius: 16,
  padding: 18,
  marginTop: 20,
  marginBottom: 40, // Add margin to prevent cutoff
  marginHorizontal: 20,
  borderLeftWidth: 4,
  borderLeftColor: '#d4af37',
  },
  estimateTitle: {
  fontSize: 16,
  fontWeight: '700',
  color: 'white',
  marginBottom: 12,
  textAlign: 'center',
  },
  estimateDetails: {
  alignItems: 'center',
  },
  estimateText: {
  fontSize: 18,
  color: 'white',
  fontWeight: '700',
  marginBottom: 6,
  },
  estimateDate: {
  fontSize: 14,
  color: 'rgba(255, 255, 255, 0.85)',
  fontWeight: '500',
  },
  nameSection: {
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  nameInput: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 20,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.4)',
    paddingVertical: 18,
    paddingHorizontal: 24,
    width: '90%',
    fontSize: 18,
    color: 'white',
    textAlign: 'center',
    fontWeight: '500',
    shadowColor: 'rgba(0, 0, 0, 0.1)',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 3,
  },

  bottomSection: {
    paddingHorizontal: 24,
    paddingBottom: 40,
    alignItems: 'center',
  },
  indicatorContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 40,
    gap: 8,
  },
  indicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  activeIndicator: {
    backgroundColor: '#d4af37',
    width: 32,
    height: 10,
    borderRadius: 5,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    gap: 20,
  },
  backButton: {
    paddingVertical: 14,
    paddingHorizontal: 32,
  },
  backButtonText: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    fontWeight: '500',
  },
  nextButton: {
    backgroundColor: '#d4af37',
    borderRadius: 28,
    paddingVertical: 16,
    paddingHorizontal: 48,
    elevation: 6,
    shadowColor: '#d4af37',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
  },
  nextButtonText: {
    fontSize: 17,
    color: 'white',
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  targetContent: {
  alignItems: 'center',
  position: 'relative',
  width: '100%',
  },
  questionMark: {
  position: 'absolute',
  top: -5,
  right: -5,
  backgroundColor: '#ffffffff',
  borderRadius: 10,
  width: 20,
  height: 20,
  justifyContent: 'center',
  alignItems: 'center',
  elevation: 2,
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 1 },
  shadowOpacity: 0.2,
  shadowRadius: 2,
  },
  questionMarkText: {
  fontSize: 12,
  color: 'black',
  fontWeight: 'bold',
  },
  recommendedText: {
  fontSize: 12,
  color: '#ffffff', 
  fontWeight: '600',
  marginTop: 5,
  },
  recommendedTextGolden: {
  color: Theme.colors.secondary,
  },
  modalOverlay: {
  flex: 1,
  backgroundColor: 'rgba(0, 0, 0, 0.7)',
  justifyContent: 'center',
  alignItems: 'center',
  paddingHorizontal: 20,
  },
  hadithModal: {
  backgroundColor: 'white',
  borderRadius: 20,
  padding: 25,
  maxWidth: 350,
  width: '100%',
  elevation: 10,
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 5 },
  shadowOpacity: 0.3,
  shadowRadius: 10,
},
hadithModalTitle: {
  fontSize: 20,
  fontWeight: 'bold',
  color: '#004d24',
  textAlign: 'center',
  marginBottom: 15,
},
hadithModalText: {
  fontSize: 15,
  color: '#333',
  lineHeight: 22,
  textAlign: 'center',
  marginBottom: 20,
},
hadithBold: {
  fontWeight: 'bold',
  color: '#004d24',
},
hadithSource: {
  fontSize: 13,
  fontStyle: 'italic',
  color: '#666',
},
hadithCloseButton: {
  color: Theme.colors.secondary,
  borderRadius: 25,
  paddingVertical: 12,
  paddingHorizontal: 30,
  alignSelf: 'center',
},
hadithCloseText: {
  color: 'white',
  fontSize: 16,
  fontWeight: '600',
},
});