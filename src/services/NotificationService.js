import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { StorageService } from './StorageService';
import Constants from 'expo-constants';

// Configure notification behavior
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export class NotificationService {
  static async requestPermissions() {
    try {
      // Check if we're in Expo Go
      const isExpoGo = Constants.executionEnvironment === 'storeClient';
      
      if (isExpoGo) {
        console.warn('Notifications have limitations in Expo Go. For full functionality, use a development build.');
        // Still attempt to set up local notifications which work in Expo Go
      }

      if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('default', {
          name: 'Quran Reminders',
          importance: Notifications.AndroidImportance.MAX,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: '#d4af37',
        });
      }

      const { status } = await Notifications.requestPermissionsAsync();
      
      if (status !== 'granted' && !isExpoGo) {
        console.warn('Notification permission not granted');
      }
      
      return status === 'granted';
    } catch (error) {
      console.error('Error requesting notification permissions:', error);
      return false;
    }
  }

  static async scheduleNotifications(morningTime, eveningTime, dailyGoal) {
    try {
      // Check if we're in Expo Go
      const isExpoGo = Constants.executionEnvironment === 'storeClient';
      
      if (isExpoGo) {
        console.log('Scheduling local notifications (Expo Go has limitations for push notifications)');
      }

      // Cancel existing notifications
      await Notifications.cancelAllScheduledNotificationsAsync();

      // Schedule morning notification
      await Notifications.scheduleNotificationAsync({
        content: {
          title: '🌅 As-salamu alaykum!',
          body: `Ready for today's Quran session? Goal: ${dailyGoal} ayahs`,
          sound: true,
        },
        trigger: {
          hour: morningTime.hour,
          minute: morningTime.minute,
          repeats: true,
        },
      });

      // Schedule evening notification
      await Notifications.scheduleNotificationAsync({
        content: {
          title: '🌙 Don\'t break your streak!',
          body: 'Don\'t forget to memorize the Quran today',
          sound: true,
        },
        trigger: {
          hour: eveningTime.hour,
          minute: eveningTime.minute,
          repeats: true,
        },
      });

      console.log('Notifications scheduled successfully');
      return true;
    } catch (error) {
      console.error('Error scheduling notifications:', error);
      // Don't throw error, just log it since notifications are not critical
      return false;
    }
  }

  static async saveNotificationSettings(morningTime, eveningTime, enabled = true) {
  try {
    let state = await StorageService.getState();
    if (!state) {
      state = {
        settings: {}
      };
    }
    if (!state.settings) {
      state.settings = {};
    }
    
    state.settings.notifications = {
      enabled,
      morningTime,
      eveningTime
    };
    
    await StorageService.saveState(state);
    return true;
  } catch (error) {
    console.error('Error saving notification settings:', error);
    return false;
  }
}

  static async getNotificationSettings() {
    try {
      const state = await StorageService.getState();
      return state?.settings?.notifications || {
        enabled: false,
        morningTime: { hour: 6, minute: 0 },
        eveningTime: { hour: 18, minute: 0 }
      };
    } catch (error) {
      console.error('Error getting notification settings:', error);
      return {
        enabled: false,
        morningTime: { hour: 6, minute: 0 },
        eveningTime: { hour: 18, minute: 0 }
      };
    }
  }

  static async updateStreakNotification(streak) {
    try {
      // Update evening notification with current streak
      const settings = await this.getNotificationSettings();
      if (settings.enabled) {
        await this.scheduleNotifications(
          settings.morningTime,
          settings.eveningTime,
          streak
        );
      }
    } catch (error) {
      console.error('Error updating streak notification:', error);
    }
  }
}