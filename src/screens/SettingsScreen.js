import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Switch, Modal } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { StorageService } from '../services/StorageService';
import { TestingUtils } from '../utils/TestingUtils';
import { Logger } from '../utils/Logger'

export default function SettingsScreen({ navigation }) {
  const [settings, setSettings] = useState({
  // Audio Settings
  autoPlayNext: false,
  
  // Display Settings
  showTranslations: true,
  arabicFontSize: 'Medium',
  translationFontSize: 'Medium',
  
  // App Settings
  dailyGoal: 10,
  userName: 'Student',
});

  const [fontPreviewModal, setFontPreviewModal] = useState(false);
  const [previewFontSize, setPreviewFontSize] = useState('Medium');

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const state = await StorageService.getState();
      if (state && state.settings) {
        setSettings(prev => ({
  ...prev,
  dailyGoal: state.settings.dailyGoal || 10,
  userName: state.settings.userName || 'Student',
  autoPlayNext: state.settings.autoPlayNext || false,
  showTranslations: state.settings.showTranslations !== false,
  arabicFontSize: state.settings.arabicFontSize || 'Medium',
  translationFontSize: state.settings.translationFontSize || 'Medium',
}));
      }
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
        <View style={styles.fontPreviewModal}>
          <Text style={styles.modalTitle}>Font Size Preview</Text>
          
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
      style={[styles.settingItem, dangerous && styles.dangerousItem]}
      onPress={onPress}
      disabled={!onPress}
    >
      <View style={styles.settingContent}>
        <Text style={[styles.settingTitle, dangerous && styles.dangerousText]}>
          {title}
        </Text>
        <Text style={[styles.settingSubtitle, dangerous && { color: 'rgba(255, 255, 255, 0.8)' }]}>
          {subtitle}
        </Text>
      </View>
      {rightComponent || <Text style={[styles.settingArrow, dangerous && { color: 'white' }]}>→</Text>}
    </TouchableOpacity>
  );

  const SwitchItem = ({ title, subtitle, value, onValueChange }) => (
    <View style={styles.settingItem}>
      <View style={styles.settingContent}>
        <Text style={styles.settingTitle}>{title}</Text>
        <Text style={styles.settingSubtitle}>{subtitle}</Text>
      </View>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: '#ccc', true: '#d4af37' }}
        thumbColor={value ? '#004d24' : '#f4f3f4'}
      />
    </View>
  );

  const settingSections = [
    {
      title: '🎵 Audio Settings',
      items: [
        {
          type: 'switch',
          title: 'Auto-play Next Ayah',
          subtitle: 'Automatically play the next ayah when current finishes',
          value: settings.autoPlayNext,
          onValueChange: (value) => updateSetting('autoPlayNext', value)
        }
      ]
    },
    {
      title: '🎨 Display Settings',
      items: [
        {
          type: 'switch',
          title: 'Show Translations',
          subtitle: 'Display English translations below Arabic text',
          value: settings.showTranslations,
          onValueChange: (value) => updateSetting('showTranslations', value)
        },
        {
  type: 'button',
  title: 'Arabic Font Size',
  subtitle: `Current: ${settings.arabicFontSize}`,
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
  items: [
    {
      type: 'button',
      title: 'Privacy Policy',
      subtitle: 'How we handle your data',
      onPress: () => navigation.navigate('PrivacyPolicy')
    },
    {
      type: 'button',
      title: 'Terms of Service',
      subtitle: 'App usage terms and conditions',
      onPress: () => navigation.navigate('TermsOfService')
    },
    {
      type: 'button',
      title: 'Export Data Backup',
      subtitle: 'Save your progress to share or backup',
      onPress: () => {
        Alert.alert('Coming Soon', 'Data export feature will be available in the next update.');
      }
    },
    {
      type: 'button',
      title: 'Import Data Backup',
      subtitle: 'Restore progress from a backup file',
      onPress: () => {
        Alert.alert('Coming Soon', 'Data import feature will be available in the next update.');
      }
    },
    {
      type: 'button',
      title: 'About This App',
      subtitle: 'Version info and credits',
      onPress: () => navigation.navigate('About')
    }
  ]
},
    {
      title: '🧪 Testing & Diagnostics',
      items: [
        {
          type: 'button',
          title: 'Run Diagnostics',
          subtitle: 'Test app functionality and performance',
          onPress: async () => {
            const results = await TestingUtils.runDiagnostics();
            TestingUtils.showDiagnosticResults(results);
          }
        },
        {
          type: 'button',
          title: 'Load Test Data',
          subtitle: 'Generate sample progress for testing',
          onPress: TestingUtils.loadTestData
        },
        {
          type: 'button',
          title: 'Reset All Data',
          subtitle: 'Delete all progress and restart',
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
    }
  ];

  return (
    <SafeAreaProvider>
      <LinearGradient colors={['#004d24', '#058743']} style={styles.container}>
        <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
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
    color: '#004d24',
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
    color: '#d4af37',
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
    color: '#004d24',
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
    color: '#004d24',
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
});