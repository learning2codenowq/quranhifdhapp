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
  static async updateTikrarProgress(categoryType, progress) {
  try {
    const state = await this.getState();
    if (!state) return false;

    const today = new Date().toISOString().split('T')[0];
    
    if (!state.tikrarProgress) state.tikrarProgress = {};
    if (!state.tikrarProgress[today]) state.tikrarProgress[today] = {};
    
    state.tikrarProgress[today][categoryType] = progress;
    
    const success = await this.saveState(state);
    return success ? state : false;
  } catch (error) {
    ErrorHandler.handleStorageError(error, 'updating Tikrar progress');
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
      tikrarProgress: {},
      earnedAchievements: [],
      settings: {
        dailyGoal: userSettings.dailyGoal || 10,
        userName: userSettings.userName || 'Student',
        progressUnit: 'ayahs'
      }
    };
    
    console.log('Initializing state with:', initialState.settings); // Debug log
    
    await this.saveState(initialState);
    return initialState;
  } catch (error) {
    console.error('Error initializing state:', error);
    throw error;
  }
}
}