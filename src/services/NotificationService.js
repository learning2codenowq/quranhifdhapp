import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { StorageService } from './StorageService';
import Constants from 'expo-constants';

// Configure notification behavior
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,  
    shouldShowList: true,    
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
    console.log('🔔 Scheduling notifications for:', { morningTime, eveningTime });
    
    // Cancel ALL existing notifications
    await Notifications.cancelAllScheduledNotificationsAsync();
    console.log('🗑️ Cancelled all existing notifications');

    const now = new Date();
    console.log('⏰ Current time:', now.toLocaleString());

    // Calculate next morning time
    const nextMorning = new Date();
    nextMorning.setHours(morningTime.hour, morningTime.minute, 0, 0);
    
    // If morning time has passed today, schedule for tomorrow
    if (nextMorning <= now) {
      nextMorning.setDate(nextMorning.getDate() + 1);
    }

    // Calculate next evening time  
    const nextEvening = new Date();
    nextEvening.setHours(eveningTime.hour, eveningTime.minute, 0, 0);
    
    // If evening time has passed today, schedule for tomorrow
    if (nextEvening <= now) {
      nextEvening.setDate(nextEvening.getDate() + 1);
    }

    console.log('📅 Next morning:', nextMorning.toLocaleString());
    console.log('📅 Next evening:', nextEvening.toLocaleString());

    // Schedule morning notification (FIXED TRIGGER FORMAT)
    await Notifications.scheduleNotificationAsync({
      content: {
        title: '🌅 As-salamu alaykum!',
        body: `Ready for today's Quran session? Goal: ${dailyGoal} ayahs`,
        sound: true,
      },
      trigger: {
        type: 'date',
        date: nextMorning,
        repeats: false,
      },
    });

    // Schedule evening notification (FIXED TRIGGER FORMAT)
    await Notifications.scheduleNotificationAsync({
      content: {
        title: '🌙 Don\'t break your streak!',
        body: 'Don\'t forget to memorize the Quran today',
        sound: true,
      },
      trigger: {
        type: 'date', 
        date: nextEvening,
        repeats: false,
      },
    });

    // Schedule recurring daily notifications (these start from tomorrow onwards)
    const tomorrowMorning = new Date(nextMorning);
    if (tomorrowMorning.toDateString() === now.toDateString()) {
      tomorrowMorning.setDate(tomorrowMorning.getDate() + 1);
    }

    const tomorrowEvening = new Date(nextEvening);
    if (tomorrowEvening.toDateString() === now.toDateString()) {
      tomorrowEvening.setDate(tomorrowEvening.getDate() + 1);
    }

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

    console.log('✅ All notifications scheduled for future times only');
    return true;
  } catch (error) {
    console.error('❌ Error scheduling notifications:', error);
    return false;
  }
}
  static async saveNotificationSettings(morningTime, eveningTime, enabled = true) {
  try {
    let state = await StorageService.getState();
    if (!state) {
      state = { settings: {} };
    }
    if (!state.settings) {
      state.settings = {};
    }
    
    // Save to both locations for compatibility
    state.settings.notifications = {
      enabled,
      morningTime,
      eveningTime
    };
    
    // Also save to main settings for easier access
    state.settings.notificationsEnabled = enabled;
    state.settings.morningTime = morningTime;
    state.settings.eveningTime = eveningTime;
    
    console.log('💾 Saving notification settings:', { enabled, morningTime, eveningTime });
    
    await StorageService.saveState(state);
    
    // Don't auto-schedule here, let the calling function handle it
    return true;
  } catch (error) {
    console.error('❌ Error saving notification settings:', error);
    return false;
  }
}

  static async getNotificationSettings() {
  try {
    const state = await StorageService.getState();
    
    // Check both locations for settings
    const notifications = state?.settings?.notifications;
    const fallbackEnabled = state?.settings?.notificationsEnabled;
    const fallbackMorning = state?.settings?.morningTime;
    const fallbackEvening = state?.settings?.eveningTime;
    
    const settings = {
      enabled: notifications?.enabled || fallbackEnabled || false,
      morningTime: notifications?.morningTime || fallbackMorning || { hour: 6, minute: 0 },
      eveningTime: notifications?.eveningTime || fallbackEvening || { hour: 18, minute: 0 }
    };
    
    console.log('Retrieved notification settings:', settings);
    return settings;
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