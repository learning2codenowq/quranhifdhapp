import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { StorageService } from '../services/StorageService';
import { TestingUtils } from '../utils/TestingUtils';

export default function SettingsScreen({ navigation }) {
  const [dailyGoal, setDailyGoal] = useState(10);
  const [userName, setUserName] = useState('Student');

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const state = await StorageService.getState();
      if (state && state.settings) {
        setDailyGoal(state.settings.dailyGoal || 10);
        setUserName(state.settings.userName || 'Student');
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  };

  const updateSetting = async (key, value) => {
    try {
      const state = await StorageService.getState();
      if (!state.settings) state.settings = {};
      state.settings[key] = value;
      await StorageService.saveState(state);
    } catch (error) {
      console.error('Error updating setting:', error);
    }
  };

  const settingItems = [
    {
      title: 'Profile',
      items: [
        {
          title: 'Daily Goal',
          subtitle: `${dailyGoal} ayahs per day`,
          onPress: () => {
            Alert.alert(
              'Change Daily Goal',
              'Select your new daily target',
              [
                { text: '5 ayahs', onPress: () => { setDailyGoal(5); updateSetting('dailyGoal', 5); }},
                { text: '10 ayahs', onPress: () => { setDailyGoal(10); updateSetting('dailyGoal', 10); }},
                { text: '15 ayahs', onPress: () => { setDailyGoal(15); updateSetting('dailyGoal', 15); }},
                { text: '20 ayahs', onPress: () => { setDailyGoal(20); updateSetting('dailyGoal', 20); }},
                { text: 'Cancel', style: 'cancel' }
              ]
            );
          }
        },
        {
          title: 'Name',
          subtitle: userName,
          onPress: () => {
            Alert.prompt(
              'Change Name',
              'Enter your new name',
              (text) => {
                if (text) {
                  setUserName(text);
                  updateSetting('userName', text);
                }
              },
              'plain-text',
              userName
            );
          }
        }
      ]
    },
    {
      title: 'Data',
      items: [
        {
          title: 'Backup Data',
          subtitle: 'Export your progress',
          onPress: () => {
            Alert.alert('Coming Soon', 'Backup feature will be available in the next update.');
          }
        },
        {
          title: 'Restore Data',
          subtitle: 'Import previous backup',
          onPress: () => {
            Alert.alert('Coming Soon', 'Restore feature will be available in the next update.');
          }
        }
      ]
    },
    {
      title: 'Testing',
      items: [
        {
          title: 'Run Diagnostics',
          subtitle: 'Test app functionality',
          onPress: async () => {
            const results = await TestingUtils.runDiagnostics();
            TestingUtils.showDiagnosticResults(results);
          }
        },
        {
          title: 'Load Test Data',
          subtitle: 'Generate sample progress',
          onPress: TestingUtils.loadTestData
        },
        {
          title: 'Reset All Data',
          subtitle: 'Delete all progress',
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

  const SettingItem = ({ item }) => (
  <TouchableOpacity
    style={[styles.settingItem, item.dangerous && styles.dangerousItem]}
    onPress={item.onPress}
  >
    <View style={styles.settingContent}>
      <Text style={[styles.settingTitle, item.dangerous && styles.dangerousText]}>
        {item.title}
      </Text>
      <Text style={[styles.settingSubtitle, item.dangerous && { color: 'rgba(255, 255, 255, 0.8)' }]}>
        {item.subtitle}
      </Text>
    </View>
    <Text style={[styles.settingArrow, item.dangerous && { color: 'white' }]}>→</Text>
  </TouchableOpacity>
);

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
            {settingItems.map((section, sectionIndex) => (
              <View key={sectionIndex} style={styles.section}>
                <Text style={styles.sectionTitle}>{section.title}</Text>
                {section.items.map((item, itemIndex) => (
                  <SettingItem key={itemIndex} item={item} />
                ))}
              </View>
            ))}
          </ScrollView>
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
    fontSize: 20,
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
  dangerousText: {
  color: 'white',
  },
  settingSubtitle: {
  fontSize: 14,
  color: '#666',
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
    color: '#ff3b30',
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
});