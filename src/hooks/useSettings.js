import { useState, useEffect } from 'react';
import { StorageService } from '../services/StorageService';
import { Logger } from '../utils/Logger';
import { getThemedColors } from '../styles/theme';

/**
 * Custom hook to manage app settings
 * Provides settings state and methods to update them
 * Automatically syncs with storage
 */
export const useSettings = () => {
  const [settings, setSettings] = useState({
    // Audio Settings
    autoPlayNext: false,
    selectedReciter: null,
    
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
    
    // Notification Settings
    notificationsEnabled: false,
    morningTime: { hour: 6, minute: 0 },
    eveningTime: { hour: 18, minute: 0 }
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load settings on mount
  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setLoading(true);
      const state = await StorageService.getState();
      
      if (state?.settings) {
        const loadedSettings = {
          // Audio Settings
          autoPlayNext: state.settings.autoPlayNext !== false,
          selectedReciter: state.settings.selectedReciter || null,
          
          // Display Settings
          showTranslations: state.settings.showTranslations !== false,
          arabicFontSize: state.settings.arabicFontSize || 'Medium',
          translationFontSize: state.settings.translationFontSize || 'Medium',
          darkMode: state.settings.darkMode || false,
          tajweedHighlighting: state.settings.tajweedHighlighting || false,
          scriptType: state.settings.scriptType || 'uthmani',
          
          // App Settings
          dailyGoal: state.settings.dailyGoal || 10,
          userName: state.settings.userName || 'Student',
          
          // Notification Settings
          notificationsEnabled: state.settings.notificationsEnabled || false,
          morningTime: state.settings.morningTime || { hour: 6, minute: 0 },
          eveningTime: state.settings.eveningTime || { hour: 18, minute: 0 }
        };
        
        Logger.log('✅ Settings loaded via hook:', loadedSettings);
        setSettings(loadedSettings);
      }
      
      setError(null);
    } catch (err) {
      Logger.error('Error loading settings in hook:', err);
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Update a single setting
   * @param {string} key - Setting key to update
   * @param {any} value - New value
   */
  const updateSetting = async (key, value) => {
    try {
      // Update local state immediately (optimistic update)
      const newSettings = { ...settings, [key]: value };
      setSettings(newSettings);
      
      // Save to storage
      const state = await StorageService.getState();
      if (!state.settings) state.settings = {};
      state.settings[key] = value;
      await StorageService.saveState(state);
      
      Logger.log(`✅ Updated setting: ${key} = ${value}`);
      return true;
    } catch (err) {
      Logger.error(`Error updating setting ${key}:`, err);
      // Revert local state on error
      await loadSettings();
      return false;
    }
  };

  /**
   * Update multiple settings at once
   * @param {Object} updates - Object with key-value pairs to update
   */
  const updateSettings = async (updates) => {
    try {
      // Update local state immediately
      const newSettings = { ...settings, ...updates };
      setSettings(newSettings);
      
      // Save to storage
      const state = await StorageService.getState();
      if (!state.settings) state.settings = {};
      state.settings = { ...state.settings, ...updates };
      await StorageService.saveState(state);
      
      Logger.log('✅ Updated multiple settings:', updates);
      return true;
    } catch (err) {
      Logger.error('Error updating settings:', err);
      // Revert local state on error
      await loadSettings();
      return false;
    }
  };

  /**
   * Get themed colors based on current dark mode setting
   */
  const themedColors = getThemedColors(settings.darkMode);

  return {
    settings,
    loading,
    error,
    updateSetting,
    updateSettings,
    loadSettings,
    themedColors,
    // Individual settings for easy access
    darkMode: settings.darkMode,
    scriptType: settings.scriptType,
    userName: settings.userName,
    dailyGoal: settings.dailyGoal
  };
};