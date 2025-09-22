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

const { width, height } = Dimensions.get('window');

const onboardingData = [
  {
    id: 1,
    title: 'بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ',
    subtitle: 'You are not just opening an app',
    description: 'You are stepping into the protection of Allah to carry His words in your heart',
    showTargetSelection: false
  },
  {
    id: 2,
    title: 'Daily Target',
    subtitle: 'How many ayahs per day?',
    description: '',
    showTargetSelection: true
  },
  {
    id: 3,
    title: 'As-salaamu alaykum,',
    subtitle: 'Welcome to your hifdh journey!',
    description: '',
    showNameInput: true
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
      console.log('Saving user name:', finalUserName); // Debug log
      
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
      <LinearGradient colors={['#004d24', '#058743']} style={styles.container}>
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
                <Text style={[
                  styles.recommendedText,
                  hoveredTarget && hoveredTarget !== option.value && styles.recommendedTextGolden
                ]}>
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
    paddingHorizontal: 30,
    justifyContent: 'center',
  },
  titleSection: {
    alignItems: 'center',
    marginBottom: 50,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#d4af37',
    textAlign: 'center',
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 24,
    fontWeight: '600',
    color: 'white',
    textAlign: 'center',
    marginBottom: 15,
  },
  description: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 20,
  },
  targetSection: {
    alignItems: 'center',
  },
  targetGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 15,
    marginBottom: 30,
  },
  targetItemContainer: {
    alignItems: 'center',
    width: (width - 90) / 2,
  },
  targetButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 20,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    padding: 20,
    width: '100%',
    alignItems: 'center',
    minHeight: 100,
    justifyContent: 'center',
  },
  recommendedBorder: {
    borderColor: '#d4af37',
  },
  selectedTarget: {
    backgroundColor: '#d4af37',
    borderColor: '#d4af37',
  },
  targetNumber: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 5,
  },
  targetLabel: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  selectedTargetText: {
    color: 'white',
  },
  recommendedText: {
    fontSize: 12,
    color: '#d4af37',
    fontWeight: '600',
    marginTop: 5,
  },
  warningContainer: {
    marginTop: 10,
    backgroundColor: 'rgba(255, 193, 7, 0.2)',
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  warningText: {
    fontSize: 12,
    color: '#ffc107',
    textAlign: 'center',
    fontWeight: '500',
  },
  estimateContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 15,
    padding: 15,
    marginTop: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#d4af37',
  },
  estimateTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#d4af37',
    marginBottom: 8,
  },
  estimateDetails: {
    alignItems: 'center',
  },
  estimateText: {
    fontSize: 16,
    color: 'white',
    fontWeight: '600',
    marginBottom: 4,
  },
  estimateDate: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  nameSection: {
    alignItems: 'center',
  },
  nameInput: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 15,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    paddingVertical: 15,
    paddingHorizontal: 20,
    width: '80%',
    fontSize: 16,
    color: 'white',
    textAlign: 'center',
  },
  bottomSection: {
    paddingHorizontal: 30,
    paddingBottom: 30,
    alignItems: 'center',
  },
  indicatorContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 30,
    gap: 8,
  },
  indicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  activeIndicator: {
    backgroundColor: '#d4af37',
    width: 30,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    gap: 20,
  },
  backButton: {
    paddingVertical: 12,
    paddingHorizontal: 30,
  },
  backButtonText: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.7)',
    fontWeight: '500',
  },
  nextButton: {
    backgroundColor: '#d4af37',
    borderRadius: 25,
    paddingVertical: 15,
    paddingHorizontal: 40,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  nextButtonText: {
    fontSize: 16,
    color: 'white',
    fontWeight: '600',
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
  backgroundColor: '#d4af37',
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
  color: 'white',
  fontWeight: 'bold',
},
recommendedText: {
  fontSize: 12,
  color: '#004d24', // Dark green by default
  fontWeight: '600',
  marginTop: 5,
},
recommendedTextGolden: {
  color: '#d4af37', // Golden when hovering other options
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
  backgroundColor: '#d4af37',
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