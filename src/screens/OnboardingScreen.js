import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Dimensions,
  TextInput,
  Modal,
  StatusBar,
  Platform
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { StorageService } from '../services/StorageService';
import { NotificationService } from '../services/NotificationService';
import { Theme } from '../styles/theme';
import DateTimePicker from '@react-native-community/datetimepicker';

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
  const [morningTime, setMorningTime] = useState(new Date(2024, 0, 1, 6, 0));
  const [eveningTime, setEveningTime] = useState(new Date(2024, 0, 1, 18, 0));
  const [showMorningPicker, setShowMorningPicker] = useState(false);
  const [showEveningPicker, setShowEveningPicker] = useState(false);
  const [notificationPermission, setNotificationPermission] = useState(null);

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
    // If we're moving to the notification screen, request permissions
    if (currentIndex === 2) { // Moving to notification screen (index 3)
      await requestNotificationPermission();
    }
    setCurrentIndex(currentIndex + 1);
  } else {
    // Complete onboarding with notification setup
    const finalUserName = userName.trim();
    
    // Save notification settings
    const morningTimeObj = { 
      hour: morningTime.getHours(), 
      minute: morningTime.getMinutes() 
    };
    const eveningTimeObj = { 
      hour: eveningTime.getHours(), 
      minute: eveningTime.getMinutes() 
    };
    
    await NotificationService.saveNotificationSettings(morningTimeObj, eveningTimeObj, true);
    await NotificationService.scheduleNotifications(morningTimeObj, eveningTimeObj, selectedTarget);
    
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

  const handleTimeChange = (event, selectedTime, isEvening = false) => {
  if (Platform.OS === 'android') {
    setShowMorningPicker(false);
    setShowEveningPicker(false);
  }
  
  if (selectedTime) {
    if (isEvening) {
      setEveningTime(selectedTime);
    } else {
      setMorningTime(selectedTime);
    }
  }
};

const formatTime = (time) => {
  return time.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });
};

const requestNotificationPermission = async () => {
  const hasPermission = await NotificationService.requestPermissions();
  setNotificationPermission(hasPermission);
  return hasPermission;
};

  return (
    <SafeAreaProvider>
      <StatusBar barStyle="light-content" />
      <LinearGradient colors={Theme.gradients.primary} style={styles.container}>
        <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
          
          {/* Centered Content */}
          <View style={styles.centeredContent}>
            
            {/* Header */}
            <View style={styles.headerSection}>
              <Text style={styles.title}>{currentScreen.title}</Text>
              {currentScreen.subtitle && (
                <Text style={styles.subtitle}>{currentScreen.subtitle}</Text>
              )}
              {currentScreen.description && (
                <Text style={styles.description}>{currentScreen.description}</Text>
              )}
            </View>

            {/* Dynamic Content */}
            <View style={styles.dynamicContent}>
              
              {/* Name Input */}
              {currentScreen.showNameInput && (
                <TextInput
                  style={styles.nameInput}
                  placeholder="Enter your name"
                  placeholderTextColor="rgba(255, 255, 255, 0.6)"
                  value={userName}
                  onChangeText={setUserName}
                  autoFocus={true}
                  returnKeyType="next"
                  onSubmitEditing={handleNext}
                />
              )}

              {/* Target Selection with 2x2 Grid */}
              {currentScreen.showTargetSelection && (
                <View style={styles.targetSelectionContainer}>
                  <View style={styles.targetGrid}>
                    {targetOptions.map((option, index) => (
                      <View key={option.value} style={styles.targetItemContainer}>
                        <TouchableOpacity
                          style={[
                            styles.targetCard,
                            selectedTarget === option.value && styles.selectedCard,
                            option.recommended && styles.recommendedCard
                          ]}
                          onPress={() => setSelectedTarget(option.value)}
                          onPressIn={() => setHoveredTarget(option.value)}
                          onPressOut={() => setHoveredTarget(null)}
                          activeOpacity={0.8}
                        >
                          <Text style={[
                            styles.targetNumber,
                            selectedTarget === option.value && styles.selectedText
                          ]}>
                            {option.label}
                          </Text>
                          <Text style={[
                            styles.targetLabel,
                            selectedTarget === option.value && styles.selectedText
                          ]}>
                            {option.subtitle}
                          </Text>
                          
                          {option.recommended && (
                            <Text style={styles.recommendedBadge}>
                              RECOMMENDED
                            </Text>
                          )}
                          
                          {option.value === 10 && (
                            <TouchableOpacity 
                              style={styles.infoButton}
                              onPress={() => setShowHadithModal(true)}
                            >
                              <Text style={styles.infoButtonText}>?</Text>
                            </TouchableOpacity>
                          )}
                        </TouchableOpacity>
                        
                        {/* Warning below card */}
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

                  {/* Completion Estimate */}
                  <View style={styles.estimateCard}>
                    <Text style={styles.estimateTitle}>Completion Estimate</Text>
                    <View style={styles.estimateDetails}>
                      <Text style={styles.estimateDays}>
                        📅 {targetOptions.find(t => t.value === selectedTarget)?.completionDays} days
                      </Text>
                      <Text style={styles.estimateDate}>
                        Expected: {targetOptions.find(t => t.value === selectedTarget)?.completionDate.toLocaleDateString()}
                      </Text>
                    </View>
                  </View>
                </View>
              )}
              {/* Notification Setup */}
{currentScreen.showNotificationSetup && (
  <View style={styles.notificationContainer}>
    {notificationPermission === false && (
      <View style={styles.permissionWarning}>
        <Text style={styles.permissionWarningText}>
          ⚠️ Notifications are disabled. Please enable them in your device settings.
        </Text>
      </View>
    )}
    
    {/* Morning Time */}
    <View style={styles.timeSection}>
      <Text style={styles.timeLabel}>Morning Session (preferably after Fajr)</Text>
      <Text style={styles.timeHelper}>Best time when there are no distractions</Text>
      <TouchableOpacity 
        style={styles.timePicker}
        onPress={() => {
          setShowEveningPicker(false);
          setShowMorningPicker(true);
        }}
      >
        <Text style={styles.timeText}>{formatTime(morningTime)}</Text>
      </TouchableOpacity>
    </View>

    {/* Evening Time */}
    <View style={styles.timeSection}>
      <Text style={styles.timeLabel}>Evening Reminder</Text>
      <Text style={styles.timeHelper}>When you're done from work/school</Text>
      <TouchableOpacity 
        style={styles.timePicker}
        onPress={() => {
          setShowMorningPicker(false);
          setShowEveningPicker(true);
        }}
      >
        <Text style={styles.timeText}>{formatTime(eveningTime)}</Text>
      </TouchableOpacity>
    </View>
  </View>
)}
            </View>
            
          </View>

          {/* Fixed Bottom Navigation */}
          <View style={styles.bottomNavigation}>
            
            {/* Progress Indicators */}
            <View style={styles.indicatorContainer}>
              {onboardingData.map((_, index) => (
                <View
                  key={index}
                  style={[
                    styles.indicator,
                    index === currentIndex && styles.activeIndicator,
                    index < currentIndex && styles.completedIndicator
                  ]}
                />
              ))}
            </View>

            {/* Buttons */}
            <View style={styles.buttonRow}>
              {currentIndex > 0 && (
                <TouchableOpacity 
                  style={styles.backButton} 
                  onPress={handleBack}
                  activeOpacity={0.7}
                >
                  <Text style={styles.backButtonText}>Back</Text>
                </TouchableOpacity>
              )}
              
              <TouchableOpacity 
                style={[
                  styles.nextButton,
                  currentIndex === 0 && styles.nextButtonFullWidth
                ]} 
                onPress={handleNext}
                activeOpacity={0.8}
              >
                <Text style={styles.nextButtonText}>
                  {currentIndex === onboardingData.length - 1 ? 'Start Journey' : 'Next'}
                </Text>
              </TouchableOpacity>
            </View>

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

          {/* Modern Time Picker Modals */}
{showMorningPicker && (
  <Modal visible={true} transparent={true} animationType="fade">
    <View style={styles.timePickerOverlay}>
      <View style={styles.timePickerModal}>
        <Text style={styles.timePickerTitle}>Morning Session Time</Text>
        <Text style={styles.timePickerSubtitle}>Preferably after Fajr prayer</Text>
        
        <DateTimePicker
          value={morningTime}
          mode="time"
          is24Hour={false}
          display="spinner"
          onChange={(event, selectedTime) => handleTimeChange(event, selectedTime, false)}
          textColor="#22575D"
          themeVariant="light"
        />
        
        <View style={styles.timePickerButtons}>
          <TouchableOpacity 
            style={styles.timePickerCancelButton}
            onPress={() => setShowMorningPicker(false)}
          >
            <Text style={styles.timePickerCancelText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.timePickerConfirmButton}
            onPress={() => setShowMorningPicker(false)}
          >
            <Text style={styles.timePickerConfirmText}>Confirm</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  </Modal>
)}

{showEveningPicker && (
  <Modal visible={true} transparent={true} animationType="fade">
    <View style={styles.timePickerOverlay}>
      <View style={styles.timePickerModal}>
        <Text style={styles.timePickerTitle}>Evening Reminder Time</Text>
        <Text style={styles.timePickerSubtitle}>When done from work/school</Text>
        
        <DateTimePicker
          value={eveningTime}
          mode="time"
          is24Hour={false}
          display="spinner"
          onChange={(event, selectedTime) => handleTimeChange(event, selectedTime, true)}
          textColor="#22575D"
          themeVariant="light"
        />
        
        <View style={styles.timePickerButtons}>
          <TouchableOpacity 
            style={styles.timePickerCancelButton}
            onPress={() => setShowEveningPicker(false)}
          >
            <Text style={styles.timePickerCancelText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.timePickerConfirmButton}
            onPress={() => setShowEveningPicker(false)}
          >
            <Text style={styles.timePickerConfirmText}>Confirm</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  </Modal>
)}
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
  
  // Main layout - properly centered
  centeredContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 20,
  },
  
  // Header Section
  headerSection: {
    alignItems: 'center',
    marginBottom: 60,
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: 'white',
    textAlign: 'center',
    marginBottom: 16,
    letterSpacing: 0.3,
    lineHeight: 36,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.95)',
    textAlign: 'center',
    marginBottom: 12,
    letterSpacing: 0.2,
  },
  description: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.85)',
    textAlign: 'center',
    lineHeight: 24,
    fontWeight: '400',
  },

  // Dynamic content area
  dynamicContent: {
    alignItems: 'center',
    width: '100%',
  },

  // Name Input
  nameInput: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 20,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    paddingVertical: 18,
    paddingHorizontal: 24,
    width: '85%',
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

  // Target Selection - 2x2 Grid
  targetSelectionContainer: {
    width: '100%',
    alignItems: 'center',
  },
  targetGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    width: '90%',
    marginBottom: 30,
  },
  targetItemContainer: {
    width: '48%', // Two columns
    alignItems: 'center',
    marginBottom: 16,
  },
  targetCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.25)',
    padding: 20,
    width: '100%',
    height: 110,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    shadowColor: 'rgba(0, 0, 0, 0.1)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  recommendedCard: {
    borderColor: '#d4af37',
    backgroundColor: 'rgba(212, 175, 55, 0.15)',
  },
  selectedCard: {
    backgroundColor: '#d4af37',
    borderColor: '#d4af37',
    transform: [{ scale: 1.02 }],
  },
  targetNumber: {
    fontSize: 32,
    fontWeight: '800',
    color: 'white',
    marginBottom: 4,
    letterSpacing: -0.5,
  },
  targetLabel: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.9)',
    fontWeight: '500',
  },
  selectedText: {
    color: 'white',
  },
  recommendedBadge: {
    fontSize: 8,
    color: '#d4af37',
    fontWeight: '700',
    marginTop: 8,
    backgroundColor: 'rgba(212, 175, 55, 0.2)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  infoButton: {
    position: 'absolute',
    top: -6,
    right: -6,
    backgroundColor: '#ffffff',
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
  infoButtonText: {
    fontSize: 11,
    color: '#000',
    fontWeight: 'bold',
  },
  warningContainer: {
    backgroundColor: 'rgba(255, 193, 7, 0.15)',
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 193, 7, 0.4)',
    marginTop: 8,
    width: '100%',
  },
  warningText: {
    fontSize: 10,
    color: '#ffc107',
    textAlign: 'center',
    fontWeight: '600',
  },

  // Completion Estimate
  estimateCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 14,
    padding: 20,
    width: '90%',
    borderLeftWidth: 4,
    borderLeftColor: '#d4af37',
    alignItems: 'center',
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
  estimateDays: {
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

  // Fixed Bottom Navigation
  bottomNavigation: {
    paddingHorizontal: 24,
    paddingBottom: 40,
    paddingTop: 20,
  },
  indicatorContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 32,
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
    width: 32,
    height: 12,
    borderRadius: 6,
  },
  completedIndicator: {
    backgroundColor: 'rgba(212, 175, 55, 0.6)',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  backButton: {
    paddingVertical: 16,
    paddingHorizontal: 24,
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
    paddingHorizontal: 40,
    elevation: 6,
    shadowColor: '#d4af37',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    flex: 1,
    marginLeft: 20,
    alignItems: 'center',
  },
  nextButtonFullWidth: {
    marginLeft: 0,
  },
  nextButtonText: {
    fontSize: 17,
    color: 'white',
    fontWeight: '700',
    letterSpacing: 0.5,
  },

  // Modal
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
    width: '100%',
    maxWidth: 400,
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
  // Notification Screen
notificationContainer: {
  width: '100%',
  alignItems: 'center',
  paddingHorizontal: 20,
},
permissionWarning: {
  backgroundColor: 'rgba(255, 193, 7, 0.15)',
  borderRadius: 12,
  padding: 16,
  marginBottom: 40,
  borderWidth: 1,
  borderColor: 'rgba(255, 193, 7, 0.4)',
  width: '100%',
},
permissionWarningText: {
  fontSize: 14,
  color: '#ffc107',
  textAlign: 'center',
  fontWeight: '600',
},
timeSection: {
  width: '100%',
  marginBottom: 40,
  alignItems: 'center',
},
timeLabel: {
  fontSize: 18,
  fontWeight: '700',
  color: 'white',
  textAlign: 'center',
  marginBottom: 8,
},
timeHelper: {
  fontSize: 14,
  color: 'rgba(255, 255, 255, 0.8)',
  textAlign: 'center',
  marginBottom: 20,
  fontStyle: 'italic',
},
timePicker: {
  backgroundColor: 'rgba(255, 255, 255, 0.15)',
  borderRadius: 16,
  borderWidth: 2,
  borderColor: 'rgba(255, 255, 255, 0.3)',
  paddingVertical: 18,
  paddingHorizontal: 40,
  minWidth: 160,
  alignItems: 'center',
  shadowColor: 'rgba(0, 0, 0, 0.1)',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.2,
  shadowRadius: 4,
  elevation: 2,
},
timeText: {
  fontSize: 22,
  fontWeight: '700',
  color: 'white',
  letterSpacing: 0.5,
},
previewSection: {
  width: '90%',
  marginTop: 20,
  alignItems: 'center',
},
previewTitle: {
  fontSize: 16,
  fontWeight: '700',
  color: 'white',
  marginBottom: 16,
  textAlign: 'center',
},
notificationPreview: {
  backgroundColor: 'rgba(255, 255, 255, 0.1)',
  borderRadius: 12,
  padding: 16,
  marginBottom: 12,
  width: '100%',
  borderLeftWidth: 4,
  borderLeftColor: '#d4af37',
},
previewText: {
  fontSize: 16,
  fontWeight: '600',
  color: 'white',
  marginBottom: 4,
},
previewSubtext: {
  fontSize: 14,
  color: 'rgba(255, 255, 255, 0.8)',
  lineHeight: 20,
},
timePickerOverlay: {
  flex: 1,
  backgroundColor: 'rgba(0, 0, 0, 0.7)',
  justifyContent: 'center',
  alignItems: 'center',
  paddingHorizontal: 20,
},
timePickerModal: {
  backgroundColor: 'white',
  borderRadius: 20,
  padding: 25,
  width: '100%',
  maxWidth: 350,
  alignItems: 'center',
  elevation: 10,
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 5 },
  shadowOpacity: 0.3,
  shadowRadius: 10,
},
timePickerTitle: {
  fontSize: 20,
  fontWeight: 'bold',
  color: '#22575D',
  textAlign: 'center',
  marginBottom: 8,
},
timePickerSubtitle: {
  fontSize: 14,
  color: '#666',
  textAlign: 'center',
  marginBottom: 20,
  fontStyle: 'italic',
},
timePickerButtons: {
  flexDirection: 'row',
  gap: 12,
  marginTop: 20,
  width: '100%',
},
timePickerCancelButton: {
  flex: 1,
  backgroundColor: '#f5f5f5',
  borderRadius: 12,
  paddingVertical: 12,
  alignItems: 'center',
},
timePickerConfirmButton: {
  flex: 1,
  backgroundColor: '#d4af37',
  borderRadius: 12,
  paddingVertical: 12,
  alignItems: 'center',
},
timePickerCancelText: {
  color: '#666',
  fontSize: 16,
  fontWeight: '600',
},
timePickerConfirmText: {
  color: 'white',
  fontSize: 16,
  fontWeight: '600',
},
});