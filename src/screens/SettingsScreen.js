import React, { useState, useEffect, useMemo, Fragment } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Switch, Modal, TextInput, ActivityIndicator, KeyboardAvoidingView, Platform } from 'react-native';
import ScreenLayout from '../layouts/ScreenLayout';
import ScreenHeader from '../layouts/ScreenHeader';
import { StorageService } from '../services/StorageService';
import { NotificationService } from '../services/NotificationService';
import { TestingUtils } from '../utils/TestingUtils';
import { Logger } from '../utils/Logger'
import { Theme } from '../styles/theme';
import { Icon } from '../components/Icon';
import SettingItem from '../components/settings/SettingItem';
import SwitchItem from '../components/settings/SwitchItem';
import UserNameModal from '../components/settings/UserNameModal';
import DailyTargetModal from '../components/settings/DailyTargetModal';
import FontPreviewModal from '../components/settings/FontPreviewModal';
import ReciterSelectionModal from '../components/settings/ReciterSelectionModal';
import CustomTimePicker from '../components/CustomTimePicker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useSettings } from '../hooks/useSettings';
import { QuranService } from '../services/QuranService';


export default function SettingsScreen({ navigation }) {
  const { settings, themedColors, updateSetting: updateSettingHook } = useSettings();

  const [showNameModal, setShowNameModal] = useState(false);
  const [tempUserName, setTempUserName] = useState('');
  const [showDailyTargetModal, setShowDailyTargetModal] = useState(false);
  const [fontPreviewModal, setFontPreviewModal] = useState(false);
  const [previewFontSize, setPreviewFontSize] = useState('Medium');
  const [reciters, setReciters] = useState([]);
  const [showReciterModal, setShowReciterModal] = useState(false);
  const [selectedReciterId, setSelectedReciterId] = useState(null);
  const [notificationSettings, setNotificationSettings] = useState({
  enabled: false,
  morningTime: { hour: 6, minute: 0 },
  eveningTime: { hour: 18, minute: 0 }
});
const [showMorningTimePicker, setShowMorningTimePicker] = useState(false);
const [showEveningTimePicker, setShowEveningTimePicker] = useState(false);
const [morningTimeDate, setMorningTimeDate] = useState(new Date(2024, 0, 1, 6, 0));
const [eveningTimeDate, setEveningTimeDate] = useState(new Date(2024, 0, 1, 18, 0));

  useEffect(() => {
    loadSettings();
  }, []);
  useEffect(() => {
  if (showNameModal) {
    setTempUserName(settings.userName);
  }
}, [showNameModal, settings.userName]);
useEffect(() => {
  if (showReciterModal && reciters.length === 0) {
    console.log('🎭 Modal opened, loading reciters...');
    loadSettings();
  }
}, [showReciterModal]);

  const loadSettings = async () => {
  try {
    const state = await StorageService.getState();
    
    // Load selected reciter
    if (state?.settings) {
      setSelectedReciterId(state.settings.selectedReciter || null);
    }
    
    // Load notification settings
    const notifSettings = await NotificationService.getNotificationSettings();
    setNotificationSettings(notifSettings);
    
    // Update the time picker dates to match loaded settings
    const morningDate = new Date(2024, 0, 1, notifSettings.morningTime.hour, notifSettings.morningTime.minute);
    const eveningDate = new Date(2024, 0, 1, notifSettings.eveningTime.hour, notifSettings.eveningTime.minute);
    setMorningTimeDate(morningDate);
    setEveningTimeDate(eveningDate);
    
    console.log('📲 Loaded notification settings:', notifSettings);
    
    // Load and filter reciters
    const recitersList = await QuranService.getReciters();
    console.log('📢 Raw reciters from API:', recitersList.length);
    
    // Validate reciter data
    const validReciters = recitersList.filter(r => r && r.name && r.id);
    console.log('📢 Valid reciters after filtering:', validReciters.length);
    
    // Remove duplicates based on reciter name
    const uniqueReciters = validReciters.filter((reciter, index, self) => 
      index === self.findIndex((r) => r.name === reciter.name)
    );
    
    console.log('📢 Unique reciters after filtering:', uniqueReciters.length);
    
    setReciters(uniqueReciters);
    Logger.log('🎙️ Loaded reciters:', uniqueReciters.length);
  } catch (error) {
    console.error('❌ Error loading settings:', error);
    setReciters([]);
  }
};

  const updateSetting = async (key, value) => {
  try {
    // Use the hook's update method
    const success = await updateSettingHook(key, value);
    
    if (!success) {
      Alert.alert('Error', 'Failed to update setting. Please try again.');
    }
  } catch (error) {
    console.error('Error updating setting:', error);
    Alert.alert('Error', 'Failed to update setting. Please try again.');
  }
};
  const updateNotificationSetting = async (key, value) => {
  try {
    const newSettings = { ...notificationSettings, [key]: value };
    setNotificationSettings(newSettings);
    
    console.log('⚙️ Updating notification setting:', key, value);
    
    // Save settings first
    await NotificationService.saveNotificationSettings(
      key === 'morningTime' ? value : newSettings.morningTime,
      key === 'eveningTime' ? value : newSettings.eveningTime,
      newSettings.enabled
    );
    
    // Handle different setting changes
    if (key === 'enabled') {
      if (value) {
        // Enabling notifications - schedule them
        setTimeout(async () => {
          await NotificationService.scheduleNotifications(
            newSettings.morningTime,
            newSettings.eveningTime,
            settings.dailyGoal
          );
          console.log('📅 Notifications enabled and scheduled');
        }, 1000);
      } else {
        // Disabling notifications - cancel all
        await Notifications.cancelAllScheduledNotificationsAsync();
        console.log('🔕 All notifications cancelled');
      }
    } else if (newSettings.enabled && (key === 'morningTime' || key === 'eveningTime')) {
      // Time changed and notifications are enabled - reschedule
      setTimeout(async () => {
        await NotificationService.scheduleNotifications(
          newSettings.morningTime,
          newSettings.eveningTime,
          settings.dailyGoal
        );
        console.log('⏰ Notification times updated and rescheduled');
      }, 1000);
    }
    
    console.log('✅ Notification settings updated successfully');
  } catch (error) {
    console.error('❌ Error updating notification setting:', error);
  }
};

const handleTimeChange = (event, selectedTime, isEvening = false) => {
  setShowMorningTimePicker(false);
  setShowEveningTimePicker(false);
  
  if (selectedTime) {
    const timeObj = {
      hour: selectedTime.getHours(),
      minute: selectedTime.getMinutes()
    };
    
    console.log(`Setting ${isEvening ? 'evening' : 'morning'} time:`, timeObj);
    
    if (isEvening) {
      setEveningTimeDate(selectedTime);
      updateNotificationSetting('eveningTime', timeObj);
    } else {
      setMorningTimeDate(selectedTime);
      updateNotificationSetting('morningTime', timeObj);
    }
  }
};

const formatTime = (timeObj) => {
  const date = new Date(2024, 0, 1, timeObj.hour, timeObj.minute);
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });
};

  const getFontSize = (sizeCategory) => {
    const sizes = {
      'Small': 18,
      'Medium': 24,
      'Large': 30,
      'Extra Large': 36
    };
    return sizes[sizeCategory] || 24;
  };

  const getTranslationFontSize = (sizeCategory) => {
    const sizes = {
      'Small': 12,
      'Medium': 16,
      'Large': 20,
      'Extra Large': 24
    };
    return sizes[sizeCategory] || 16;
  };

  const showFontPreview = (fontSize) => {
    setPreviewFontSize(fontSize);
    setFontPreviewModal(true);
  };

  const settingSections = [
  {
    title: '👤 Account Settings',
    icon: { name: 'person', type: 'Ionicons' },
    items: [
      {
        type: 'button',
        title: 'Your Name',
        subtitle: `Current: ${settings.userName}`,
        icon: { name: 'person-outline', type: 'Ionicons' },
        onPress: () => {
          setShowNameModal(true);
        }
      },
      {
        type: 'button',
        title: 'Daily Target',
        subtitle: `${settings.dailyGoal} ayahs per day`,
        icon: { name: 'target', type: 'Ionicons' },
        onPress: () => setShowDailyTargetModal(true)
      },
      {
        type: 'button',
        title: 'Delete All Data',
        subtitle: 'Permanently delete all your memorization progress',
        icon: { name: 'trash', type: 'Ionicons' },
        onPress: () => {
          Alert.alert(
            'Delete All Data?',
            'This will permanently delete all your memorization progress, achievements, and settings. This action cannot be undone.\n\nAre you absolutely sure?',
            [
              { text: 'Cancel', style: 'cancel' },
              { 
                text: 'Delete Everything', 
                style: 'destructive',
                onPress: async () => {
                  Alert.alert(
                    'Final Confirmation',
                    'This is your last chance. All your Quran memorization data will be permanently deleted.',
                    [
                      { text: 'Cancel', style: 'cancel' },
                      {
                        text: 'Yes, Delete All',
                        style: 'destructive',
                        onPress: async () => {
                          await StorageService.clearState();
                          Alert.alert(
                            'Data Deleted',
                            'All your data has been permanently deleted. The app will now restart.',
                            [
                              { 
                                text: 'OK', 
                                onPress: () => navigation.reset({
                                  index: 0,
                                  routes: [{ name: 'Onboarding' }],
                                })
                              }
                            ]
                          );
                        }
                      }
                    ]
                  );
                }
              }
            ]
          );
        },
        dangerous: true
      }
    ]
  },
  {
    title: '🔔 Notifications',
    icon: { name: 'notifications', type: 'Ionicons' },
    items: [
      {
        type: 'switch',
        title: 'Daily Reminders',
        subtitle: 'Receive daily Quran memorization reminders',
        value: notificationSettings.enabled,
        onValueChange: (value) => updateNotificationSetting('enabled', value)
      },
      {
        type: 'button',
        title: 'Morning Reminder',
        subtitle: `${formatTime(notificationSettings.morningTime)} (preferably after Fajr)`,
        icon: { name: 'sunny', type: 'Ionicons' },
        onPress: () => {
          setShowEveningTimePicker(false);
          setShowMorningTimePicker(true);
        }
      },
      {
        type: 'button',
        title: 'Evening Reminder',
        subtitle: `${formatTime(notificationSettings.eveningTime)} (after work/school)`,
        icon: { name: 'moon', type: 'Ionicons' },
        onPress: () => {
          setShowMorningTimePicker(false);
          setShowEveningTimePicker(true);
        }
      }
    ]
  },
  {
    title: '🔊 Audio Settings',
    icon: { name: 'volume-high', type: 'Ionicons' },
    items: [
      {
        type: 'switch',
        title: 'Auto-play Next Ayah',
        subtitle: 'Automatically play the next ayah when current finishes',
        value: settings.autoPlayNext,
        onValueChange: (value) => updateSetting('autoPlayNext', value)
      },
      {
        type: 'button',
        title: 'Reciter',
        subtitle: selectedReciterId 
          ? reciters.find(r => r.id === selectedReciterId)?.name || 'Mishary Alafasy'
          : 'Mishary Alafasy (Default)',
        icon: { name: 'mic', type: 'Ionicons' },
        onPress: () => setShowReciterModal(true)
      }
    ]
  },
  {
    title: '🎨 Display Settings', 
    icon: { name: 'color-palette', type: 'Ionicons' },
    items: [
      {
        type: 'switch',
        title: 'Dark Mode',
        subtitle: 'Easy on the eyes for night reading',
        value: settings.darkMode,
        onValueChange: (value) => updateSetting('darkMode', value)
      },
      {
        type: 'switch',
        title: 'Show Translations',
        subtitle: 'Display English translations below Arabic text',
        value: settings.showTranslations,
        onValueChange: (value) => updateSetting('showTranslations', value)
      },
      {
        type: 'button',
        title: 'Arabic Script Type',
        subtitle: `Current: ${settings.scriptType.charAt(0).toUpperCase() + settings.scriptType.slice(1)}`,
        icon: { name: 'text', type: 'Ionicons' },
        onPress: () => {
          Alert.alert(
            'Arabic Script Type',
            'Choose your preferred Quran script style',
            [
              { 
                text: 'Uthmani (Madina)', 
                onPress: () => updateSetting('scriptType', 'uthmani')
              },
              { 
                text: 'IndoPak', 
                onPress: () => updateSetting('scriptType', 'indopak')
              },
              { 
                text: 'Tajweed (Color-coded)', 
                onPress: () => updateSetting('scriptType', 'tajweed')
              },
              { text: 'Cancel', style: 'cancel' }
            ]
          );
        }
      },
      {
        type: 'button',
        title: 'Arabic Font Size',
        subtitle: `Current: ${settings.arabicFontSize}`,
        icon: { name: 'text', type: 'Ionicons' },
        onPress: () => {
          Alert.alert(
            'Arabic Font Size',
            'Choose your preferred size for Arabic text',
            [
              { 
                text: 'Small', 
                onPress: () => {
                  setPreviewFontSize('Small');
                  setFontPreviewModal(true);
                }
              },
              { 
                text: 'Medium', 
                onPress: () => {
                  setPreviewFontSize('Medium');
                  setFontPreviewModal(true);
                }
              },
              { 
                text: 'Large', 
                onPress: () => {
                  setPreviewFontSize('Large');
                  setFontPreviewModal(true);
                }
              },
              { 
                text: 'Extra Large', 
                onPress: () => {
                  setPreviewFontSize('Extra Large');
                  setFontPreviewModal(true);
                }
              },
              { text: 'Cancel', style: 'cancel' }
            ]
          );
        }
      },
      {
        type: 'button',
        title: 'Translation Font Size',
        subtitle: `Current: ${settings.translationFontSize}`,
        icon: { name: 'text-outline', type: 'Ionicons' },
        onPress: () => {
          Alert.alert(
            'Translation Font Size',
            'Choose your preferred size for translation text',
            [
              { 
                text: 'Small', 
                onPress: () => {
                  setPreviewFontSize(settings.arabicFontSize);
                  setSettings(prev => ({ ...prev, translationFontSize: 'Small' }));
                  updateSetting('translationFontSize', 'Small');
                  setFontPreviewModal(true);
                }
              },
              { 
                text: 'Medium', 
                onPress: () => {
                  setPreviewFontSize(settings.arabicFontSize);
                  setSettings(prev => ({ ...prev, translationFontSize: 'Medium' }));
                  updateSetting('translationFontSize', 'Medium');
                  setFontPreviewModal(true);
                }
              },
              { 
                text: 'Large', 
                onPress: () => {
                  setPreviewFontSize(settings.arabicFontSize);
                  setSettings(prev => ({ ...prev, translationFontSize: 'Large' }));
                  updateSetting('translationFontSize', 'Large');
                  setFontPreviewModal(true);
                }
              },
              { 
                text: 'Extra Large', 
                onPress: () => {
                  setPreviewFontSize(settings.arabicFontSize);
                  setSettings(prev => ({ ...prev, translationFontSize: 'Extra Large' }));
                  updateSetting('translationFontSize', 'Extra Large');
                  setFontPreviewModal(true);
                }
              },
              { text: 'Cancel', style: 'cancel' }
            ]
          );
        }
      },
    ]
  },
  {
    title: '🔒 Data & Privacy',
    icon: { name: 'shield-checkmark', type: 'Ionicons' },
    items: [
      {
        type: 'button',
        title: 'Privacy Policy',
        subtitle: 'How we handle your data',
        icon: { name: 'document-text', type: 'Ionicons' },
        onPress: () => navigation.navigate('PrivacyPolicy')
      },
      {
        type: 'button',
        title: 'Terms of Service',
        subtitle: 'App usage terms and conditions',
        icon: { name: 'document', type: 'Ionicons' },
        onPress: () => navigation.navigate('TermsOfService')
      },
      {
        type: 'button',
        title: 'Export Data Backup',
        subtitle: 'Save your progress to share or backup',
        icon: { name: 'cloud-upload', type: 'Ionicons' },
        onPress: () => {
          Alert.alert('Coming Soon', 'Data export feature will be available in the next update.');
        }
      },
      {
        type: 'button',
        title: 'Import Data Backup',
        subtitle: 'Restore progress from a backup file',
        icon: { name: 'cloud-download', type: 'Ionicons' },
        onPress: () => {
          Alert.alert('Coming Soon', 'Data import feature will be available in the next update.');
        }
      },
      {
        type: 'button',
        title: 'About This App',
        subtitle: 'Version info and credits',
        icon: { name: 'information-circle', type: 'Ionicons' },
        onPress: () => navigation.navigate('About')
      }
    ]
  },
  ...(__DEV__ ? [{
    title: '🧪 Testing & Diagnostics',
    icon: { name: 'flask', type: 'Ionicons' },
    items: [
      {
        type: 'button',
        title: 'Run Diagnostics',
        subtitle: 'Test app functionality and performance',
        icon: { name: 'bug', type: 'Ionicons' },
        onPress: async () => {
          const results = await TestingUtils.runDiagnostics();
          TestingUtils.showDiagnosticResults(results);
        }
      },
      {
        type: 'button',
        title: 'Load Test Data',
        subtitle: 'Generate sample progress for testing',
        icon: { name: 'flask-outline', type: 'Ionicons' },
        onPress: TestingUtils.loadTestData
      }
    ]
  }] : [])
];

return (
  <React.Fragment>
    <ScreenLayout scrollable={true}>
      <ScreenHeader 
        title="Settings"
        onBack={() => navigation.goBack()}
      />
      
      <View style={styles.content}>
        {settingSections.map((section, sectionIndex) => (
          <View key={sectionIndex} style={styles.section}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            {section.items.map((item, itemIndex) => {
  if (item.type === 'switch') {
    return (
      <SwitchItem
        key={itemIndex}
        title={item.title}
        subtitle={item.subtitle}
        value={item.value}
        onValueChange={item.onValueChange}
        darkMode={settings.darkMode}
        themedColors={themedColors}
      />
    );
  } else {
    return (
      <SettingItem
        key={itemIndex}
        title={item.title}
        subtitle={item.subtitle}
        onPress={item.onPress}
        dangerous={item.dangerous}
        darkMode={settings.darkMode}
        themedColors={themedColors}
      />
    );
  }
})}
          </View>
        ))}
      </View>
    </ScreenLayout>

    {/* Font Preview Modal */}
    <FontPreviewModal
      visible={fontPreviewModal}
      onClose={() => setFontPreviewModal(false)}
      arabicFontSize={previewFontSize}
      translationFontSize={settings.translationFontSize}
      onApply={() => updateSetting('arabicFontSize', previewFontSize)}
      darkMode={settings.darkMode}
      themedColors={themedColors}
    />

    {/* Morning Time Picker */}
    <CustomTimePicker
      visible={showMorningTimePicker}
      onClose={() => setShowMorningTimePicker(false)}
      onSave={(time) => {
        setMorningTimeDate(new Date(2024, 0, 1, time.hour, time.minute));
        updateNotificationSetting('morningTime', time);
      }}
      initialTime={{ 
        hour: morningTimeDate.getHours(), 
        minute: morningTimeDate.getMinutes() 
      }}
      title="Morning Reminder"
      subtitle="Preferably after Fajr prayer"
    />

    {/* Evening Time Picker */}
    <CustomTimePicker
      visible={showEveningTimePicker}
      onClose={() => setShowEveningTimePicker(false)}
      onSave={(time) => {
        setEveningTimeDate(new Date(2024, 0, 1, time.hour, time.minute));
        updateNotificationSetting('eveningTime', time);
      }}
      initialTime={{ 
        hour: eveningTimeDate.getHours(), 
        minute: eveningTimeDate.getMinutes() 
      }}
      title="Evening Reminder"
      subtitle="When done from work/school"
    />

    {/* Name Modal */}
    <UserNameModal
      visible={showNameModal}
      onClose={() => setShowNameModal(false)}
      currentName={settings.userName}
      onSave={(newName) => updateSetting('userName', newName)}
      darkMode={settings.darkMode}
      themedColors={themedColors}
    />

    {/* Daily Target Modal */}
    <DailyTargetModal
      visible={showDailyTargetModal}
      onClose={() => setShowDailyTargetModal(false)}
      currentTarget={settings.dailyGoal}
      onSelect={(target) => updateSetting('dailyGoal', target)}
      darkMode={settings.darkMode}
      themedColors={themedColors}
    />

    {/* Reciter Selection Modal */}
    <ReciterSelectionModal
      visible={showReciterModal}
      onClose={() => setShowReciterModal(false)}
      reciters={reciters}
      selectedReciterId={selectedReciterId}
      onSelect={(reciterId) => {
        setSelectedReciterId(reciterId);
        updateSetting('selectedReciter', reciterId);
      }}
      loading={reciters.length === 0}
      darkMode={settings.darkMode}
      themedColors={themedColors}
    />
  </React.Fragment>
);
}
const styles = StyleSheet.create({
  content: {
    paddingHorizontal: Theme.spacing.lg,
    paddingTop: Theme.spacing.md,
  },
  section: {
  marginBottom: Theme.spacing.xl,
  paddingHorizontal: Theme.spacing.xs,
},
  sectionTitle: {
  fontSize: Theme.typography.fontSize.lg,
  fontWeight: Theme.typography.fontWeight.bold,
  color: Theme.colors.textOnDark,
  marginBottom: Theme.spacing.md,
  marginLeft: Theme.spacing.xs,
},
  settingItem: {
  flexDirection: 'row',
  backgroundColor: 'rgba(255, 255, 255, 0.95)',
  borderRadius: Theme.borderRadius.lg,
  padding: Theme.spacing.lg,
  marginBottom: Theme.spacing.md,
  alignItems: 'center',
  ...Theme.shadows.sm,
},
  dangerousItem: {
    backgroundColor: '#ff3b30',
    borderWidth: 1,
    borderColor: '#ff3b30',
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Theme.colors.primary,
    marginBottom: 2,
  },
  dangerousText: {
    color: 'white',
  },
  settingSubtitle: {
    fontSize: 14,
    color: '#666',
  },
  settingArrow: {
    fontSize: 18,
    color: Theme.colors.secondary,
    fontWeight: 'bold',
  },
  settingsTimePickerOverlay: {
  flex: 1,
  backgroundColor: 'rgba(0, 0, 0, 0.7)',
  justifyContent: 'center',
  alignItems: 'center',
  paddingHorizontal: 20,
},
settingsTimePickerModal: {
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
settingsTimePickerTitle: {
  fontSize: 20,
  fontWeight: 'bold',
  color: Theme.colors.primary,
  textAlign: 'center',
  marginBottom: 8,
},
settingsTimePickerSubtitle: {
  fontSize: 14,
  color: '#666',
  textAlign: 'center',
  marginBottom: 20,
  fontStyle: 'italic',
},
settingsTimePickerButtons: {
  flexDirection: 'row',
  gap: 12,
  marginTop: 20,
  width: '100%',
},
settingsTimePickerCancelButton: {
  flex: 1,
  backgroundColor: '#f5f5f5',
  borderRadius: 12,
  paddingVertical: 12,
  alignItems: 'center',
},
settingsTimePickerConfirmButton: {
  flex: 1,
  backgroundColor: Theme.colors.secondary,
  borderRadius: 12,
  paddingVertical: 12,
  alignItems: 'center',
},
settingsTimePickerCancelText: {
  color: '#666',
  fontSize: 16,
  fontWeight: '600',
},
settingsTimePickerConfirmText: {
  color: 'white',
  fontSize: 16,
  fontWeight: '600',
},
reciterModal: {
  backgroundColor: 'white',
  borderRadius: 20,
  padding: 0,
  width: '90%',
  maxWidth: 400,
  maxHeight: '70%',
},
reciterList: {
  maxHeight: 400,
},
reciterItem: {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  paddingVertical: 16,
  paddingHorizontal: 20,
  borderBottomWidth: 1,
  borderBottomColor: Theme.colors.gray200,
},
selectedReciterItem: {
  backgroundColor: Theme.colors.successLight,
},
reciterName: {
  fontSize: 16,
  fontWeight: '600',
  color: Theme.colors.primary,
  marginBottom: 4,
},
reciterStyle: {
  fontSize: 14,
  color: Theme.colors.textMuted,
},
modernTimePickerOverlay: {
  flex: 1,
  backgroundColor: 'rgba(0, 0, 0, 0.7)',
  justifyContent: 'center',
  alignItems: 'center',
  paddingHorizontal: 20,
},
modernTimePickerModal: {
  backgroundColor: 'white',
  borderRadius: 24,
  padding: 30,
  width: '100%',
  maxWidth: 350,
  alignItems: 'center',
  elevation: 10,
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 5 },
  shadowOpacity: 0.3,
  shadowRadius: 10,
},
modernTimePickerTitle: {
  fontSize: 22,
  fontWeight: 'bold',
  color: Theme.colors.primary,
  marginBottom: 8,
  textAlign: 'center',
},
modernTimePickerSubtitle: {
  fontSize: 14,
  color: '#666',
  marginBottom: 30,
  textAlign: 'center',
  fontStyle: 'italic',
},
modernTimeDisplay: {
  backgroundColor: Theme.colors.gray100,
  borderRadius: 16,
  paddingVertical: 20,
  paddingHorizontal: 30,
  marginBottom: 30,
},
modernTimeText: {
  fontSize: 32,
  fontWeight: 'bold',
  color: Theme.colors.primary,
  textAlign: 'center',
},
timeControls: {
  flexDirection: 'row',
  gap: 40,
  marginBottom: 30,
},
timeControlGroup: {
  alignItems: 'center',
},
timeControlLabel: {
  fontSize: 14,
  color: '#666',
  marginBottom: 16,
  fontWeight: '600',
},
timeControlButtons: {
  alignItems: 'center',
  gap: 12,
},
timeControlButton: {
  backgroundColor: Theme.colors.secondary,
  borderRadius: 12,
  width: 44,
  height: 44,
  justifyContent: 'center',
  alignItems: 'center',
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.1,
  shadowRadius: 4,
  elevation: 2,
},
timeControlButtonText: {
  fontSize: 24,
  fontWeight: 'bold',
  color: 'white',
},
timeControlValue: {
  fontSize: 24,
  fontWeight: 'bold',
  color: Theme.colors.primary,
  minWidth: 40,
  textAlign: 'center',
},
modernTimePickerButtons: {
  flexDirection: 'row',
  gap: 16,
  width: '100%',
},
modernTimePickerCancelButton: {
  flex: 1,
  backgroundColor: '#f5f5f5',
  borderRadius: 16,
  paddingVertical: 16,
  alignItems: 'center',
},
modernTimePickerConfirmButton: {
  flex: 1,
  backgroundColor: Theme.colors.secondary,
  borderRadius: 16,
  paddingVertical: 16,
  alignItems: 'center',
},
modernTimePickerCancelText: {
  color: '#666',
  fontSize: 16,
  fontWeight: '600',
},
modernTimePickerConfirmText: {
  color: 'white',
  fontSize: 16,
  fontWeight: '600',
},
reciterNote: {
  fontSize: 12,
  color: Theme.colors.textMuted,
  marginTop: 4,
  fontStyle: 'italic',
},
peacefulReciterCard: {
  backgroundColor: Theme.colors.white,
  borderRadius: 16,
  marginBottom: 12,
  borderWidth: 2,
  borderColor: Theme.colors.gray200,
  ...Theme.shadows.sm,
},
selectedPeacefulCard: {
  borderColor: Theme.colors.secondary,
  backgroundColor: Theme.colors.successLight,
  ...Theme.shadows.md,
},
reciterAvatar: {
  width: 56,
  height: 56,
  borderRadius: 28,
  backgroundColor: Theme.colors.gray100,
  justifyContent: 'center',
  alignItems: 'center',
  marginRight: 16,
},
selectedAvatar: {
  backgroundColor: Theme.colors.secondary,
},
reciterInitial: {
  fontSize: 24,
  fontWeight: 'bold',
  color: Theme.colors.primary,
},
reciterCardTranslated: {
  fontSize: 13,
  color: Theme.colors.textSecondary,
  marginBottom: 2,
},
reciterBadge: {
  alignSelf: 'flex-start',
  backgroundColor: Theme.colors.secondary,
  paddingHorizontal: 8,
  paddingVertical: 3,
  borderRadius: 6,
  marginTop: 6,
},
reciterBadgeText: {
  fontSize: 10,
  fontWeight: '700',
  color: Theme.colors.textOnPrimary,
  letterSpacing: 0.3,
},
noResultsContainer: {
  alignItems: 'center',
  paddingVertical: 48,
},
noResultsText: {
  fontSize: 14,
  color: Theme.colors.textSecondary,
  textAlign: 'center',
  marginTop: 16,
  lineHeight: 20,
},
modalBackdrop: {
  flex: 1,
},
reciterModalOverlay: {
  flex: 1,
  backgroundColor: 'rgba(0, 0, 0, 0.75)',
  justifyContent: 'flex-end',
},
});