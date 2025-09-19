import { StorageService } from '../services/StorageService';
import { AchievementSystem } from './AchievementSystem';

export class QuranUtils {
  static localISO(date = new Date()) {
    return date.toISOString().split('T')[0];
  }

  static async markAyahMemorized(surahId, ayahNumber, difficulty = 2) {
    try {
      const state = await StorageService.getState();
      if (!state.ayahProgress) state.ayahProgress = {};
      if (!state.ayahProgress[surahId]) state.ayahProgress[surahId] = {};
      
      const today = this.localISO();
      const wasAlreadyMemorized = state.ayahProgress[surahId][ayahNumber]?.memorized;
      
      // Store the ayah as memorized with details
      state.ayahProgress[surahId][ayahNumber] = {
        memorized: true,
        dateMemorized: today,
        difficulty: difficulty
      };

      // Only increment daily progress if this ayah wasn't already memorized
      if (!wasAlreadyMemorized) {
        if (!state.progress) state.progress = {};
        state.progress[today] = (state.progress[today] || 0) + 1;
      }

      console.log('Ayah marked as memorized:', surahId, ayahNumber, 'Total today:', state.progress[today]);
      
      await StorageService.saveState(state);
      return state;
    } catch (error) {
      console.error('Error marking ayah as memorized:', error);
      throw error;
    }
  }

  static async unmarkAyahMemorized(surahId, ayahNumber) {
    try {
      const state = await StorageService.getState();
      if (!state.ayahProgress || !state.ayahProgress[surahId]) return state;

      const ayahData = state.ayahProgress[surahId][ayahNumber];
      if (!ayahData || !ayahData.memorized) return state;

      const today = this.localISO();
      const dateMemorized = ayahData.dateMemorized;

      // Remove the ayah memorization
      delete state.ayahProgress[surahId][ayahNumber];

      // If the ayah was memorized today, decrement today's progress
      if (dateMemorized === today) {
        if (state.progress && state.progress[today] > 0) {
          state.progress[today] -= 1;
        }
      }

      await StorageService.saveState(state);
      return state;
    } catch (error) {
      console.error('Error unmarking ayah:', error);
      throw error;
    }
  }

  static computeStats(state) {
    let memorized = 0;
    const total = 6236; // Total ayahs in Quran
    
    // Count all memorized ayahs across all surahs
    if (state && state.ayahProgress) {
      Object.keys(state.ayahProgress).forEach(surahId => {
        Object.keys(state.ayahProgress[surahId]).forEach(ayahNumber => {
          const ayahData = state.ayahProgress[surahId][ayahNumber];
          if (ayahData && ayahData.memorized) {
            memorized++;
          }
        });
      });
    }
    
    console.log('Computing stats - Total memorized:', memorized, 'AyahProgress keys:', Object.keys(state?.ayahProgress || {}));
    
    const remaining = total - memorized;
    const percentComplete = total > 0 ? (memorized / total) * 100 : 0;
    
    // Get daily goal from settings
    const dailyGoal = state?.settings?.dailyGoal || 10;
    
    // Calculate days left based on remaining ayahs and daily goal
    const daysLeft = remaining > 0 ? Math.ceil(remaining / dailyGoal) : 0;
    
    return {
      memorized,
      total,
      remaining,
      percentComplete,
      daily: dailyGoal,
      daysLeft
    };
  }

  static computeStreak(progressData) {
    if (!progressData) return 0;

    const today = new Date();
    let streak = 0;

    for (let i = 0; i < 365; i++) {
      const checkDate = new Date(today);
      checkDate.setDate(today.getDate() - i);
      const dateString = this.localISO(checkDate);
      
      if (progressData[dateString] && progressData[dateString] > 0) {
        streak++;
      } else {
        break;
      }
    }

    return streak;
  }

  static getAyahsMemorizedOnDate(state, dateString) {
    const ayahs = [];
    if (!state?.ayahProgress) return ayahs;
    
    Object.keys(state.ayahProgress).forEach(surahId => {
      Object.keys(state.ayahProgress[surahId]).forEach(ayahNumber => {
        const ayahData = state.ayahProgress[surahId][ayahNumber];
        if (ayahData.memorized && ayahData.dateMemorized === dateString) {
          ayahs.push({
            surahId: parseInt(surahId),
            ayahNumber: parseInt(ayahNumber),
            dateMemorized: ayahData.dateMemorized
          });
        }
      });
    });
    
    return ayahs.sort((a, b) => a.surahId - b.surahId || a.ayahNumber - b.ayahNumber);
  }

  static getConnectionAyahs(state, days = 30) {
    const ayahs = [];
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    // Get ayahs from 2 days ago to 30 days ago (excluding today and yesterday)
    for (let i = 2; i <= days; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateString = this.localISO(date);
      const dayAyahs = this.getAyahsMemorizedOnDate(state, dateString);
      ayahs.push(...dayAyahs);
    }
    
    return ayahs;
  }

  static getRevisionForToday(state) {
    if (!state?.ayahProgress) return [];
    
    const today = new Date();
    const thirtyDaysAgo = new Date(today);
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    // Get all ayahs older than 30 days
    const oldAyahs = [];
    Object.keys(state.ayahProgress).forEach(surahId => {
      Object.keys(state.ayahProgress[surahId]).forEach(ayahNumber => {
        const ayahData = state.ayahProgress[surahId][ayahNumber];
        if (ayahData.memorized && ayahData.dateMemorized) {
          const memDate = new Date(ayahData.dateMemorized + 'T00:00:00');
          if (memDate < thirtyDaysAgo) {
            oldAyahs.push({
              surahId: parseInt(surahId),
              ayahNumber: parseInt(ayahNumber),
              dateMemorized: ayahData.dateMemorized
            });
          }
        }
      });
    });
    
    // Sort by date memorized for consistent grouping
    oldAyahs.sort((a, b) => a.dateMemorized.localeCompare(b.dateMemorized));
    
    if (oldAyahs.length === 0) return [];
    
    // 6-day rotation: Monday=0, Tuesday=1, ..., Saturday=5, Sunday=0
    const dayOfWeek = today.getDay(); // 0=Sunday, 1=Monday, ..., 6=Saturday
    const revisionDay = dayOfWeek === 0 ? 0 : dayOfWeek - 1; // Convert to 0=Monday, 5=Saturday
    
    // Divide ayahs into 6 groups
    const groupSize = Math.ceil(oldAyahs.length / 6);
    const startIndex = revisionDay * groupSize;
    const endIndex = Math.min(startIndex + groupSize, oldAyahs.length);
    
    return oldAyahs.slice(startIndex, endIndex);
  }

  static getTikrarPlan(state) {
    const today = this.localISO();
    const yesterday = this.localISO(new Date(Date.now() - 24 * 60 * 60 * 1000));
    
    const dailyGoal = state.settings?.dailyGoal || 10;
    const todayProgress = state?.progress?.[today] || 0;
    
    // 1. NEW MEMORIZATION - daily goal
    const newMemorization = {
      target: dailyGoal,
      completed: todayProgress,
      description: `Memorize ${dailyGoal} new ayahs today`
    };
    
    // 2. REPETITION OF YESTERDAY - yesterday's ayahs × 5
    const yesterdayAyahs = this.getAyahsMemorizedOnDate(state, yesterday);
    const shouldShowYesterday = yesterdayAyahs.length > 0;
    
    const repetitionOfYesterday = {
      ayahs: yesterdayAyahs,
      repetitionsRequired: 5,
      completed: shouldShowYesterday ? 0 : 1, // Auto-complete if no yesterday ayahs
      totalRecitations: shouldShowYesterday ? yesterdayAyahs.length * 5 : 1,
      description: shouldShowYesterday 
        ? `Repeat yesterday's ${yesterdayAyahs.length} ayahs 5 times each (${yesterdayAyahs.length * 5} total recitations)`
        : 'No ayahs memorized yesterday - Completed!',
      active: shouldShowYesterday
    };
    
    // 3. CONNECTION - last 30 days (excluding today and yesterday)
    const connectionAyahs = this.getConnectionAyahs(state, 30);
    const connection = {
      ayahs: connectionAyahs,
      completed: 0,
      description: `Recite ${connectionAyahs.length} ayahs from last 30 days once each`
    };
    
    // 4. REVISION - 6-day rotation of older ayahs (30+ days old)
    const revisionAyahs = this.getRevisionForToday(state);
    const revision = {
      ayahs: revisionAyahs,
      completed: 0,
      description: revisionAyahs.length > 0 
        ? `Review ${revisionAyahs.length} older ayahs (6-day rotation)`
        : 'No older ayahs for revision yet'
    };
    
    const totalDailyLoad = dailyGoal + 
      (shouldShowYesterday ? yesterdayAyahs.length * 5 : 0) + 
      connectionAyahs.length + 
      revisionAyahs.length;
    
    return {
      newMemorization,
      repetitionOfYesterday,
      connection,
      revision,
      totalDailyLoad
    };
  }

  static getTikrarProgress(state, date = null) {
    if (!date) date = this.localISO();
    return state?.tikrarProgress?.[date] || {
      repetitionOfYesterday: 0,
      connection: 0,
      revision: 0
    };
  }

  static async checkAndAwardAchievements(state) {
    const newAchievements = AchievementSystem.checkAchievements(state);
    if (newAchievements.length > 0) {
      const updatedState = await AchievementSystem.awardAchievements(state, newAchievements);
      await StorageService.saveState(updatedState);
      return { updatedState, newAchievements };
    }
    return { updatedState: state, newAchievements: [] };
  }
}