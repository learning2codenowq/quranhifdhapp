import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Switch, Modal, TextInput } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { StorageService } from '../services/StorageService';
import { NotificationService } from '../services/NotificationService';
import { TestingUtils } from '../utils/TestingUtils';
import { Logger } from '../utils/Logger'
import { Theme } from '../styles/theme';
import { Icon } from '../components/Icon';
import CustomTimePicker from '../components/CustomTimePicker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { getThemedColors } from '../styles/theme';
import { QuranService } from '../services/QuranService';


export default function SettingsScreen({ navigation }) {
  const [settings, setSettings] = useState({
  // Audio Settings
  autoPlayNext: false,
  
  // Display Settings
  showTranslations: true,
  arabicFontSize: 'Medium',
  translationFontSize: 'Medium',
  darkMode: false, 
  tajweedHighlighting: false, 
  scriptType: 'uthmani',
  
  // App Settings
  dailyGoal: 10,
  userName: 'Student',
});
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

  const loadSettings = async () => {
  try {
    const state = await StorageService.getState();
    if (state && state.settings) {
      const newSettings = {
        dailyGoal: state.settings.dailyGoal || 10,
        userName: state.settings.userName || 'Student',
        autoPlayNext: state.settings.autoPlayNext || false,
        showTranslations: state.settings.showTranslations !== false,
        arabicFontSize: state.settings.arabicFontSize || 'Medium',
        translationFontSize: state.settings.translationFontSize || 'Medium',
        selectedReciter: state.settings.selectedReciter || null,
        darkMode: state.settings.darkMode || false,  // NEW
        tajweedHighlighting: state.settings.tajweedHighlighting || false,  // NEW
        scriptType: state.settings.scriptType || 'uthmani',  // NEW
      };
      Logger.log('🎵 Loaded settings:', newSettings);
      setSettings(newSettings);
      setSelectedReciterId(newSettings.selectedReciter);
    }
    
    const recitersList = await QuranService.getReciters();
    setReciters(recitersList);
    
    const notifSettings = await NotificationService.getNotificationSettings();
    setNotificationSettings(notifSettings);
    
    setMorningTimeDate(new Date(2024, 0, 1, notifSettings.morningTime.hour, notifSettings.morningTime.minute));
    setEveningTimeDate(new Date(2024, 0, 1, notifSettings.eveningTime.hour, notifSettings.eveningTime.minute));
  } catch (error) {
    console.error('Error loading settings:', error);
  }
};

  const updateSetting = async (key, value) => {
    try {
      const newSettings = { ...settings, [key]: value };
      setSettings(newSettings);
      
      const state = await StorageService.getState();
      if (!state.settings) state.settings = {};
      state.settings[key] = value;
      await StorageService.saveState(state);
    } catch (error) {
      console.error('Error updating setting:', error);
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

  const FontPreviewModal = () => (
    <Modal visible={fontPreviewModal} transparent={true} animationType="slide">
      <View style={styles.modalOverlay}>
        <View style={[
  styles.fontPreviewModal,
  settings.darkMode && { backgroundColor: themedColors.cardBackground }
]}>
          <Text style={[
  styles.modalTitle,
  settings.darkMode && { color: themedColors.textPrimary }
]}>Font Size Preview</Text>
          
          <View style={styles.previewContainer}>
            <Text style={styles.previewLabel}>Arabic Text ({previewFontSize})</Text>
            <Text style={[
              styles.arabicPreview, 
              { 
                fontSize: getFontSize(previewFontSize),
                fontFamily: 'UthmanicFont'
              }
            ]}>
              بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ
            </Text>
            
            <Text style={styles.previewLabel}>Translation Text ({settings.translationFontSize})</Text>
            <Text style={[
              styles.translationPreview,
              { fontSize: getTranslationFontSize(settings.translationFontSize) }
            ]}>
              In the name of Allah, the Most Gracious, the Most Merciful.
            </Text>
          </View>

          <View style={styles.modalButtons}>
            <TouchableOpacity 
              style={styles.cancelButton}
              onPress={() => setFontPreviewModal(false)}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.applyButton}
              onPress={() => {
                updateSetting('arabicFontSize', previewFontSize);
                setFontPreviewModal(false);
              }}
            >
              <Text style={styles.applyButtonText}>Apply</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );

  const SettingItem = ({ title, subtitle, onPress, rightComponent, dangerous = false }) => (
  <TouchableOpacity
    style={[
      styles.settingItem, 
      dangerous && styles.dangerousItem,
      settings.darkMode && !dangerous && { backgroundColor: themedColors.cardBackground }
    ]}
    onPress={onPress}
    disabled={!onPress}
    accessible={true}
    accessibilityLabel={title}
    accessibilityHint={subtitle}
    accessibilityRole="button"
  >
    <View style={styles.settingContent}>
      <Text style={[
        styles.settingTitle, 
        dangerous && styles.dangerousText,
        settings.darkMode && !dangerous && { color: themedColors.textPrimary }
      ]}>
        {title}
      </Text>
      <Text style={[
        styles.settingSubtitle, 
        dangerous && { color: 'rgba(255, 255, 255, 0.8)' },
        settings.darkMode && !dangerous && { color: themedColors.textSecondary }
      ]}>
        {subtitle}
      </Text>
    </View>
    {rightComponent || (
      <Text style={[
        styles.settingArrow, 
        dangerous && { color: 'white' },
        settings.darkMode && !dangerous && { color: themedColors.secondary }
      ]}>
        →
      </Text>
    )}
  </TouchableOpacity>
);

  const SwitchItem = ({ title, subtitle, value, onValueChange, dangerous = false }) => (
    <View style={[
  styles.settingItem,
  dangerous && styles.dangerousItem,
  settings.darkMode && !dangerous && { backgroundColor: themedColors.cardBackground }
]}>
      <View style={styles.settingContent}>
        <Text style={styles.settingTitle}>{title}</Text>
        <Text style={styles.settingSubtitle}>{subtitle}</Text>
      </View>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: '#ccc', true: Theme.colors.secondary }}
        thumbColor={value ? Theme.colors.primary : '#f4f3f4'}
      />
    </View>
  );

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
    setShowEveningTimePicker(false); // Close evening if open
    setShowMorningTimePicker(true);
  }
},
{
  type: 'button',
  title: 'Evening Reminder',
  subtitle: `${formatTime(notificationSettings.eveningTime)} (after work/school)`,
  icon: { name: 'moon', type: 'Ionicons' },
  onPress: () => {
    setShowMorningTimePicker(false); // Close morning if open
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
      // NEW ITEM - Add this entire block
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
      },
      {
        type: 'button',
        title: 'Reset All Data',
        subtitle: 'Delete all progress and restart',
        icon: { name: 'trash', type: 'Ionicons' },
        onPress: () => {
          Alert.alert(
            'Reset All Data',
            'This will permanently delete all your memorization progress and restart the onboarding. Are you sure?',
            [
              { text: 'Cancel', style: 'cancel' },
              { 
                text: 'Reset', 
                style: 'destructive',
                onPress: async () => {
                  await StorageService.clearState();
                  Alert.alert('Data Reset', 'All data has been deleted.', [
                    { 
                      text: 'OK', 
                      onPress: () => navigation.reset({
                        index: 0,
                        routes: [{ name: 'Onboarding' }],
                      })
                    }
                  ]);
                }
              }
            ]
          );
        },
        dangerous: true
      }
    ]
  }] : [])
];

  const themedColors = getThemedColors(settings.darkMode);

return (
  <SafeAreaProvider>
    <LinearGradient 
      colors={settings.darkMode ? themedColors.gradients.primary : Theme.gradients.primary} 
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right', 'bottom']}>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Text style={styles.backText}>← Dashboard</Text>
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Settings</Text>
          </View>

          <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
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
                      />
                    );
                  }
                })}
              </View>
            ))}
          </ScrollView>

          <FontPreviewModal />
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
{/* Name Change Modal */}
<Modal visible={showNameModal} transparent={true} animationType="slide">
  <View style={styles.modalOverlay}>
    <View style={[
  styles.nameModal,
  settings.darkMode && { backgroundColor: themedColors.cardBackground }
]}>
      <Text style={[
  styles.namemodalTitle,
  settings.darkMode && { color: themedColors.textPrimary }
]}>Change Your Name</Text>
      <TextInput
        style={styles.nameInput}
        placeholder="Enter your name"
        value={tempUserName}
        onChangeText={setTempUserName}
        autoFocus={true}
        onSubmitEditing={() => {
          if (tempUserName && tempUserName.trim().length > 0) {
            updateSetting('userName', tempUserName.trim());
            setShowNameModal(false);
            setTempUserName('');
            Alert.alert('Success', 'Your name has been updated!');
          }
        }}
      />
      <View style={styles.nameModalButtons}>
        <TouchableOpacity 
          style={styles.nameModalCancelButton}
          onPress={() => {
            setShowNameModal(false);
            setTempUserName('');
          }}
        >
          <Text style={styles.nameModalCancelText}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.nameModalSaveButton}
          onPress={() => {
            if (tempUserName && tempUserName.trim().length > 0) {
              updateSetting('userName', tempUserName.trim());
              setShowNameModal(false);
              setTempUserName('');
              Alert.alert('Success', 'Your name has been updated!');
            } else {
              Alert.alert('Invalid Name', 'Please enter a valid name.');
            }
          }}
        >
          <Text style={styles.nameModalSaveText}>Save</Text>
        </TouchableOpacity>
      </View>
    </View>
  </View>
</Modal>
{/* Daily Target Modal */}
<Modal visible={showDailyTargetModal} transparent={true} animationType="slide">
  <View style={styles.modalOverlay}>
    <View style={[
  styles.dailyTargetModal,
  settings.darkMode && { backgroundColor: themedColors.cardBackground }
]}>
      <Text style={[
  styles.dailytargetmodalTitle,
  settings.darkMode && { color: themedColors.textPrimary }
]}>Daily Target</Text>
      <Text style={styles.dailyTargetModalSubtitle}>Choose your daily memorization goal:</Text>
      
      <View style={styles.targetOptions}>
        {[5, 10, 15, 20].map((target) => (
          <TouchableOpacity
            key={target}
            style={[
              styles.targetOption,
              settings.dailyGoal === target && styles.selectedTargetOption
            ]}
            onPress={() => {
              updateSetting('dailyGoal', target);
              setShowDailyTargetModal(false);
            }}
          >
            <Text style={[
              styles.targetOptionText,
              settings.dailyGoal === target && styles.selectedTargetOptionText
            ]}>
              {target} ayahs
            </Text>
            {target === 10 && (
              <Text style={styles.recommendedText}>Recommended</Text>
            )}
          </TouchableOpacity>
        ))}
      </View>
      
      <TouchableOpacity 
        style={styles.dailyTargetModalCancelButton}
        onPress={() => setShowDailyTargetModal(false)}
      >
        <Text style={styles.dailyTargetModalCancelText}>Cancel</Text>
      </TouchableOpacity>
    </View>
  </View>
</Modal>
{/* Reciter Selection Modal */}
<Modal visible={showReciterModal} transparent={true} animationType="slide">
  <View style={styles.modalOverlay}>
    <View style={[
  styles.reciterModal,
  settings.darkMode && { backgroundColor: themedColors.cardBackground }
]}>
      <View style={styles.modalHeader}>
        <Text style={[
  styles.modalTitle,
  settings.darkMode && { color: themedColors.textPrimary }
]}>Choose Reciter</Text>
        <TouchableOpacity onPress={() => setShowReciterModal(false)}>
          <Icon name="close" type="Ionicons" size={24} color={Theme.colors.textMuted} />
        </TouchableOpacity>
      </View>
      
      <ScrollView style={styles.reciterList}>
        {/* Default Option */}
        <TouchableOpacity
          style={[
            styles.reciterItem,
            !selectedReciterId && styles.selectedReciterItem
          ]}
          onPress={() => {
            setSelectedReciterId(null);
            updateSetting('selectedReciter', null);
            setShowReciterModal(false);
          }}
        >
          <View style={styles.reciterInfo}>
            <Text style={styles.reciterName}>Mishary Alafasy (Default)</Text>
            <Text style={styles.reciterStyle}>Hafs</Text>
          </View>
          {!selectedReciterId && (
            <Icon name="checkmark-circle" type="Ionicons" size={24} color={Theme.colors.success} />
          )}
        </TouchableOpacity>
        
        {/* Reciters List */}
        {reciters.map((reciter) => (
          <TouchableOpacity
            key={reciter.id}
            style={[
              styles.reciterItem,
              selectedReciterId === reciter.id && styles.selectedReciterItem
            ]}
            onPress={() => {
              setSelectedReciterId(reciter.id);
              updateSetting('selectedReciter', reciter.id);
              setShowReciterModal(false);
            }}
          >
            <View style={styles.reciterInfo}>
              <Text style={styles.reciterName}>{reciter.name}</Text>
              {reciter.style && (
                <Text style={styles.reciterStyle}>{reciter.style}</Text>
              )}
            </View>
            {selectedReciterId === reciter.id && (
              <Icon name="checkmark-circle" type="Ionicons" size={24} color={Theme.colors.success} />
            )}
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  </View>
</Modal>
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
    paddingTop: 20,
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  backText: {
    color: 'white',
    fontSize: 16,
    marginBottom: 15,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 15,
  },
  settingItem: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 15,
    padding: 15,
    marginBottom: 10,
    alignItems: 'center',
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  fontPreviewModal: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 25,
    width: '100%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Theme.colors.primary,
    textAlign: 'center',
    marginBottom: 25,
  },
  previewContainer: {
    marginBottom: 25,
  },
  previewLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
    marginTop: 15,
  },
  arabicPreview: {
    textAlign: 'center',
    color: Theme.colors.primary,
    marginBottom: 10,
    paddingVertical: 10,
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
  },
  translationPreview: {
    textAlign: 'center',
    color: '#666',
    paddingVertical: 10,
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    fontStyle: 'italic',
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    borderRadius: 15,
    paddingVertical: 12,
  },
  cancelButtonText: {
    color: '#666',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  applyButton: {
    flex: 1,
    backgroundColor: '#d4af37',
    borderRadius: 15,
    paddingVertical: 12,
  },
  applyButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
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
nameModal: {
  backgroundColor: 'white',
  borderRadius: 20,
  padding: 25,
  width: '90%',
  maxWidth: 350,
  alignItems: 'center',
},
nameModalTitle: {
  fontSize: 20,
  fontWeight: 'bold',
  color: Theme.colors.primary,
  marginBottom: 20,
  textAlign: 'center',
},
nameInput: {
  borderWidth: 2,
  borderColor: Theme.colors.gray200,
  borderRadius: 12,
  paddingHorizontal: 16,
  paddingVertical: 12,
  fontSize: 16,
  width: '100%',
  marginBottom: 20,
  color: Theme.colors.primary,
},
nameModalButtons: {
  flexDirection: 'row',
  gap: 12,
  width: '100%',
},
nameModalCancelButton: {
  flex: 1,
  backgroundColor: '#f5f5f5',
  borderRadius: 12,
  paddingVertical: 12,
  alignItems: 'center',
},
nameModalSaveButton: {
  flex: 1,
  backgroundColor: Theme.colors.secondary,
  borderRadius: 12,
  paddingVertical: 12,
  alignItems: 'center',
},
nameModalCancelText: {
  color: '#666',
  fontSize: 16,
  fontWeight: '600',
},
nameModalSaveText: {
  color: 'white',
  fontSize: 16,
  fontWeight: '600',
},
dailyTargetModal: {
  backgroundColor: 'white',
  borderRadius: 20,
  padding: 25,
  width: '90%',
  maxWidth: 350,
  alignItems: 'center',
},
dailyTargetModalTitle: {
  fontSize: 20,
  fontWeight: 'bold',
  color: Theme.colors.primary,
  marginBottom: 10,
  textAlign: 'center',
},
dailyTargetModalSubtitle: {
  fontSize: 14,
  color: '#666',
  marginBottom: 20,
  textAlign: 'center',
},
targetOptions: {
  width: '100%',
  marginBottom: 20,
},
targetOption: {
  borderWidth: 2,
  borderColor: Theme.colors.gray200,
  borderRadius: 12,
  paddingVertical: 15,
  paddingHorizontal: 20,
  marginBottom: 10,
  alignItems: 'center',
},
selectedTargetOption: {
  borderColor: Theme.colors.secondary,
  backgroundColor: Theme.colors.secondary + '20',
},
targetOptionText: {
  fontSize: 16,
  color: Theme.colors.primary,
  fontWeight: '600',
},
selectedTargetOptionText: {
  color: Theme.colors.secondary,
  fontWeight: 'bold',
},
recommendedText: {
  fontSize: 12,
  color: Theme.colors.secondary,
  fontWeight: 'bold',
  marginTop: 4,
},
dailyTargetModalCancelButton: {
  backgroundColor: '#f5f5f5',
  borderRadius: 12,
  paddingVertical: 12,
  paddingHorizontal: 30,
},
dailyTargetModalCancelText: {
  color: '#666',
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
reciterInfo: {
  flex: 1,
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
});