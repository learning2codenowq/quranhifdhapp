import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { StorageService } from '../services/StorageService';
import { QuranUtils } from '../utils/QuranUtils';
import { Logger } from '../utils/Logger';

const AppStateContext = createContext();

export const useAppState = () => {
  const context = useContext(AppStateContext);
  if (!context) {
    throw new Error('useAppState must be used within AppStateProvider');
  }
  return context;
};

export const AppStateProvider = ({ children }) => {
  const [state, setState] = useState(null);
  const [stats, setStats] = useState(null);
  const [dailyProgress, setDailyProgress] = useState(0);
  const [revisionPlan, setRevisionPlan] = useState(null);
  const [achievements, setAchievements] = useState([]);
  const [nextSegment, setNextSegment] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load all app state on mount
  useEffect(() => {
    loadAppState();
  }, []);

  const loadAppState = async () => {
    try {
      setLoading(true);
      let appState = await StorageService.getState();
      
      // Initialize if no state exists
      if (!appState) {
        appState = await StorageService.initializeState();
      }
      
      // Check and award achievements
      const { updatedState, newAchievements } = await QuranUtils.checkAndAwardAchievements(appState);
      setState(updatedState);
      
      // Compute stats
      const computedStats = QuranUtils.computeStats(updatedState);
      setStats(computedStats);
      
      // Get today's progress
      const today = QuranUtils.localISO();
      const todayProgress = updatedState?.progress?.[today] || 0;
      setDailyProgress(todayProgress);
      
      // Get revision plan
      const todaysRevision = QuranUtils.getRevisionPlan(updatedState);
      setRevisionPlan(todaysRevision);
      
      // Get achievements
      const earnedAchievements = updatedState.earnedAchievements || [];
      setAchievements(earnedAchievements);
      
      // Get next memorization segment
      const segment = QuranUtils.getNextMemorizationSegment(updatedState);
      setNextSegment(segment);
      
      Logger.log('✅ Loaded app state:', {
        stats: computedStats,
        todayProgress,
        achievements: earnedAchievements.length
      });
    } catch (error) {
      Logger.error('Error loading app state:', error);
    } finally {
      setLoading(false);
    }
  };

  // Update daily progress (called when ayah is memorized)
  const updateDailyProgress = useCallback(async () => {
    try {
      const appState = await StorageService.getState();
      const today = QuranUtils.localISO();
      const todayProgress = appState?.progress?.[today] || 0;
      setDailyProgress(todayProgress);
      
      // Recompute stats
      const computedStats = QuranUtils.computeStats(appState);
      setStats(computedStats);
      
      Logger.log('✅ Updated daily progress:', todayProgress);
    } catch (error) {
      Logger.error('Error updating daily progress:', error);
    }
  }, []);

  // Update revision progress
  const updateRevisionProgress = async (categoryType, newProgress) => {
    try {
      const success = await StorageService.updateRevisionProgress(categoryType, newProgress);
      if (success) {
        await loadAppState(); // Reload everything
      }
      return success;
    } catch (error) {
      Logger.error('Error updating revision progress:', error);
      return false;
    }
  };

  // Get tikrar progress for today
  const getTikrarProgress = useCallback(() => {
    if (!state) return { newMemorization: 0, revision: 0 };
    return QuranUtils.getTikrarProgress(state);
  }, [state]);

  // Mark confetti as shown for today
  const markConfettiShown = async () => {
    try {
      const appState = await StorageService.getState();
      const today = QuranUtils.localISO();
      appState.lastConfettiDate = today;
      await StorageService.saveState(appState);
      setState(appState);
    } catch (error) {
      Logger.error('Error marking confetti shown:', error);
    }
  };

  const value = {
    state,
    stats,
    dailyProgress,
    revisionPlan,
    achievements,
    nextSegment,
    loading,
    loadAppState,
    updateDailyProgress,
    updateRevisionProgress,
    getTikrarProgress,
    markConfettiShown,
    refreshData: loadAppState
  };

  return (
    <AppStateContext.Provider value={value}>
      {children}
    </AppStateContext.Provider>
  );
};