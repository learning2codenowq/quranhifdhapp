import AsyncStorage from '@react-native-async-storage/async-storage';
import { ErrorHandler } from '../utils/ErrorHandler';

const STORAGE_KEY = 'quran_mem_tracker_v2';

export class StorageService {
  static async getState() {
    try {
      const stateJson = await AsyncStorage.getItem(STORAGE_KEY);
      if (stateJson) {
        return JSON.parse(stateJson);
      }
      return null;
    } catch (error) {
      ErrorHandler.handleStorageError(error, 'loading state');
      return null;
    }
  }
  
  static async updateRevisionProgress(categoryType, progress) {
    try {
      const state = await this.getState();
      if (!state) return false;

      const today = new Date().toISOString().split('T')[0];
      
      if (!state.revisionProgress) state.revisionProgress = {};
      if (!state.revisionProgress[today]) state.revisionProgress[today] = {};
      
      // Map old category names to new ones
      const categoryMap = {
        'repetitionOfYesterday': 'revision',
        'connection': 'revision', 
        'revision': 'revision',
        'newMemorization': 'newMemorization'
      };
      
      const mappedCategory = categoryMap[categoryType] || categoryType;
      state.revisionProgress[today][mappedCategory] = progress;
      
      const success = await this.saveState(state);
      return success ? state : false;
    } catch (error) {
      ErrorHandler.handleStorageError(error, 'updating revision progress');
      return false;
    }
  }
  
  static async saveState(state) {
    try {
      const stateJson = JSON.stringify(state);
      await AsyncStorage.setItem(STORAGE_KEY, stateJson);
      return true;
    } catch (error) {
      ErrorHandler.handleStorageError(error, 'saving state');
      return false;
    }
  }

  static async initializeState(userSettings = {}) {
  try {
    const initialState = {
      ayahProgress: {},
      progress: {},
      revisionProgress: {},
      earnedAchievements: [],
      lastMemorizedPosition: null,
      settings: {
        dailyGoal: userSettings.dailyGoal || 10,
        userName: userSettings.userName || 'Student',
        progressUnit: 'ayahs',
        autoPlayNext: true,
        showTranslations: true,
        arabicFontSize: 'Medium',
        translationFontSize: 'Medium',
        selectedReciter: userSettings.selectedReciter || null, // NEW LINE
        // Add notification settings to main settings
        notificationsEnabled: userSettings.notificationsEnabled || false,
        morningTime: userSettings.morningTime || { hour: 6, minute: 0 },
        eveningTime: userSettings.eveningTime || { hour: 18, minute: 0 }
      }
    };
    
    await this.saveState(initialState);
    return initialState;
  } catch (error) {
    console.error('Error initializing state:', error);
    throw error;
  }
}

  static async clearState() {
    try {
      await AsyncStorage.removeItem(STORAGE_KEY);
      return true;
    } catch (error) {
      ErrorHandler.handleStorageError(error, 'clearing state');
      return false;
    }
  }
}